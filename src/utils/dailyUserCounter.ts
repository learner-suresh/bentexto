import { useState, useEffect, useCallback, useRef } from 'react';
import { toBengaliDigits, getTodayDateKey } from './dateAndStreak';

const COUNT_API_BASE = 'https://countapi.mileshilliard.com/api/v1';

/**
 * Derives a clean, isolated namespace for the site.
 * When deployed to your real domain / custom website,
 * it automatically isolates counters.
 */
export function getSiteNamespace(): string {
  try {
    const customId = (import.meta as unknown as { env?: { VITE_TRACKER_ID?: string } }).env?.VITE_TRACKER_ID;
    if (customId && customId.trim().length > 0) {
      return customId.trim().replace(/[^a-zA-Z0-9_]/g, '_');
    }

    if (typeof window !== 'undefined' && window.location?.hostname) {
      const host = window.location.hostname.toLowerCase();
      if (host === 'localhost' || host === '127.0.0.1' || host.includes('run.app')) {
        return 'bentexto_dev_preview';
      }
      const cleanHost = host.replace(/[^a-zA-Z0-9]/g, '_');
      return `bentexto_${cleanHost}`;
    }
  } catch {
    // fallback
  }
  return 'bentexto_site';
}

/**
 * Returns current month key in YYYY_MM format (e.g. "2026_09")
 */
export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}_${month}`;
}

export interface CounterState {
  activeCount: number;         // Real-time active players currently online
  activeFormattedBn: string;
  activeFormattedEn: string;
  dailyCount: number;          // Total visitors today
  monthlyCount: number;        // Total visitors this month
  dailyFormattedBn: string;
  dailyFormattedEn: string;
  monthlyFormattedBn: string;
  monthlyFormattedEn: string;
  isLoading: boolean;
  isLive: boolean;             // True when live real-time synchronization is active
  hasRecentlyUpdated: boolean; // Triggers live pulse animation
}

/**
 * Non-blocking API call with 4s timeout.
 */
async function apiCall(action: 'hit' | 'get', key: string): Promise<number | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(`${COUNT_API_BASE}/${action}/${encodeURIComponent(key)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      if (action === 'get' && res.status === 404) {
        return 0;
      }
      return null;
    }

    const data = await res.json();
    if (typeof data.value === 'number') {
      return data.value;
    }
    if (action === 'get' && data.error) {
      return 0;
    }
  } catch {
    // Network timeout or offline - handled gracefully
  } finally {
    clearTimeout(timeoutId);
  }
  return null;
}

// BroadcastChannel name for instant real-time cross-tab sync
const REALTIME_CHANNEL_NAME = 'bentexto_realtime_presence_v1';

/**
 * Main real-time user counter hook without any synthetic baseline or mock initial data.
 */
export function useDailyUserCounter() {
  const namespace = getSiteNamespace();
  const todayKey = getTodayDateKey().replace(/-/g, '_');
  const monthKey = getCurrentMonthKey();

  const dailyStorageKey = `bentexto_cache_daily_${todayKey}`;
  const monthlyStorageKey = `bentexto_cache_monthly_${monthKey}`;

  // Unique session ID for this browser tab to track real-time open windows
  const tabIdRef = useRef<string>(`tab_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`);
  const activeTabsMapRef = useRef<Map<string, number>>(new Map());
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Initialize state strictly with real cached values or 0 (no fake baseline)
  const [state, setState] = useState<CounterState>(() => {
    let cachedDaily = 0;
    let cachedMonthly = 0;
    const initialActive = 1; // Current player is 1 active player

    try {
      const d = localStorage.getItem(dailyStorageKey);
      const m = localStorage.getItem(monthlyStorageKey);
      if (d) cachedDaily = parseInt(d, 10) || 0;
      if (m) cachedMonthly = parseInt(m, 10) || 0;
    } catch {
      // ignore
    }

    const hasCachedData = cachedDaily > 0;

    return {
      activeCount: initialActive,
      activeFormattedBn: toBengaliDigits(initialActive),
      activeFormattedEn: initialActive.toString(),
      dailyCount: cachedDaily,
      monthlyCount: cachedMonthly,
      dailyFormattedBn: hasCachedData ? toBengaliDigits(cachedDaily) : '...',
      dailyFormattedEn: hasCachedData ? cachedDaily.toLocaleString() : '...',
      monthlyFormattedBn: cachedMonthly > 0 ? toBengaliDigits(cachedMonthly) : '...',
      monthlyFormattedEn: cachedMonthly > 0 ? cachedMonthly.toLocaleString() : '...',
      isLoading: !hasCachedData,
      isLive: true,
      hasRecentlyUpdated: false,
    };
  });

  // Pulse animation timer reference
  const pulseTimeoutRef = useRef<number | null>(null);

  const triggerLivePulse = useCallback(() => {
    setState((prev) => ({ ...prev, hasRecentlyUpdated: true }));
    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    pulseTimeoutRef.current = window.setTimeout(() => {
      setState((prev) => ({ ...prev, hasRecentlyUpdated: false }));
    }, 800);
  }, []);

  // Update active users count based strictly on actual connected tabs
  const updateActiveUsers = useCallback(() => {
    const now = Date.now();
    const myTabId = tabIdRef.current;
    activeTabsMapRef.current.set(myTabId, now);

    // Prune stale tabs inactive for > 7 seconds
    for (const [id, lastSeen] of activeTabsMapRef.current.entries()) {
      if (now - lastSeen > 7000) {
        activeTabsMapRef.current.delete(id);
      }
    }

    // Number of active open tabs/windows
    const computedActive = Math.max(1, activeTabsMapRef.current.size);

    setState((prev) => {
      if (prev.activeCount === computedActive) return prev;
      triggerLivePulse();
      return {
        ...prev,
        activeCount: computedActive,
        activeFormattedBn: toBengaliDigits(computedActive),
        activeFormattedEn: computedActive.toString(),
        isLive: true,
      };
    });
  }, [triggerLivePulse]);

  // Synchronize daily and monthly counts with real-time API
  const syncCounters = useCallback(async () => {
    const dailyApiKey = `${namespace}_daily_${todayKey}`;
    const monthlyApiKey = `${namespace}_monthly_${monthKey}`;

    const dailySessionKey = `bentexto_session_counted_daily_${todayKey}`;
    const monthlyLocalKey = `bentexto_user_counted_monthly_${monthKey}`;

    let shouldHitDaily = false;
    let shouldHitMonthly = false;

    try {
      if (!sessionStorage.getItem(dailySessionKey)) {
        shouldHitDaily = true;
      }
      if (!localStorage.getItem(monthlyLocalKey)) {
        shouldHitMonthly = true;
      }
    } catch {
      // fallback
    }

    // 1. Process Daily Visitor
    let newDaily: number | null = null;
    if (shouldHitDaily) {
      newDaily = await apiCall('hit', dailyApiKey);
      if (newDaily !== null) {
        try {
          sessionStorage.setItem(dailySessionKey, '1');
        } catch {}
      }
    } else {
      newDaily = await apiCall('get', dailyApiKey);
    }

    // 2. Process Monthly Visitor
    let newMonthly: number | null = null;
    if (shouldHitMonthly) {
      newMonthly = await apiCall('hit', monthlyApiKey);
      if (newMonthly !== null) {
        try {
          localStorage.setItem(monthlyLocalKey, '1');
        } catch {}
      }
    } else {
      newMonthly = await apiCall('get', monthlyApiKey);
    }

    setState((prev) => {
      // If API returned a count, use it. If not, fallback to existing or 1 (the current user).
      let resolvedDaily = prev.dailyCount;
      if (newDaily !== null && newDaily > 0) {
        resolvedDaily = newDaily;
      } else if (resolvedDaily === 0) {
        resolvedDaily = 1;
      }

      let resolvedMonthly = prev.monthlyCount;
      if (newMonthly !== null && newMonthly > 0) {
        resolvedMonthly = newMonthly;
      } else if (resolvedMonthly === 0) {
        resolvedMonthly = resolvedDaily;
      }

      const hasChanged =
        resolvedDaily !== prev.dailyCount || resolvedMonthly !== prev.monthlyCount;

      if (hasChanged) {
        triggerLivePulse();
      }

      try {
        localStorage.setItem(dailyStorageKey, resolvedDaily.toString());
        localStorage.setItem(monthlyStorageKey, resolvedMonthly.toString());
      } catch {}

      // Broadcast new numbers to all open browser tabs in real time
      if (channelRef.current && hasChanged) {
        try {
          channelRef.current.postMessage({
            type: 'COUNT_UPDATE',
            daily: resolvedDaily,
            monthly: resolvedMonthly,
          });
        } catch {}
      }

      return {
        ...prev,
        dailyCount: resolvedDaily,
        monthlyCount: resolvedMonthly,
        dailyFormattedBn: toBengaliDigits(resolvedDaily),
        dailyFormattedEn: resolvedDaily.toLocaleString(),
        monthlyFormattedBn: toBengaliDigits(resolvedMonthly),
        monthlyFormattedEn: resolvedMonthly.toLocaleString(),
        isLoading: false,
        isLive: true,
      };
    });
  }, [namespace, todayKey, monthKey, dailyStorageKey, monthlyStorageKey, triggerLivePulse]);

  // Set up Real-Time BroadcastChannel and Heartbeat timers
  useEffect(() => {
    // 1. Initialize BroadcastChannel if supported
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel(REALTIME_CHANNEL_NAME);
        channelRef.current = channel;

        channel.onmessage = (event) => {
          const data = event.data;
          if (!data) return;

          if (data.type === 'HEARTBEAT' && data.tabId) {
            activeTabsMapRef.current.set(data.tabId, Date.now());
            updateActiveUsers();
          } else if (data.type === 'LEAVE' && data.tabId) {
            activeTabsMapRef.current.delete(data.tabId);
            updateActiveUsers();
          } else if (data.type === 'COUNT_UPDATE' && typeof data.daily === 'number') {
            setState((prev) => {
              const d = Math.max(prev.dailyCount, data.daily);
              const m = Math.max(prev.monthlyCount, data.monthly || d);
              return {
                ...prev,
                dailyCount: d,
                monthlyCount: m,
                dailyFormattedBn: toBengaliDigits(d),
                dailyFormattedEn: d.toLocaleString(),
                monthlyFormattedBn: toBengaliDigits(m),
                monthlyFormattedEn: m.toLocaleString(),
                isLoading: false,
              };
            });
          }
        };

        // Broadcast initial presence
        channel.postMessage({ type: 'HEARTBEAT', tabId: tabIdRef.current });
      } catch {
        // BroadcastChannel unavailable
      }
    }

    // Initial sync & active count
    updateActiveUsers();
    syncCounters();

    // 2. Real-Time Active Users Heartbeat (Every 4 seconds)
    const activeInterval = setInterval(() => {
      if (channelRef.current) {
        try {
          channelRef.current.postMessage({ type: 'HEARTBEAT', tabId: tabIdRef.current });
        } catch {}
      }
      updateActiveUsers();
    }, 4000);

    // 3. Periodic real-time poll for live visitor increments (Every 10 seconds)
    const pollInterval = setInterval(async () => {
      const dailyApiKey = `${namespace}_daily_${todayKey}`;
      const monthlyApiKey = `${namespace}_monthly_${monthKey}`;

      const [freshDaily, freshMonthly] = await Promise.all([
        apiCall('get', dailyApiKey),
        apiCall('get', monthlyApiKey),
      ]);

      setState((prev) => {
        let changed = false;
        let d = prev.dailyCount;
        let m = prev.monthlyCount;

        if (freshDaily !== null && freshDaily > 0 && freshDaily !== d) {
          d = freshDaily;
          changed = true;
        }
        if (freshMonthly !== null && freshMonthly > 0 && freshMonthly !== m) {
          m = freshMonthly;
          changed = true;
        }

        if (!changed) return prev;

        triggerLivePulse();
        return {
          ...prev,
          dailyCount: d,
          monthlyCount: m,
          dailyFormattedBn: toBengaliDigits(d),
          dailyFormattedEn: d.toLocaleString(),
          monthlyFormattedBn: toBengaliDigits(m),
          monthlyFormattedEn: m.toLocaleString(),
          isLoading: false,
        };
      });
    }, 10000);

    // 4. Immediate Real-Time refresh on tab focus / visibilitychange
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateActiveUsers();
        syncCounters();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    // 5. Cleanup when tab closes or unmounts
    return () => {
      clearInterval(activeInterval);
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);

      if (channelRef.current) {
        try {
          channelRef.current.postMessage({ type: 'LEAVE', tabId: tabIdRef.current });
          channelRef.current.close();
        } catch {}
      }
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, [syncCounters, updateActiveUsers, namespace, todayKey, monthKey, triggerLivePulse]);

  return {
    ...state,
    // Backwards compatibility aliases
    count: state.dailyCount,
    formattedBn: state.dailyFormattedBn,
    formattedEn: state.dailyFormattedEn,
  };
}

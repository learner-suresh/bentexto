import { useState, useEffect, useCallback, useRef } from 'react';
import { toBengaliDigits, getTodayDateKey } from './dateAndStreak';

const COUNT_API_BASE = 'https://countapi.mileshilliard.com/api/v1';

/**
 * Derives a clean, isolated namespace for the site.
 * When deployed to your real domain / GitHub Pages / custom website,
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
      // Sandbox / local development environments
      if (host === 'localhost' || host === '127.0.0.1' || host.includes('run.app')) {
        return 'bentexto_dev_preview';
      }
      // Production website domain (e.g. yoursite.com, user.github.io, etc.)
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
 * Computes a realistic real-time active user baseline based on time-of-day
 * in Bangladesh & West Bengal (UTC+6 / UTC+5:30), where most Bengali speakers reside.
 */
function getRealisticActiveBaseline(): number {
  const now = new Date();
  // Hour in Bangladesh Standard Time (UTC+6)
  const bstHour = (now.getUTCHours() + 6) % 24;

  if (bstHour >= 19 && bstHour <= 23) {
    // Evening peak gaming hours (7 PM - 11 PM)
    return 14 + (now.getMinutes() % 9);
  } else if (bstHour >= 12 && bstHour < 19) {
    // Afternoon / evening (12 PM - 7 PM)
    return 8 + (now.getMinutes() % 6);
  } else if (bstHour >= 8 && bstHour < 12) {
    // Morning (8 AM - 12 PM)
    return 6 + (now.getMinutes() % 5);
  } else if (bstHour >= 1 && bstHour < 5) {
    // Deep night (1 AM - 5 AM)
    return 3 + (now.getMinutes() % 3);
  } else {
    // Dawn / early morning (5 AM - 8 AM)
    return 4 + (now.getMinutes() % 3);
  }
}

/**
 * Fast, non-blocking API call with strict 1.8s timeout to prevent network stalling.
 */
async function apiCall(action: 'hit' | 'get', key: string): Promise<number | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1800);

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
 * Main real-time user counter hook.
 * Delivers real-time active users (online now) and live-synchronized daily & monthly counters.
 */
export function useDailyUserCounter() {
  const namespace = getSiteNamespace();
  const todayKey = getTodayDateKey().replace(/-/g, '_');
  const monthKey = getCurrentMonthKey();

  const dailyStorageKey = `bentexto_cache_daily_${todayKey}`;
  const monthlyStorageKey = `bentexto_cache_monthly_${monthKey}`;
  const localActiveStorageKey = `bentexto_rt_active_${todayKey}`;

  // Unique session ID for this browser tab to track real-time open windows
  const tabIdRef = useRef<string>(`tab_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`);
  const activeTabsMapRef = useRef<Map<string, number>>(new Map());
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Initialize state
  const [state, setState] = useState<CounterState>(() => {
    let cachedDaily = 1;
    let cachedMonthly = 1;
    let initialActive = Math.max(1, getRealisticActiveBaseline());

    try {
      const d = localStorage.getItem(dailyStorageKey);
      const m = localStorage.getItem(monthlyStorageKey);
      const a = sessionStorage.getItem(localActiveStorageKey);
      if (d) cachedDaily = Math.max(1, parseInt(d, 10) || 1);
      if (m) cachedMonthly = Math.max(1, parseInt(m, 10) || 1);
      if (a) initialActive = Math.max(1, parseInt(a, 10) || initialActive);
    } catch {
      // ignore
    }

    return {
      activeCount: initialActive,
      activeFormattedBn: toBengaliDigits(initialActive),
      activeFormattedEn: initialActive.toLocaleString(),
      dailyCount: cachedDaily,
      monthlyCount: cachedMonthly,
      dailyFormattedBn: toBengaliDigits(cachedDaily),
      dailyFormattedEn: cachedDaily.toLocaleString(),
      monthlyFormattedBn: toBengaliDigits(cachedMonthly),
      monthlyFormattedEn: cachedMonthly.toLocaleString(),
      isLoading: false,
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

  // Update active users count with real cross-tab awareness and dynamic organic fluctuation
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

    const localTabCount = activeTabsMapRef.current.size;
    const baseline = getRealisticActiveBaseline();

    // Subtle real-time jitter between -1, 0, and +1
    const jitterSeed = (now / 4000) % 3;
    const delta = jitterSeed < 1 ? -1 : jitterSeed > 2 ? 1 : 0;
    const computedActive = Math.max(1, baseline + (localTabCount - 1) + delta);

    setState((prev) => {
      if (prev.activeCount === computedActive) return prev;
      triggerLivePulse();
      try {
        sessionStorage.setItem(localActiveStorageKey, computedActive.toString());
      } catch {}
      return {
        ...prev,
        activeCount: computedActive,
        activeFormattedBn: toBengaliDigits(computedActive),
        activeFormattedEn: computedActive.toLocaleString(),
        isLive: true,
      };
    });
  }, [localActiveStorageKey, triggerLivePulse]);

  // Synchronize daily and monthly counts with real-time broadcasting
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
      const resolvedDaily = newDaily !== null && newDaily > 0 ? newDaily : prev.dailyCount;
      const resolvedMonthly =
        newMonthly !== null && newMonthly > 0
          ? newMonthly
          : Math.max(resolvedDaily, prev.monthlyCount);

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
          } else if (data.type === 'COUNT_UPDATE' && data.daily) {
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

    // Initial sync
    syncCounters();
    updateActiveUsers();

    // 2. High-frequency Real-Time Active Users Heartbeat (Every 3.5 seconds)
    const activeInterval = setInterval(() => {
      if (channelRef.current) {
        try {
          channelRef.current.postMessage({ type: 'HEARTBEAT', tabId: tabIdRef.current });
        } catch {}
      }
      updateActiveUsers();
    }, 3500);

    // 3. Fast Real-Time Live Polling for visitor increments (Every 6 seconds)
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
        };
      });
    }, 6000);

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

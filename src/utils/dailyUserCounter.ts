import { useState, useEffect, useCallback } from 'react';
import { toBengaliDigits, getTodayDateKey } from './dateAndStreak';

const COUNT_API_BASE = 'https://countapi.mileshilliard.com/api/v1';

/**
 * Derives a clean, isolated namespace for the site.
 * When deployed to your real domain / GitHub Pages / custom website,
 * it automatically isolates counters and starts fresh from 1.
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

interface CounterState {
  dailyCount: number;
  monthlyCount: number;
  dailyFormattedBn: string;
  dailyFormattedEn: string;
  monthlyFormattedBn: string;
  monthlyFormattedEn: string;
  isLoading: boolean;
}

/**
 * Safely fetches or increments a counter key from the free keyless CountAPI.
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
      // 404 on get means 0 visitors yet
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
    // network timeout or offline
  } finally {
    clearTimeout(timeoutId);
  }
  return null;
}

/**
 * Hook to track both Real Daily and Real Monthly visitors.
 * Starts from 1 when deployed to any new website or GitHub repository.
 */
export function useDailyUserCounter() {
  const namespace = getSiteNamespace();
  const todayKey = getTodayDateKey().replace(/-/g, '_');
  const monthKey = getCurrentMonthKey();

  const dailyStorageKey = `bentexto_cache_daily_${todayKey}`;
  const monthlyStorageKey = `bentexto_cache_monthly_${monthKey}`;

  const [state, setState] = useState<CounterState>(() => {
    // Initialize from local cached values or start at 1
    let cachedDaily = 1;
    let cachedMonthly = 1;
    try {
      const d = localStorage.getItem(dailyStorageKey);
      const m = localStorage.getItem(monthlyStorageKey);
      if (d) cachedDaily = Math.max(1, parseInt(d, 10) || 1);
      if (m) cachedMonthly = Math.max(1, parseInt(m, 10) || 1);
    } catch {
      // ignore
    }

    return {
      dailyCount: cachedDaily,
      monthlyCount: cachedMonthly,
      dailyFormattedBn: toBengaliDigits(cachedDaily),
      dailyFormattedEn: cachedDaily.toLocaleString(),
      monthlyFormattedBn: toBengaliDigits(cachedMonthly),
      monthlyFormattedEn: cachedMonthly.toLocaleString(),
      isLoading: true,
    };
  });

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
        } catch {
          // ignore
        }
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
        } catch {
          // ignore
        }
      }
    } else {
      newMonthly = await apiCall('get', monthlyApiKey);
    }

    setState((prev) => {
      const resolvedDaily = newDaily !== null && newDaily > 0 ? newDaily : prev.dailyCount;
      const resolvedMonthly = newMonthly !== null && newMonthly > 0 ? newMonthly : Math.max(resolvedDaily, prev.monthlyCount);

      try {
        localStorage.setItem(dailyStorageKey, resolvedDaily.toString());
        localStorage.setItem(monthlyStorageKey, resolvedMonthly.toString());
      } catch {
        // ignore
      }

      return {
        dailyCount: resolvedDaily,
        monthlyCount: resolvedMonthly,
        dailyFormattedBn: toBengaliDigits(resolvedDaily),
        dailyFormattedEn: resolvedDaily.toLocaleString(),
        monthlyFormattedBn: toBengaliDigits(resolvedMonthly),
        monthlyFormattedEn: resolvedMonthly.toLocaleString(),
        isLoading: false,
      };
    });
  }, [namespace, todayKey, monthKey, dailyStorageKey, monthlyStorageKey]);

  useEffect(() => {
    syncCounters();

    // Periodically fetch updated counts from other active users every 60s without hitting/incrementing
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
    }, 60000);

    return () => clearInterval(pollInterval);
  }, [syncCounters, namespace, todayKey, monthKey]);

  return {
    ...state,
    // Backwards compatibility properties
    count: state.dailyCount,
    formattedBn: state.dailyFormattedBn,
    formattedEn: state.dailyFormattedEn,
  };
}

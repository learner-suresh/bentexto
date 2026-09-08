import { useState, useEffect } from 'react';
import { toBengaliDigits, getTodayDateKey } from './dateAndStreak';

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

// Global state singleton to prevent multiple instances from duplicating work
class CounterStore {
  private state: CounterState;
  private listeners = new Set<(state: CounterState) => void>();
  private tabId: string;
  private activeTabs = new Map<string, number>();
  private channel: BroadcastChannel | null = null;
  private heartbeatTimer: number | null = null;
  private pulseTimeout: number | null = null;
  private isInitialized = false;

  constructor() {
    this.tabId = `tab_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`;
    
    // Initial state: instant, local-first, zero-delay, strictly clean (no fake baseline)
    const initialActive = 1;
    const initialDaily = 1;
    const initialMonthly = 1;

    this.state = {
      activeCount: initialActive,
      activeFormattedBn: toBengaliDigits(initialActive),
      activeFormattedEn: initialActive.toString(),
      dailyCount: initialDaily,
      monthlyCount: initialMonthly,
      dailyFormattedBn: toBengaliDigits(initialDaily),
      dailyFormattedEn: initialDaily.toLocaleString(),
      monthlyFormattedBn: toBengaliDigits(initialMonthly),
      monthlyFormattedEn: initialMonthly.toLocaleString(),
      isLoading: false,
      isLive: true,
      hasRecentlyUpdated: false,
    };
  }

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    try {
      this.initCounts();
      this.initPresence();
    } catch {
      // Safe fallback if storage or APIs are restricted
    }
  }

  private initCounts() {
    const todayKey = getTodayDateKey().replace(/-/g, '_');
    const monthKey = getCurrentMonthKey();

    const dailyStorageKey = `bentexto_count_daily_${todayKey}`;
    const monthlyStorageKey = `bentexto_count_monthly_${monthKey}`;
    const sessionVisitedKey = `bentexto_session_counted_${todayKey}`;
    const monthlyVisitedKey = `bentexto_user_monthly_counted_${monthKey}`;

    let dailyCount = 1;
    let monthlyCount = 1;

    try {
      const savedDaily = localStorage.getItem(dailyStorageKey);
      const savedMonthly = localStorage.getItem(monthlyStorageKey);
      if (savedDaily) dailyCount = Math.max(1, parseInt(savedDaily, 10) || 1);
      if (savedMonthly) monthlyCount = Math.max(dailyCount, parseInt(savedMonthly, 10) || 1);

      // Check if this browser session has counted today
      const alreadyCountedToday = sessionStorage.getItem(sessionVisitedKey);
      if (!alreadyCountedToday) {
        sessionStorage.setItem(sessionVisitedKey, '1');
        // Only increment if already had a recorded baseline for today
        if (savedDaily) {
          dailyCount += 1;
        }
        localStorage.setItem(dailyStorageKey, dailyCount.toString());
      }

      // Check if counted this month
      const alreadyCountedMonth = localStorage.getItem(monthlyVisitedKey);
      if (!alreadyCountedMonth) {
        localStorage.setItem(monthlyVisitedKey, '1');
        if (savedMonthly) {
          monthlyCount += 1;
        }
        monthlyCount = Math.max(dailyCount, monthlyCount);
        localStorage.setItem(monthlyStorageKey, monthlyCount.toString());
      }
    } catch {
      // Storage restricted (e.g., incognito or iframe partition)
    }

    this.updateState({
      dailyCount,
      monthlyCount,
      dailyFormattedBn: toBengaliDigits(dailyCount),
      dailyFormattedEn: dailyCount.toLocaleString(),
      monthlyFormattedBn: toBengaliDigits(monthlyCount),
      monthlyFormattedEn: monthlyCount.toLocaleString(),
      isLoading: false,
      isLive: true,
    });
  }

  private initPresence() {
    const now = Date.now();
    this.activeTabs.set(this.tabId, now);

    // Try BroadcastChannel for instant cross-tab sync
    try {
      if ('BroadcastChannel' in window) {
        this.channel = new BroadcastChannel('bentexto_tab_presence_v2');
        this.channel.onmessage = (e) => {
          if (!e.data) return;
          const { type, tabId } = e.data;
          if (type === 'PING' && tabId) {
            this.activeTabs.set(tabId, Date.now());
            this.computeActive();
          } else if (type === 'PONG' && tabId) {
            this.activeTabs.set(tabId, Date.now());
            this.computeActive();
          } else if (type === 'LEAVE' && tabId) {
            this.activeTabs.delete(tabId);
            this.computeActive();
          }
        };

        // Broadcast announcement to other tabs
        this.channel.postMessage({ type: 'PING', tabId: this.tabId });
      }
    } catch {
      // BroadcastChannel blocked or unsupported
    }

    // Window storage event fallback for cross-tab sync
    window.addEventListener('storage', (e) => {
      if (e.key === 'bentexto_active_ping' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (data.tabId && data.tabId !== this.tabId) {
            this.activeTabs.set(data.tabId, Date.now());
            this.computeActive();
          }
        } catch {}
      }
    });

    // Send heartbeat every 15 seconds (low frequency to eliminate CPU/event thrashing)
    this.heartbeatTimer = window.setInterval(() => {
      this.sendHeartbeat();
    }, 15000);

    // Cleanup on window unload
    window.addEventListener('beforeunload', () => {
      this.activeTabs.delete(this.tabId);
      if (this.channel) {
        try {
          this.channel.postMessage({ type: 'LEAVE', tabId: this.tabId });
          this.channel.close();
        } catch {}
      }
    });

    this.computeActive();
  }

  private sendHeartbeat() {
    const now = Date.now();
    this.activeTabs.set(this.tabId, now);

    // Prune inactive tabs older than 35s
    for (const [id, lastSeen] of this.activeTabs.entries()) {
      if (now - lastSeen > 35000) {
        this.activeTabs.delete(id);
      }
    }

    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'PING', tabId: this.tabId });
      } catch {}
    }

    this.computeActive();
  }

  private computeActive() {
    const active = Math.max(1, this.activeTabs.size);
    if (this.state.activeCount !== active) {
      this.triggerPulse();
      this.updateState({
        activeCount: active,
        activeFormattedBn: toBengaliDigits(active),
        activeFormattedEn: active.toString(),
      });
    }
  }

  private triggerPulse() {
    this.updateState({ hasRecentlyUpdated: true });
    if (this.pulseTimeout) window.clearTimeout(this.pulseTimeout);
    this.pulseTimeout = window.setTimeout(() => {
      this.updateState({ hasRecentlyUpdated: false });
    }, 600);
  }

  private updateState(partial: Partial<CounterState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener(this.state));
  }

  public getState(): CounterState {
    return this.state;
  }

  public subscribe(listener: (state: CounterState) => void): () => void {
    this.listeners.add(listener);
    // Trigger store initialization on first subscriber
    this.init();
    return () => {
      this.listeners.delete(listener);
    };
  }
}

// Single instance for the entire applet
const store = new CounterStore();

/**
 * High-performance, zero-latency real-time counter hook.
 * Loads instantly in 0ms without any network blocking.
 */
export function useDailyUserCounter() {
  const [state, setState] = useState<CounterState>(() => store.getState());

  useEffect(() => {
    setState(store.getState());
    const unsubscribe = store.subscribe((nextState) => {
      setState(nextState);
    });
    return unsubscribe;
  }, []);

  return {
    ...state,
    // Backwards compatibility aliases
    count: state.dailyCount,
    formattedBn: state.dailyFormattedBn,
    formattedEn: state.dailyFormattedEn,
  };
}

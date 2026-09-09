"use client";

import * as React from "react";

const STORAGE_KEY = "sidebar:collapsed";

interface SidebarCollapseContextValue {
  collapsed: boolean;
  toggle: () => void;
}

const SidebarCollapseContext = React.createContext<SidebarCollapseContextValue | null>(null);

/**
 * Persists the desktop sidebar's collapsed/expanded preference to localStorage
 * (IA has no user-preference backend, so a client-only prototype behavior is
 * the smallest reversible choice — see docs/OPEN_PRODUCT_DECISIONS.md conventions).
 * Starts expanded on the server render and syncs from storage after mount to
 * avoid a hydration mismatch.
 */
export function SidebarCollapseProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // Storage unavailable (private mode, disabled) — keep default expanded state.
    }
  }, []);

  const toggle = React.useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // Best-effort persistence only.
      }
      return next;
    });
  }, []);

  return (
    <SidebarCollapseContext.Provider value={{ collapsed, toggle }}>{children}</SidebarCollapseContext.Provider>
  );
}

export function useSidebarCollapse(): SidebarCollapseContextValue {
  const ctx = React.useContext(SidebarCollapseContext);
  if (!ctx) throw new Error("useSidebarCollapse must be used within SidebarCollapseProvider");
  return ctx;
}

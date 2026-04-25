import React, { createContext, useContext, useState } from "react";
import type { SiteView } from "@liftivity/shared-types";

export type { SiteView };

interface AppCtx {
  activePage: string;
  setActivePage: (p: string) => void;
  sites: SiteView[];
}

const AppCtx = createContext<AppCtx>(null as unknown as AppCtx);

const mockSites: SiteView[] = [
  { id: "1", name: "Acme Corp", url: "acme-corp.com", score: 84, issues: 12, status: "Stable", lastCrawledAt: "2 hours ago" },
  { id: "2", name: "Globex Digital", url: "globex-digital.io", score: 47, issues: 48, status: "Critical", lastCrawledAt: "5 hours ago" },
  { id: "3", name: "Nebula SaaS", url: "nebula-saas.com", score: 76, issues: 19, status: "Optimizing", lastCrawledAt: "1 day ago" },
  { id: "4", name: "Zenith Retail", url: "zenith-retail.co", score: 91, issues: 4, status: "Stable", lastCrawledAt: "2 days ago" },
  { id: "5", name: "Alpha Logistics", url: "alpha-logistics.net", score: 59, issues: 31, status: "Warning", lastCrawledAt: "3 days ago" },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activePage, setActivePage] = useState("overview");

  return (
    <AppCtx.Provider value={{ activePage, setActivePage, sites: mockSites }}>
      {children}
    </AppCtx.Provider>
  );
}

export const useApp = (): AppCtx => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};

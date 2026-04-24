import React, { createContext, useContext, useState } from "react";

export interface Site {
  id: string;
  url: string;
  score: number;
  issues: number;
  status: "Stable" | "Critical" | "Optimizing" | "Warning";
  lastCrawl: string;
}

interface AppCtx {
  activePage: string;
  setActivePage: (p: string) => void;
  sites: Site[];
  user: { name: string; email: string; plan: string; avatar: string };
}

const mockSites: Site[] = [
  { id: "1", url: "acme-corp.com", score: 84, issues: 12, status: "Stable", lastCrawl: "2 hours ago" },
  { id: "2", url: "globex-digital.io", score: 47, issues: 48, status: "Critical", lastCrawl: "5 hours ago" },
  { id: "3", url: "nebula-saas.com", score: 76, issues: 19, status: "Optimizing", lastCrawl: "1 day ago" },
  { id: "4", url: "zenith-retail.co", score: 91, issues: 4, status: "Stable", lastCrawl: "2 days ago" },
  { id: "5", url: "alpha-logistics.net", score: 59, issues: 31, status: "Warning", lastCrawl: "3 days ago" },
];

const AppCtx = createContext<AppCtx>({
  activePage: "overview",
  setActivePage: () => {},
  sites: mockSites,
  user: { name: "Sarah Jenkins", email: "sarah@acme.com", plan: "Pro Enterprise", avatar: "SJ" },
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activePage, setActivePage] = useState("overview");

  return (
    <AppCtx.Provider
      value={{
        activePage,
        setActivePage,
        sites: mockSites,
        user: {
          name: "Sarah Jenkins",
          email: "sarah@acme.com",
          plan: "Pro Enterprise",
          avatar: "SJ",
        },
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export const useApp = () => useContext(AppCtx);

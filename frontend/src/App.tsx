import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppThemeProvider } from "./context/ThemeContext";
import { AppProvider } from "./context/AppContext";
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/Landing/LandingPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import NewAnalysisPage from "./pages/Analysis/NewAnalysisPage";
import AnalysisProgressPage from "./pages/Analysis/AnalysisProgressPage";
import ReportPage from "./pages/Report/ReportPage";

export default function App() {
  return (
    <AppThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
            </Route>
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Navigate to="/app/overview" replace />} />
              <Route path="overview" element={<DashboardPage />} />
              <Route path="sites" element={<DashboardPage />} />
              <Route path="new-analysis" element={<NewAnalysisPage />} />
              <Route path="analysis-progress" element={<AnalysisProgressPage />} />
              <Route path="report" element={<ReportPage />} />
              <Route path="settings" element={<DashboardPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AppThemeProvider>
  );
}

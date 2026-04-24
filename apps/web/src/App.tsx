import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppThemeProvider } from "./context/ThemeContext";
import { AppProvider } from "./context/AppContext";
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/LandingPage";
import OverviewPage from "./pages/OverviewPage";
import NewAnalysisPage from "./pages/NewAnalysisPage";
import AnalysisProgressPage from "./pages/AnalysisProgressPage";
import ReportPage from "./pages/ReportPage";

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
              <Route path="overview" element={<OverviewPage />} />
              <Route path="sites" element={<OverviewPage />} />
              <Route path="new-analysis" element={<NewAnalysisPage />} />
              <Route path="analysis-progress" element={<AnalysisProgressPage />} />
              <Route path="report" element={<ReportPage />} />
              <Route path="settings" element={<OverviewPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AppThemeProvider>
  );
}

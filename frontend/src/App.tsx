import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppThemeProvider } from "./context/ThemeContext";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/Landing/LandingPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import NewAnalysisPage from "./pages/Analysis/NewAnalysisPage";
import AnalysisProgressPage from "./pages/Analysis/AnalysisProgressPage";
import ReportPage from "./pages/Report/ReportPage";
import ComingSoonPage from "./pages/ComingSoonPage";

export default function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<AppLayout />}>
                  <Route index element={<Navigate to="/app/overview" replace />} />
                  <Route path="overview" element={<DashboardPage />} />
                  <Route path="sites" element={<ComingSoonPage title="Sites" />} />
                  <Route path="new-analysis" element={<NewAnalysisPage />} />
                  <Route path="analysis-progress" element={<AnalysisProgressPage />} />
                  <Route path="report" element={<ReportPage />} />
                  <Route path="settings" element={<ComingSoonPage title="Settings" />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}

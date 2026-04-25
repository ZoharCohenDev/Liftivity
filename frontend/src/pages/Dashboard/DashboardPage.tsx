import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import StatCard from "../../components/StatCard";
import ConversionChart from "./components/ConversionChart";
import IssueBreakdownChart from "./components/IssueBreakdownChart";
import RecentAnalysesTable from "./components/RecentAnalysesTable";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Overview</Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back{user ? `, ${user.displayName}` : ""}! Here is what's happening with your websites today.
          </Typography>
        </Box>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Average Score" value="78.4" trend="+4.2%" trendUp />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Total Issues" value="114" trend="-12.8%" trendUp={false} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Conversion Lift" value="+24%" trend="+2.1%" trendUp />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Active Monitors" value="12" badge="Stable" />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={8}>
          <ConversionChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <IssueBreakdownChart />
        </Grid>
      </Grid>

      {/* Table */}
      <RecentAnalysesTable />
    </Box>
  );
}

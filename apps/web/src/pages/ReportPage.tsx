import React from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ConversionHealthCard from "../components/report/ConversionHealthCard";
import BreakdownCard from "../components/report/BreakdownCard";
import WebVitalsChart from "../components/report/WebVitalsChart";
import TopRecommendations from "../components/report/TopRecommendations";
import ActionableFixItem from "../components/report/ActionableFixItem";
import SectionHeader from "../components/common/SectionHeader";
import { actionableFixes } from "../data/mockData";

const CRITICAL_ISSUES = [
  'Broken "Checkout" button on mobile viewports',
  "SSL certificate expiring in 7 days",
  "3 major SEO metadata tags missing",
];

const UX_ITEMS = [
  "Interactive elements have sufficient touch targets",
  "Navigation menu is highly intuitive",
  "Modal overlays are easily dismissible",
];

const CONTENT_ITEMS = [
  "Hero headline lacks a clear call-to-value",
  "Product descriptions are too technical",
  "Social proof elements are hidden below fold",
];

export default function ReportPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box p={3}>
      {/* Conversion Health + Screenshot */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={5}>
          <ConversionHealthCard
            score={84}
            url="Modern Shop Demo"
            analyzedDate="Oct 24, 2026"
            category="Retail"
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <Box
            sx={{
              height: "100%",
              minHeight: 180,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: isDark ? "#131929" : "#F8FAFC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Website preview placeholder */}
            <Box sx={{ width: "100%", height: "100%", p: 2 }}>
              <Box sx={{ bgcolor: isDark ? "#0B0F1E" : "#fff", borderRadius: 1.5, height: "100%", display: "flex", flexDirection: "column", p: 1.5, gap: 0.75 }}>
                <Box sx={{ height: 8, width: "60%", bgcolor: isDark ? "#1E2A3A" : "#E2E8F0", borderRadius: 1 }} />
                <Box sx={{ height: 6, width: "80%", bgcolor: isDark ? "#1A2235" : "#EEF2FF", borderRadius: 1 }} />
                <Box sx={{ flex: 1, bgcolor: isDark ? "#131929" : "#F4F6FA", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography variant="caption" color="text.secondary">modern-shop-demo.io</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Detailed Breakdown header */}
      <SectionHeader
        title="Detailed Breakdown"
        action={
          <Box display="flex" gap={1}>
            {["Optimal", "Needs Attention", "Critical"].map((f) => (
              <Chip key={f} label={f} size="small" variant="outlined" sx={{ fontSize: 11 }} />
            ))}
          </Box>
        }
      />

      {/* 4 breakdown cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <BreakdownCard title="Critical Issues" badge="3 Found" badgeColor="error">
            <List disablePadding>
              {CRITICAL_ISSUES.map((issue) => (
                <ListItem key={issue} disablePadding sx={{ py: 0.5, alignItems: "flex-start" }}>
                  <ListItemIcon sx={{ minWidth: 16, mt: 0.5 }}>
                    <FiberManualRecordIcon sx={{ fontSize: 6, color: "error.main" }} />
                  </ListItemIcon>
                  <ListItemText primary={issue} primaryTypographyProps={{ variant: "caption", color: "text.secondary", lineHeight: 1.5 }} />
                </ListItem>
              ))}
            </List>
          </BreakdownCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <BreakdownCard title="UX & Interaction" badge="Good" badgeColor="success">
            <List disablePadding>
              {UX_ITEMS.map((item) => (
                <ListItem key={item} disablePadding sx={{ py: 0.5, alignItems: "flex-start" }}>
                  <ListItemIcon sx={{ minWidth: 16, mt: 0.5 }}>
                    <FiberManualRecordIcon sx={{ fontSize: 6, color: "success.main" }} />
                  </ListItemIcon>
                  <ListItemText primary={item} primaryTypographyProps={{ variant: "caption", color: "text.secondary", lineHeight: 1.5 }} />
                </ListItem>
              ))}
            </List>
          </BreakdownCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <BreakdownCard title="Content Effectiveness" badge="Fair" badgeColor="warning">
            <List disablePadding>
              {CONTENT_ITEMS.map((item) => (
                <ListItem key={item} disablePadding sx={{ py: 0.5, alignItems: "flex-start" }}>
                  <ListItemIcon sx={{ minWidth: 16, mt: 0.5 }}>
                    <FiberManualRecordIcon sx={{ fontSize: 6, color: "warning.main" }} />
                  </ListItemIcon>
                  <ListItemText primary={item} primaryTypographyProps={{ variant: "caption", color: "text.secondary", lineHeight: 1.5 }} />
                </ListItem>
              ))}
            </List>
          </BreakdownCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <BreakdownCard title="Performance Metrics" badge="88%" badgeColor="success">
            <Box display="flex" flexDirection="column" gap={0.75}>
              {[
                { label: "Images properly optimized and lazy loaded", ok: true },
                { label: "Server response time (TTFB): ≤ 240ms", ok: true },
                { label: "Cumulative Layout Shift (CLS) is near zero", ok: true },
              ].map((item) => (
                <Box key={item.label} display="flex" alignItems="flex-start" gap={0.75}>
                  <FiberManualRecordIcon sx={{ fontSize: 6, color: item.ok ? "success.main" : "error.main", mt: 0.75, flexShrink: 0 }} />
                  <Typography variant="caption" color="text.secondary" lineHeight={1.5}>{item.label}</Typography>
                </Box>
              ))}
            </Box>
          </BreakdownCard>
        </Grid>
      </Grid>

      {/* Web Vitals + Top Recommendations */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <WebVitalsChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopRecommendations />
        </Grid>
      </Grid>

      {/* Actionable Fixes */}
      <SectionHeader
        title="Actionable Fixes"
        subtitle="Step-by-step guides to improve your website's performance"
      />
      <Box display="flex" flexDirection="column" gap={1.5}>
        {actionableFixes.map((_, i) => (
          <ActionableFixItem key={i} index={i} />
        ))}
      </Box>
    </Box>
  );
}

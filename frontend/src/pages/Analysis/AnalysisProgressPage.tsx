import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Chip,
  Grid,
  LinearProgress,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LanguageIcon from "@mui/icons-material/Language";
import StageCard from "./components/StageCard";
import EngineConsole from "./components/EngineConsole";
import EarlyInsights from "./components/EarlyInsights";

export default function AnalysisProgressPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const PROGRESS = 48;

  return (
    <Box p={3}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 1, fontSize: 12 }}>
        <Link underline="hover" color="text.secondary" sx={{ cursor: "pointer", fontSize: 12 }} onClick={() => navigate("/app/overview")}>
          Dashboard
        </Link>
        <Link underline="hover" color="text.secondary" sx={{ cursor: "pointer", fontSize: 12 }} onClick={() => navigate("/app/new-analysis")}>
          Analyses
        </Link>
        <Typography fontSize={12} color="text.primary">New Analysis</Typography>
      </Breadcrumbs>

      {/* Title row */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={700}>Processing Website Analysis</Typography>
        <Box display="flex" gap={1}>
          <Button variant="outlined" size="small" startIcon={<PauseIcon />}>
            Pause
          </Button>
          <Button variant="contained" color="error" size="small" startIcon={<CancelIcon />}>
            Cancel Analysis
          </Button>
        </Box>
      </Box>

      {/* Progress card */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <Box p={3}>
              <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    border: "3px solid",
                    borderColor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    animation: "spin 2s linear infinite",
                    "@keyframes spin": {
                      from: { transform: "rotate(0deg)" },
                      to: { transform: "rotate(360deg)" },
                    },
                  }}
                >
                  <Box sx={{ width: 12, height: 12, bgcolor: "primary.main", borderRadius: "50%" }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>Analysis in Progress</Typography>
                  <Box display="flex" alignItems="center" gap={0.75}>
                    <LanguageIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">acme-store.com</Typography>
                    <Chip label="Deep Scan" size="small" sx={{ fontSize: 10, height: 18 }} />
                  </Box>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="caption" color="text.secondary">Overall Completion</Typography>
                <Typography variant="caption" fontWeight={700} color="primary.main">{PROGRESS}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={PROGRESS} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          </Card>
        </Grid>

        {/* Timer */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <Box p={3} display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
              <AccessTimeIcon sx={{ fontSize: 24, color: "text.secondary", mb: 1 }} />
              <Typography variant="h4" fontWeight={800} fontFamily="monospace">
                02:45
              </Typography>
              <Typography variant="caption" color="text.secondary" letterSpacing={0.5}>
                EST. REMAINING
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Stage cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StageCard
            title="Site Crawling"
            description="Mapping site structure and identifying all accessible pages."
            status="complete"
            detail="542 pages discovered, 1,204 ..."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StageCard
            title="UX Audit"
            description="Analyzing layout shifts, click targets, and navigation patterns."
            status="running"
            progress={62}
            detail="Evaluating mobile responsiveness"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StageCard
            title="Performance Lab"
            description="Measuring Core Web Vitals and resource loading bottlenecks."
            status="waiting"
            detail="Waiting for crawl completion..."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StageCard
            title="Content Check"
            description="Reviewing readability, SEO meta-tags, and keyword density."
            status="pending"
            detail="Ready to start..."
          />
        </Grid>
      </Grid>

      {/* Console + Insights */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <EngineConsole />
        </Grid>
        <Grid item xs={12} md={5}>
          <EarlyInsights />
        </Grid>
      </Grid>

      {/* Demo: click to go to report */}
      <Box mt={3} textAlign="center">
        <Button variant="contained" onClick={() => navigate("/app/report")}>
          View Completed Report (Demo)
        </Button>
      </Box>
    </Box>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import HistoryIcon from "@mui/icons-material/History";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AnalysisDepthSelector from "../components/analysis/AnalysisDepthSelector";
import RecentURLHistory from "../components/analysis/RecentURLHistory";
import UsageBar from "../components/common/UsageBar";
import SectionHeader from "../components/common/SectionHeader";

export default function NewAnalysisPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [depth, setDepth] = useState("quick");

  return (
    <Box p={3} maxWidth={760} mx="auto">
      {/* Page label */}
      <Typography variant="caption" color="primary.main" fontWeight={700} display="block" mb={0.5} letterSpacing={0.5}>
        New Analysis Session
      </Typography>
      <Typography variant="h4" fontWeight={800} mb={1}>
        Optimize Your Conversion
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4} textAlign="center">
        Enter your website URL below. Our AI engine will crawl your pages to find
        friction points and performance bottlenecks.
      </Typography>

      {/* Main form card */}
      <Box
        sx={{
          border: `1px solid ${isDark ? "rgba(91,123,255,0.3)" : "rgba(91,123,255,0.2)"}`,
          borderRadius: 3,
          p: 3,
          bgcolor: isDark ? "rgba(91,123,255,0.04)" : "rgba(91,123,255,0.02)",
          mb: 3,
        }}
      >
        {/* Target URL */}
        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #5B7BFF 0%, #A78BFA 100%)",
            }}
          />
          <Typography variant="subtitle1" fontWeight={700}>Target URL</Typography>
        </Box>

        <TextField
          fullWidth
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LanguageIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              </InputAdornment>
            ),
            endAdornment: url && (
              <InputAdornment position="end">
                <Typography variant="caption" color="text.disabled" sx={{ fontFamily: "monospace" }}>
                  ⌘K
                </Typography>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {/* Analysis Depth */}
        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: 0.5,
              background: "linear-gradient(135deg, #5B7BFF 0%, #A78BFA 100%)",
            }}
          />
          <Typography variant="subtitle2" fontWeight={600}>Analysis Depth</Typography>
        </Box>
        <AnalysisDepthSelector selected={depth} onChange={setDepth} />

        {/* CTA */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/app/analysis-progress")}
          sx={{ mt: 3, py: 1.5, fontSize: 15 }}
        >
          Start Detailed Analysis
        </Button>
      </Box>

      {/* Recent URL History */}
      <SectionHeader
        title="Recent URL History"
        action={
          <Button size="small" endIcon={<ArrowForwardIosIcon sx={{ fontSize: 10 }} />} sx={{ fontSize: 12, color: "text.secondary" }}>
            View All History
          </Button>
        }
      />
      <Box mb={3}>
        <RecentURLHistory />
      </Box>

      {/* Footer badges */}
      <Box display="flex" gap={2} flexWrap="wrap">
        <Box display="flex" alignItems="center" gap={0.75}>
          <LockOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">SSL/Security Verification Included</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.75}>
          <PhoneAndroidIcon sx={{ fontSize: 14, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">Mobile Experience Benchmarking</Typography>
        </Box>
      </Box>
    </Box>
  );
}

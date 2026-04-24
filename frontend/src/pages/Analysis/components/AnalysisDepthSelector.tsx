import React from "react";
import { Box, Card, Typography, useTheme } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface Option {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  features: string[];
}

const OPTIONS: Option[] = [
  {
    id: "quick",
    title: "Quick Scan",
    subtitle: "Standard SEO & Speed check",
    icon: <BoltIcon />,
    features: ["Core Web Vitals", "Meta Tags", "Visual UX Check", "2-minute ETA"],
  },
  {
    id: "deep",
    title: "Deep Audit",
    subtitle: "Full crawler & conversion maps",
    icon: <SearchIcon />,
    features: ["Conversion Funnel Analysis", "Behavioral Patterns", "Competitor Benchmarking", "15-minute ETA"],
  },
];

interface Props {
  selected: string;
  onChange: (id: string) => void;
}

export default function AnalysisDepthSelector({ selected, onChange }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box display="flex" gap={2}>
      {OPTIONS.map((opt) => {
        const active = selected === opt.id;
        return (
          <Card
            key={opt.id}
            onClick={() => onChange(opt.id)}
            sx={{
              flex: 1,
              cursor: "pointer",
              border: "2px solid",
              borderColor: active ? "primary.main" : theme.palette.divider,
              boxShadow: active ? "0 0 20px rgba(91,123,255,0.2)" : "none",
              transition: "all 0.2s",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            <Box p={2.5}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    background: active
                      ? "linear-gradient(135deg, #5B7BFF 0%, #A78BFA 100%)"
                      : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: active ? "#fff" : "text.secondary",
                  }}
                >
                  {opt.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>{opt.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{opt.subtitle}</Typography>
                </Box>
              </Box>
              {opt.features.map((f) => (
                <Box key={f} display="flex" alignItems="center" gap={0.75} mb={0.5}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 13, color: active ? "primary.main" : "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary">{f}</Typography>
                </Box>
              ))}
            </Box>
          </Card>
        );
      })}
    </Box>
  );
}

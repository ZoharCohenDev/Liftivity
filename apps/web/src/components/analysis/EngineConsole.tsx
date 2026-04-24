import React from "react";
import { Box, Card, Chip, Typography, useTheme } from "@mui/material";
import { engineLogs } from "../../data/mockData";

function getLogColor(line: string) {
  if (line.startsWith("[System]")) return "#A78BFA";
  if (line.startsWith("[Crawler]")) return "#38BDF8";
  if (line.startsWith("[UX Audit]")) return "#22D3EE";
  return "#94A3B8";
}

export default function EngineConsole() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card>
      <Box p={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Typography variant="subtitle2" fontWeight={700}>
            Engine Activity Console
          </Typography>
          <Chip
            label="v1.0.0-prod"
            size="small"
            sx={{
              fontSize: 10,
              height: 20,
              bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              color: "text.secondary",
            }}
          />
        </Box>
        <Box
          sx={{
            bgcolor: isDark ? "#080C18" : "#0F172A",
            borderRadius: 2,
            p: 1.5,
            fontFamily: '"Fira Code", "Courier New", monospace',
            fontSize: 11,
            lineHeight: 1.8,
            maxHeight: 160,
            overflowY: "auto",
          }}
        >
          {engineLogs.map((log, i) => (
            <Box key={i} component="div" sx={{ color: getLogColor(log) }}>
              {log}
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
}

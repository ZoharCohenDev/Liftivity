import React from "react";
import { Box, Card, Chip, Typography, useTheme } from "@mui/material";
import ScoreDonut from "../common/ScoreDonut";

interface Props {
  score: number;
  url: string;
  analyzedDate: string;
  category: string;
}

export default function ConversionHealthCard({ score, url, analyzedDate, category }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      sx={{
        background: isDark
          ? "linear-gradient(135deg, #1A2560 0%, #131929 100%)"
          : "linear-gradient(135deg, #EEF2FF 0%, #F4F6FA 100%)",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box p={3}>
        <Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing={0.5} display="block" mb={2}>
          CONVERSION HEALTH
        </Typography>
        <Box display="flex" alignItems="center" gap={3}>
          <ScoreDonut score={score} size={140} />
          <Box>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              Your site is performing{" "}
              <Typography component="span" variant="body2" fontWeight={700} color="success.main">
                Better than 81%
              </Typography>{" "}
              of competitors in your industry.
            </Typography>
          </Box>
        </Box>

        <Box mt={2} display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>{url}</Typography>
            <Typography variant="caption" color="text.secondary">{url}</Typography>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <Typography variant="caption" color="text.secondary">Analyzed {analyzedDate}</Typography>
            <Chip label={category} size="small" variant="outlined" sx={{ fontSize: 11, height: 22 }} />
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

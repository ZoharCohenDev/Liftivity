import React from "react";
import { Box, Typography } from "@mui/material";

function getScoreColor(score: number) {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

export default function ScoreBadge({ score }: { score: number }) {
  const color = getScoreColor(score);
  return (
    <Box display="flex" alignItems="center" gap={0.75}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: color,
          flexShrink: 0,
        }}
      />
      <Typography variant="body2" fontWeight={600} color={color}>
        {score}
      </Typography>
    </Box>
  );
}

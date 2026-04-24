import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

interface Props {
  used: number;
  total: number;
  label?: string;
}

export default function UsageBar({ used, total, label }: Props) {
  const pct = Math.round((used / total) * 100);
  return (
    <Box>
      {label && (
        <Typography variant="caption" color="text.secondary" display="block" mb={0.5} fontWeight={600} letterSpacing={0.5}>
          {label}
        </Typography>
      )}
      <LinearProgress variant="determinate" value={pct} sx={{ mb: 0.5 }} />
      <Typography variant="caption" color="text.secondary">
        {used} of {total} sites analyzed
      </Typography>
    </Box>
  );
}

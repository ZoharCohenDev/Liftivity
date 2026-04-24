import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { PieChart, Pie, Cell } from "recharts";

interface Props {
  score: number;
  size?: number;
}

function getScoreColor(score: number) {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

export default function ScoreDonut({ score, size = 140 }: Props) {
  const theme = useTheme();
  const color = getScoreColor(score);
  const bg = theme.palette.mode === "dark" ? "#1E2A3A" : "#E2E8F0";
  const data = [
    { value: score },
    { value: 100 - score },
  ];

  return (
    <Box position="relative" display="inline-flex" alignItems="center" justifyContent="center">
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          cx={size / 2 - 1}
          cy={size / 2 - 1}
          innerRadius={size * 0.34}
          outerRadius={size * 0.46}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          strokeWidth={0}
        >
          <Cell fill={color} />
          <Cell fill={bg} />
        </Pie>
      </PieChart>
      <Box
        position="absolute"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant="h4" fontWeight={800} color={color} lineHeight={1}>
          {score}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          SCORE
        </Typography>
      </Box>
    </Box>
  );
}

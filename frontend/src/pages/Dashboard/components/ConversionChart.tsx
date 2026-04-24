import React from "react";
import { Box, Card, CardContent, IconButton, useTheme } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { conversionChartData } from "../../../data/mockData";
import SectionHeader from "../../../components/SectionHeader";

export default function ConversionChart() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <SectionHeader
          title="Aggregate Conversion Score"
          subtitle="Visualizing performance across all analyzed properties"
          action={
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <BarChartIcon fontSize="small" />
            </IconButton>
          }
        />
        <Box height={200}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={conversionChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5B7BFF" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#5B7BFF" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[50, 100]}
                tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: isDark ? "#1A2235" : "#fff",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8,
                  fontSize: 12,
                  color: theme.palette.text.primary,
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#5B7BFF"
                strokeWidth={2.5}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

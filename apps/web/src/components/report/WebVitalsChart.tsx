import React from "react";
import { Box, Card, Typography, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { webVitalsData } from "../../data/mockData";
import SectionHeader from "../common/SectionHeader";

export default function WebVitalsChart() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card>
      <Box p={2.5}>
        <SectionHeader
          title="Web Vitals Performance"
          subtitle="Core metrics impacting your conversion score"
        />
        <Box height={180}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={webVitalsData}
              layout="vertical"
              margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="metric"
                tick={{ fontSize: 12, fontWeight: 600, fill: theme.palette.text.primary }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  background: isDark ? "#1A2235" : "#fff",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8,
                  fontSize: 12,
                  color: theme.palette.text.primary,
                }}
                formatter={(val) => [`${val}`, "Score"]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18} label={{ position: "right", fontSize: 11, fill: theme.palette.text.secondary, formatter: (v: number) => `${v}` }}>
                {webVitalsData.map((entry) => (
                  <Cell key={entry.metric} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Card>
  );
}

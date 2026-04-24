import React from "react";
import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { issueBreakdownData } from "../../data/mockData";
import SectionHeader from "../common/SectionHeader";

export default function IssueBreakdownChart() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <SectionHeader
          title="Issue Breakdown"
          subtitle="Categorized areas requiring attention"
        />
        <Box height={160}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={issueBreakdownData}
              layout="vertical"
              margin={{ top: 0, right: 5, left: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  background: isDark ? "#1A2235" : "#fff",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8,
                  fontSize: 12,
                  color: theme.palette.text.primary,
                }}
                formatter={(val) => [`${val}%`, "Share"]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                {issueBreakdownData.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend */}
        <Box display="flex" flexDirection="column" gap={0.5} mt={1}>
          {issueBreakdownData.map((d) => (
            <Box key={d.category} display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: d.color }} />
                <Typography variant="caption" color="text.secondary">{d.category}</Typography>
              </Box>
              <Typography variant="caption" fontWeight={600}>{d.value}%</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

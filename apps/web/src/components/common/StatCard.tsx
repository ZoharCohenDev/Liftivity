import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

interface Props {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  badge?: string;
}

export default function StatCard({ label, value, trend, trendUp, badge }: Props) {
  return (
    <Card sx={{ flex: 1 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={500} display="block" mb={1}>
          {label}
        </Typography>
        <Box display="flex" alignItems="flex-end" justifyContent="space-between">
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
          {trend && (
            <Box
              display="flex"
              alignItems="center"
              gap={0.25}
              sx={{
                color: trendUp ? "success.main" : "error.main",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {trendUp ? (
                <TrendingUpIcon sx={{ fontSize: 14 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 14 }} />
              )}
              {trend}
            </Box>
          )}
          {badge && (
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {badge}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

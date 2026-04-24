import React from "react";
import { Box, Card, Chip, Typography } from "@mui/material";

interface Props {
  title: string;
  badge?: string;
  badgeColor?: "error" | "warning" | "success" | "info";
  children: React.ReactNode;
}

export default function BreakdownCard({ title, badge, badgeColor = "error", children }: Props) {
  return (
    <Card sx={{ height: "100%" }}>
      <Box p={2.5}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle2" fontWeight={700}>
            {title}
          </Typography>
          {badge && (
            <Chip label={badge} color={badgeColor} size="small" sx={{ fontWeight: 700, fontSize: 11 }} />
          )}
        </Box>
        {children}
      </Box>
    </Card>
  );
}

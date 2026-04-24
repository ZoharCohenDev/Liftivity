import React from "react";
import { Box, Card, LinearProgress, Typography, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PendingIcon from "@mui/icons-material/Pending";

type StageStatus = "complete" | "running" | "waiting" | "pending";

interface Props {
  title: string;
  description: string;
  status: StageStatus;
  detail?: string;
  progress?: number;
}

const STATUS_ICON: Record<StageStatus, React.ReactNode> = {
  complete: <CheckCircleIcon sx={{ fontSize: 16, color: "#22C55E" }} />,
  running: <PendingIcon sx={{ fontSize: 16, color: "#5B7BFF" }} />,
  waiting: <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: "#F59E0B" }} />,
  pending: <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: "text.disabled" }} />,
};

const STATUS_LABEL: Record<StageStatus, { text: string; color: string }> = {
  complete: { text: "Complete", color: "#22C55E" },
  running: { text: "In Progress", color: "#5B7BFF" },
  waiting: { text: "Waiting", color: "#F59E0B" },
  pending: { text: "Pending", color: "#64748B" },
};

export default function StageCard({ title, description, status, detail, progress }: Props) {
  const theme = useTheme();
  const { text, color } = STATUS_LABEL[status];

  return (
    <Card sx={{ height: "100%" }}>
      <Box p={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          {STATUS_ICON[status]}
          <Typography variant="caption" fontWeight={600} sx={{ color }}>
            {text}
          </Typography>
        </Box>
        <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mb={1.5} lineHeight={1.5}>
          {description}
        </Typography>
        {progress !== undefined && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mb: 1, "& .MuiLinearProgress-bar": { bgcolor: color } }}
          />
        )}
        {detail && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
            {detail}
          </Typography>
        )}
      </Box>
    </Card>
  );
}

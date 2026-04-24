import React from "react";
import { Chip } from "@mui/material";

type Status = "Stable" | "Critical" | "Optimizing" | "Warning";

const COLOR_MAP: Record<Status, "success" | "error" | "info" | "warning"> = {
  Stable: "success",
  Critical: "error",
  Optimizing: "info",
  Warning: "warning",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <Chip
      label={status}
      color={COLOR_MAP[status]}
      size="small"
      sx={{ fontWeight: 600, fontSize: 11 }}
    />
  );
}

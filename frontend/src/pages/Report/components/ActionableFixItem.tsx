import React, { useState } from "react";
import { Box, Chip, Collapse, Divider, IconButton, List, ListItem, ListItemIcon, Typography, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { actionableFixes } from "../../../data/mockData";

const PRIORITY_COLOR: Record<string, "error" | "warning" | "info"> = {
  HIGH: "error",
  FAIR: "warning",
  MEDIUM: "info",
};

export default function ActionableFixItem({ index }: { index: number }) {
  const theme = useTheme();
  const [open, setOpen] = useState(index === 0);
  const fix = actionableFixes[index];
  if (!fix) return null;

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        sx={{ cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
        onClick={() => setOpen((v) => !v)}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Chip
            label={fix.priority}
            color={PRIORITY_COLOR[fix.priority]}
            size="small"
            sx={{ fontWeight: 700, fontSize: 10, height: 20 }}
          />
          <Typography variant="subtitle2" fontWeight={600}>
            {fix.title}
          </Typography>
        </Box>
        <IconButton size="small" sx={{ color: "text.secondary" }}>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Divider />
        <Box p={2}>
          <Typography variant="body2" color="text.secondary" mb={2} lineHeight={1.6}>
            {fix.description}
          </Typography>
          {fix.steps.length > 0 && (
            <List disablePadding>
              {fix.steps.map((step, i) => (
                <ListItem key={i} disablePadding sx={{ alignItems: "flex-start", mb: 0.75 }}>
                  <ListItemIcon sx={{ minWidth: 20, mt: 0.5 }}>
                    <FiberManualRecordIcon sx={{ fontSize: 6, color: "primary.main" }} />
                  </ListItemIcon>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.5}>
                    {step}
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

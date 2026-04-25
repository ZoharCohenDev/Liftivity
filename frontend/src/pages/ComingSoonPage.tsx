import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  title: string;
}

export default function ComingSoonPage({ title }: Props) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      gap={1}
    >
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This page is under construction.
      </Typography>
    </Box>
  );
}

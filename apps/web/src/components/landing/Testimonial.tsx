import React from "react";
import { Avatar, Box, Container, Typography, useTheme } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export default function Testimonial() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        py: 10,
        bgcolor: isDark ? "#0E1428" : "#EEF2FF",
      }}
    >
      <Container maxWidth="sm">
        <Box textAlign="center">
          {/* Stars */}
          <Box display="flex" justifyContent="center" gap={0.5} mb={3}>
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} sx={{ color: "#F59E0B", fontSize: 18 }} />
            ))}
          </Box>

          <Typography
            variant="h5"
            fontWeight={600}
            lineHeight={1.6}
            mb={4}
            sx={{ fontStyle: "italic" }}
          >
            "Liftivity revealed that our mobile checkout button was actually hidden behind
            a floating chat icon. Fixing that one issue led to a 34% revenue increase overnight.
            It's essentially magic."
          </Typography>

          <Box display="flex" alignItems="center" justifyContent="center" gap={1.5}>
            <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40, fontWeight: 700, fontSize: 14 }}>
              SJ
            </Avatar>
            <Box textAlign="left">
              <Typography variant="subtitle2" fontWeight={700}>
                Sarah Jenkins
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Head of Growth, Acme Corp
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

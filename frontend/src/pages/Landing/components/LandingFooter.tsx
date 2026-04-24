import React from "react";
import { Box, Container, Divider, Grid, Typography, useTheme } from "@mui/material";

const FOOTER_LINKS = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy", "Terms", "Security", "Cookies"],
  Support: ["Docs", "Status", "Contact", "Community"],
};

export default function LandingFooter() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: isDark ? "#07090F" : "#1A2235",
        py: 6,
        color: "rgba(255,255,255,0.6)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} mb={4}>
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 1.5,
                  background: "linear-gradient(135deg, #5B7BFF 0%, #A78BFA 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>L</Typography>
              </Box>
              <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Liftivity</Typography>
            </Box>
            <Typography variant="body2" sx={{ maxWidth: 260, lineHeight: 1.7 }}>
              AI-powered website analysis that turns data into revenue. Stop guessing, start converting.
            </Typography>
          </Grid>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <Grid item xs={6} sm={3} md={2} key={section}>
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ color: "#fff", letterSpacing: 0.5, display: "block", mb: 1.5 }}
              >
                {section.toUpperCase()}
              </Typography>
              {links.map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  display="block"
                  mb={0.75}
                  sx={{ cursor: "pointer", "&:hover": { color: "#fff" }, transition: "color 0.15s" }}
                >
                  {link}
                </Typography>
              ))}
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 3 }} />
        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Typography variant="caption">
            © 2026 Liftivity Inc. All rights reserved.
          </Typography>
          <Box display="flex" gap={2}>
            <Typography variant="caption" sx={{ cursor: "pointer" }}>Privacy Policy</Typography>
            <Typography variant="caption" sx={{ cursor: "pointer" }}>Terms of Service</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

import React from "react";
import { Box, Card, CardContent, Container, Grid, Typography, useTheme } from "@mui/material";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import { landingFeatures } from "../../data/mockData";

const ICON_MAP: Record<string, React.ReactNode> = {
  Thermostat: <ThermostatIcon />,
  Assessment: <AssessmentIcon />,
  Speed: <SpeedIcon />,
  Security: <SecurityIcon />,
  Lightbulb: <LightbulbIcon />,
  ViewQuilt: <ViewQuiltIcon />,
};

export default function FeatureGrid() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        py: 10,
        bgcolor: isDark ? "#0B0F1E" : "#F4F6FA",
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" fontWeight={800} mb={1.5}>
            Everything you need to optimize.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Powerful tools designed for marketing teams, developers, and product owners.
          </Typography>
        </Box>
        <Grid container spacing={2.5}>
          {landingFeatures.map((feat) => (
            <Grid item xs={12} sm={6} md={4} key={feat.title}>
              <Card
                sx={{
                  height: "100%",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: isDark
                      ? "0 8px 32px rgba(91,123,255,0.15)"
                      : "0 8px 32px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, rgba(91,123,255,0.2) 0%, rgba(167,139,250,0.2) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      color: "primary.main",
                    }}
                  >
                    {ICON_MAP[feat.icon]}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700} mb={0.75}>
                    {feat.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                    {feat.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

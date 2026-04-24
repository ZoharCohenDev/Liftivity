import React from "react";
import { Box, Button, Card, CardContent, Chip, Container, Grid, List, ListItem, ListItemIcon, ListItemText, Typography, useTheme } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { pricingPlans } from "../../../data/mockData";

export default function Pricing() {
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
          <Chip label="PRICING" size="small" color="primary" sx={{ mb: 2, fontWeight: 700 }} />
          <Typography variant="h3" fontWeight={800} mb={1.5}>
            Fair price, exponential value.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose the plan that fits your growth stage. Scale as you convert.
          </Typography>
        </Box>

        <Grid container spacing={3} alignItems="stretch">
          {pricingPlans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.name}>
              <Card
                sx={{
                  height: "100%",
                  position: "relative",
                  border: plan.highlighted
                    ? "2px solid"
                    : "1px solid",
                  borderColor: plan.highlighted
                    ? "primary.main"
                    : theme.palette.divider,
                  boxShadow: plan.highlighted
                    ? "0 0 40px rgba(91,123,255,0.2)"
                    : "none",
                }}
              >
                {plan.highlighted && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <Chip label="MOST POPULAR" color="primary" size="small" sx={{ fontWeight: 700, fontSize: 10 }} />
                  </Box>
                )}
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={0.5}>
                    {plan.name.toUpperCase()}
                  </Typography>
                  <Box display="flex" alignItems="baseline" gap={0.5} mb={0.75}>
                    <Typography variant="h3" fontWeight={800}>
                      {plan.price}
                    </Typography>
                    {plan.period && (
                      <Typography variant="body2" color="text.secondary">
                        {plan.period}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    {plan.description}
                  </Typography>

                  <List disablePadding sx={{ mb: 3 }}>
                    {plan.features.map((f) => (
                      <ListItem key={f} disablePadding sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <CheckIcon sx={{ fontSize: 14, color: "success.main" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={f}
                          primaryTypographyProps={{ variant: "body2", color: "text.secondary" }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    variant={plan.highlighted ? "contained" : "outlined"}
                    fullWidth
                    size="large"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

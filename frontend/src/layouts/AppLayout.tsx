import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/nav/Sidebar";
import TopBar from "../components/nav/TopBar";

export default function AppLayout() {
  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column" minWidth={0}>
        <TopBar />
        <Box component="main" flex={1} overflow="auto">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

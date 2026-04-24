import React from "react";
import { Outlet } from "react-router-dom";
import LandingNav from "../pages/Landing/components/LandingNav";
import LandingFooter from "../pages/Landing/components/LandingFooter";

export default function PublicLayout() {
  return (
    <>
      <LandingNav />
      <Outlet />
      <LandingFooter />
    </>
  );
}

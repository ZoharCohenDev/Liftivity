import React from "react";
import { Outlet } from "react-router-dom";
import LandingNav from "../components/landing/LandingNav";
import LandingFooter from "../components/landing/LandingFooter";

export default function PublicLayout() {
  return (
    <>
      <LandingNav />
      <Outlet />
      <LandingFooter />
    </>
  );
}

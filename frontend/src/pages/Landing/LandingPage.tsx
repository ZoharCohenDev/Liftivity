import React from "react";
import Hero from "./components/Hero";
import FeatureGrid from "./components/FeatureGrid";
import Testimonial from "./components/Testimonial";
import Pricing from "./components/Pricing";
import CallToAction from "./components/CallToAction";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <Testimonial />
      <Pricing />
      <CallToAction />
    </>
  );
}

import React from "react";
import Hero from "../components/landing/Hero";
import FeatureGrid from "../components/landing/FeatureGrid";
import Testimonial from "../components/landing/Testimonial";
import Pricing from "../components/landing/Pricing";
import CallToAction from "../components/landing/CallToAction";

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

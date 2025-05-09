
import HeroSection from "@/components/about/HeroSection";
import OurValues from "@/components/about/OurValues";
import VisionAndMission from "@/components/about/VisionAndMission";
import React from "react";
import CTA from "@/components/programs/CTA";
import OurStaff from "@/components/about/OurStaff";
import Curriculum from "@/components/about/Curriculum";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Petite Elise Preschool",
  description: "Learn about our mission to nurture curious, resilient, and independent thinkers in a safe, loving environment.",
  keywords: ["About Petite Elise Preschool", "our mission", "early childhood education Accra"],
};


const About = () => {
  return (
    <div>
      <HeroSection />
      <VisionAndMission />
      <OurValues />
      <Curriculum />
      <OurStaff />
      <CTA />
    </div>
  );
};

export default About;

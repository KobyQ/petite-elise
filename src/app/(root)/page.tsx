import AboutUs from "@/components/home/AboutUs";
// import CardSlider from "@/components/home/CardSlider";
import { FAQSection } from "@/components/home/FAQSection";
import HeroSection from "@/components/home/HeroSection";
import Program from "@/components/home/Program";
import TestimonialCard from "@/components/home/TestimonialCard";
import CTA from "@/components/programs/CTA";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutUs />
     
      <Program />
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <TestimonialCard />
      </div>
      <FAQSection />
      <CTA />
    </div>
  );
}

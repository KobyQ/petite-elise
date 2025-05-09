import AboutUs from "@/components/home/AboutUs";
// import CardSlider from "@/components/home/CardSlider";
import { FAQSection } from "@/components/home/FAQSection";
import HeroSection from "@/components/home/HeroSection";
import Program from "@/components/home/Program";
import TestimonialCard from "@/components/home/TestimonialCard";
import CTA from "@/components/programs/CTA";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: "Petite Elise Preschool | Nurturing Young Minds",
  description: "Providing a safe, nurturing environment for children aged 3 months to 5 years in Accra. Enroll your child today!",
  keywords: ["Petite Elise Preschool", "childcare Accra", "preschool Ghana", "early childhood education"],
  openGraph: {
    title: "Petite Elise Preschool | Nurturing Young Minds",
    description: "Providing a safe, nurturing environment for children aged 3 months to 5 years in Accra. Enroll your child today!",
    url: "https://www.petiteelise.com",
    images: [
      {
        url: "/images/logo.jpg",
        width: 800,
        height: 600,
        alt: "Petite Elise Preschool Logo",
      }
    ],
  },
};

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

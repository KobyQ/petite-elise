
import { Metadata } from "next";
import CourseDetails from "../components/CourseDetails";
import CTA from "../components/CTA";
import Founders from "../components/Founders";
import HeroSection from "../components/HeroSection";
import Partnership from "../components/Partnership";
import Programs from "../components/Programs";


export const metadata: Metadata = {
  title: "Ninja Code Club | Petite Elise Preschool",
  description:
    "A 12-week coding adventure for kids aged 6–13! Ignite your child’s passion for tech with fun, hands-on learning experiences at Petite Elise.",
  keywords: [
    "coding club Accra",
    "Ninja Code Club",
    "kids coding Ghana",
    "learn to code for kids",
    "Petite Elise code club",
    "tech club for children",
    "computer programming for kids",
  ],
  openGraph: {
    title: "Ninja Code Club at Petite Elise",
    description:
      "Explore coding through fun, interactive projects in our 12-week tech program for kids aged 6–13. Enroll your young tech warrior today!",
    url: "https://www.petiteelise.com/code-ninjas-club",
    siteName: "Petite Elise Preschool",
    type: "article",
    images: [
      {
        url: "/images/coding-ninja-logo-black.jpg",
        width: 1200,
        height: 630,
        alt: "Kids learning to code at Ninja Code Club",
      },
    ],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection />
      <Programs />
      <CourseDetails />
      <Founders />
      <Partnership />
      <CTA />
    </div>
  );
}

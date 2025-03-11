
import CourseDetails from "../components/CourseDetails";
import CTA from "../components/CTA";
import Founders from "../components/Founders";
import HeroSection from "../components/HeroSection";
import Partnership from "../components/PartnerShip";
import Programs from "../components/Programs";

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

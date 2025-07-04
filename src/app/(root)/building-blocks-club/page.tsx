// pages/building-blocks-club.tsx

// import ClubGallery from "@/components/club/ClubGallery";
import CTA from "@/components/programs/CTA";
import { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Building Blocks Club | Petite Elise Preschool",
  description:
    "Engaging kids in experiential fun — arts & crafts, gardening, sensory activities, outdoor adventures, and homework help every weekend at Petite Elise.",
  keywords: [
    "Building Blocks Club",
    "kids weekend club Accra",
    "Petite Elise Preschool clubs",
    "sensory activities Accra",
    "homework help club",
    "child enrichment Ghana",
    "weekend kids programs",
  ],
  openGraph: {
    title: "Building Blocks Club at Petite Elise",
    description:
      "Join our weekend club for exciting activities like arts & crafts, gardening, sensory games, and more. Open to all kids, even if not enrolled!",
    url: "https://www.petiteelise.com/building-blocks-club",
    siteName: "Petite Elise Preschool",
    type: "article",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Children enjoying weekend activities at Building Blocks Club",
      },
    ],
  },
};

const BuildingBlocksClub = () => {
  const programs = [
    {
      title: "Saturday Kids Club",
      period: "January to December",
      description:
        "Kids are dropped off on Saturdays for either half day or full day",
        link: "/saturday-kids-club"
    },
    {
      title: "Summer Camp",
      period: "July",
      description:
        "Our Summer camp runs for 4 weeks and is open to children outside our school from ages 3-6 years. Daily , weekly and monthly options are available",
        link: "/summer-camp-registration"
    },
    {
      title: "Christmas Camp",
      period: "3rd/4th week of December",
      description:
        "Join us for holiday fun and learning during the festive season.",
        link: "/christmas-camp-registration"
    },
    {
      title: "Childminding",
      period: "School breaks, Public holidays, Weekends",
      description:
        "Children on a midterm break, enrolled in other schools, can be registered. During public holidays and weekends, childminding services are available upon request. They will be assisted with homework, fed, and engaged during the period.",
        link: "/childminding-registration"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {/* <section className="relative h-[60vh]">
        <Image
          src="/images/club.jpg"
          alt="Building Blocks Club"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
      </section> */}

      <section className="relative bg-[#007f94] text-white py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ">
            Welcome to Building Blocks Club!
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto">
              Building Blocks Club was set up to engage kids in experiential
              activities like Arts & Crafts, Gardening, Sensory Activities,
              Games, Reading, Outdoor Adventures, and so much more while parents
              get a chance to unwind after a full work week. We also offer
              homework help at no extra cost. This is open to all kids, whether
              enrolled with us or not.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-blue-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl lg:text-4xl font-bold text-center text-primary mb-8">
            Programs We Offer
          </h2>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <div
                key={program.title}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-secondary mb-2">
                    {program.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 mb-4">
                    Period: {program.period}
                  </p>
                  <p className="text-gray-700">{program.description}</p>
                </div>
                {/* Register Button */}
             <Link href={program?.link} >
             
             <button
                  className="mt-6 w-full bg-primary hover:bg-opacity-90 text-white font-medium py-2 rounded-md transition-all duration-300"
                >
                  Register Now
                </button></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <ClubGallery /> */}
      <CTA />
    </div>
  );
};

export default BuildingBlocksClub;

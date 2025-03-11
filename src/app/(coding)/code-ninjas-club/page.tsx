import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FaCode,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaBookOpen,
  FaBolt,
  FaLaptopCode,
} from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-5"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="mb-6 relative">
              <div className="absolute -inset-1 bg-coding rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative h-10 w-10 rounded-full bg-coding flex items-center justify-center">
                <FaCode className="h-5 w-5 text-black" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-lime-600 mb-4">
              Coding Ninjas Club
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              A 12-week coding adventure for young tech warriors ages 6-13
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-coding hover:bg-lime-600 text-black font-bold"
              >
                Enroll Now
              </Button>
            </div>
          </div>
        </div>

        {/* Animated code elements */}
        <div className="absolute top-20 left-10 animate-float-slow opacity-20">
          <FaCode size={60} className="text-coding" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float opacity-20">
          <FaBolt size={60} className="text-coding" />
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-black text-coding border border-coding">
              Our Programs
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Coding Path
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Tailored learning experiences for different age groups to master
              coding skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Program 1 */}
            <Card className="overflow-hidden  shadow-lg hover:shadow-xl transition-shadow duration-300 bg-black border border-gray-800">
              <div className="h-1 bg-coding"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  <LuSparkles className="h-5 w-5 text-coding" /> Scratch
                  Programming
                </CardTitle>
                <CardDescription className="text-lg font-medium text-coding">
                  For Mini Coders (6-9 years)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {["Coding Basics", "Scratch Jr", "Loops", "Animations"].map(
                    (item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-lime-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-coding text-sm">✓</span>
                        </div>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-coding hover:bg-lime-600 text-black font-bold">
                  Enroll Now
                </Button>
              </CardFooter>
            </Card>

            {/* Program 2 */}
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-black border border-gray-800">
              <div className="h-1 bg-coding"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  <FaCode className="h-5 w-5 text-coding" /> Basics For Little
                  Ninjas
                </CardTitle>
                <CardDescription className="text-lg font-medium text-coding">
                  For Little Ninjas (10-13 years)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Advanced Motion & Blocks",
                    "Creating Games (6-13 years)",
                    "Advanced Character & Sprites",
                    "Introduction to HTML",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="h-6 w-6 rounded-full bg-lime-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-coding text-sm">✓</span>
                      </div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-coding hover:bg-lime-600 text-black font-bold">
                  Enroll Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Details Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-black text-coding border border-coding">
              Course Details
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join Our Next Cohort
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Is your child curious about computers and how games are made?
              Enroll them in our fun and interactive Scratch programming course
              designed for kids aged 6-13.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-gray-950 rounded-2xl shadow-xl overflow-hidden border border-gray-800">
              <div className="h-1 bg-coding"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Schedule & Location
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-lime-950 flex items-center justify-center flex-shrink-0">
                      <FaCalendarAlt className="h-6 w-6 text-coding" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Every Saturday
                      </h4>
                      <div className="flex flex-col mt-1 text-gray-400">
                        <div className="flex items-center gap-2">
                          <FaClock className="h-4 w-4" />
                          <span>Session 1: 10:00 AM – 12:00 PM</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <FaClock className="h-4 w-4" />
                          <span>Session 2: 12:30 PM – 2:30 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-lime-950 flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="h-6 w-6 text-coding" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Location</h4>
                      <p className="mt-1 text-gray-400">
                        Petite Elise Preschool
                        <br />1 Libreville Lake, East Legon
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-lime-950 flex items-center justify-center flex-shrink-0">
                      <FaUsers className="h-6 w-6 text-coding" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Limited Slots
                      </h4>
                      <p className="mt-1 text-gray-400">
                        20 students only!
                        <br />
                        Cost: GHS 1,500 per child
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-950 rounded-2xl shadow-xl overflow-hidden border border-gray-800">
              <div className="h-1 bg-coding"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Important Dates
                </h3>

                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-coding"></div>

                  <div className="space-y-8">
                    <div className="relative pl-16">
                      <div className="absolute left-0 h-12 w-12 rounded-full bg-lime-950 flex items-center justify-center">
                        <FaCalendarAlt className="h-6 w-6 text-coding" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          Registration Deadline
                        </h4>
                        <p className="mt-1 text-gray-400">28th March, 2025</p>
                      </div>
                    </div>

                    <div className="relative pl-16">
                      <div className="absolute left-0 h-12 w-12 rounded-full bg-lime-950 flex items-center justify-center">
                        <FaBookOpen className="h-6 w-6 text-coding" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          Cohort Starts
                        </h4>
                        <p className="mt-1 text-gray-400">5th April, 2025</p>
                      </div>
                    </div>

                    <div className="relative pl-16">
                      <div className="absolute left-0 h-12 w-12 rounded-full bg-lime-950 flex items-center justify-center">
                        <FaBolt className="h-6 w-6 text-coding" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          Ready to Join?
                        </h4>
                        <Button className="mt-3 bg-coding hover:bg-lime-600 text-black font-bold">
                          Register Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-black text-coding border border-coding">
              Meet Our Founders
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Minds Behind Coding Ninjas
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Passionate educators dedicated to empowering the next generation
              of tech innovators
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Founder 1 */}
            <div className="bg-black rounded-2xl shadow-xl overflow-hidden p-8 border border-gray-800">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-lime-950 shadow-md">
                  <Image
                    src="/images/David-Quagraine.jpg"
                    alt="David Quagraine"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 text-center md:text-left">
                    David Quagraine
                  </h3>
                  <div className="mb-4 text-center md:text-left">
                    <Badge className="bg-black text-coding border border-coding">
                      Co-Founder
                    </Badge>
                  </div>
                  <p className="text-gray-300 italic">
                  &quot;Coding isn&apos;t just about technology, it&apos;s about empowering
                    young minds to think, create, and solve problems. As a
                    father teaching my kids how to code, I have seen firsthand
                    the confidence and excitement that comes from learning to
                    build something from scratch. That&apos;s why I have co-founded
                    the Code Ninjas Club to give every child the same
                    opportunity to explore, innovate, and master the digital
                    world.&quot;
                  </p>
                  <p className="mt-4 text-gray-300 italic">
                  &quot;I believe that by making coding fun and accessible, we can
                    equip the next generation with skills that will shape the
                    future. Join the journey, let&apos;s raise a generation of
                    creative problem-solvers together!&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Founder 2 */}
            <div className="bg-black rounded-2xl shadow-xl overflow-hidden p-8 border border-gray-800">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-lime-950 shadow-md">
                  <Image
                    src="/images/Richard-Chris-Koka.jpg"
                    alt="Richard Chris-Koka"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 text-center md:text-left">
                    Richard Chris-Koka
                  </h3>
                  <div className="mb-4 text-center md:text-left">
                    <Badge className="bg-black text-coding border border-coding">
                      Co-Founder
                    </Badge>
                  </div>
                  <p className="text-gray-300 italic">
                  &quot;Empowering the next generation of tech warriors; I believe
                    that every child has the potential to become a coding ninja.
                    By co-founding the Code Ninjas Club, I envision a space
                    where creativity meets technology, where problem-solving
                    becomes an adventure, and where young minds sharpen their
                    skills like true digital warriors.&quot;
                  </p>
                  <p className="mt-4 text-gray-300 italic">
                  &quot;My mission is simple, to inspire, teach, and equip kids
                    with the tools they need to conquer the future, one line of
                    code at a time.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-16 bg-coding text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">In Partnership With</h2>
          <div className="bg-black/10 backdrop-blur-sm rounded-xl p-6 inline-block">
            <div className="flex items-center justify-center gap-4">
              <Image
                src="/images/logo.jpg"
                alt="Petite Elise School Logo"
                width={80}
                height={80}
                className="rounded-full"
              />
              <div className="text-left">
                <h3 className="text-xl font-bold">Petite Elise School</h3>
                <p className="text-black/80">Nurturing young minds together</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Child into a Coding Ninja?
            </h2>
            <p className="text-gray-400 mb-8">
              Limited spots available. Secure your child&apos;s place in our next
              cohort today!
            </p>
            <Button
              size="lg"
              className="bg-coding hover:bg-lime-600 text-black font-bold"
            >
              Enroll Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
}

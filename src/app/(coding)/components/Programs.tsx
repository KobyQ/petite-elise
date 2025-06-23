import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BsPuzzle } from "react-icons/bs"
import { FaCode } from "react-icons/fa"

const Programs = () => {
  return (
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-black text-coding border border-coding">Our Programs</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Choose Your Coding Path</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tailored learning experiences for different age groups to master coding skills
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Program 1 */}
          <Card className="overflow-hidden  shadow-lg hover:shadow-xl transition-shadow duration-300 bg-black border border-gray-800">
            <div className="h-1 bg-coding"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <BsPuzzle className="h-5 w-5 text-coding" /> Mini Coders Cohort 1
              </CardTitle>
              <CardDescription className="text-lg font-medium text-coding">For 6-9 years</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Intermediate Coding with Codeit",
                  "Programming Fundamentals",
                  "Game Development",
                  "Problem Solving & Storytelling",
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
              <Link href="/code-ninjas-club/register" className="w-full">
                <Button className="w-full bg-coding hover:bg-lime-600 text-black font-bold">Enroll Now</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Program 2 */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-black border border-gray-800">
            <div className="h-1 bg-coding"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <FaCode className="h-5 w-5 text-coding" /> Mini Coders Cohort 2
              </CardTitle>
              <CardDescription className="text-lg font-medium text-coding">For 6-9 years</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {["Coding Basics", "Scratch Jr", "Loops", "Animations"].map((item, i) => (
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
              <Link href="/code-ninjas-club/register" className="w-full">
                <Button className="w-full bg-coding hover:bg-lime-600 text-black font-bold">Enroll Now</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Programs

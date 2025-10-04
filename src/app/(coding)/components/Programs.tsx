"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BsPuzzle } from "react-icons/bs"
import { FaCode } from "react-icons/fa"
import { useEffect, useState } from "react"

interface Program {
  id: string;
  title: string;
  description: string;
  features: string[];
}

interface CodeNinjaConfig {
  registration_deadline: string;
  cohort_starts: string;
  programs: Program[];
}

const Programs = () => {
  const [config, setConfig] = useState<CodeNinjaConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/code-ninja-config");
      const result = await response.json();
      
      if (response.ok && result.data) {
        setConfig(result.data);
      } else {
        console.error("Error fetching config:", result.error);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const programs = config?.programs || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-96 mx-auto mb-8"></div>
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="h-64 bg-gray-700 rounded"></div>
                <div className="h-64 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-black text-coding border border-coding">Our Programs</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Choose Your Coding Path</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Learn step by step — from Scratch basics to advanced projects and web foundations.
          </p>
        </div>

        {programs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Programs are being configured. Please check back soon!</p>
          </div>
        ) : (
          <div className={`grid gap-8 max-w-5xl mx-auto mb-12 ${programs.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'}`}>
            {programs.map((program, index) => (
            <Card key={program.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-black border border-gray-800">
              <div className="h-1 bg-coding"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  {index === 0 ? (
                    <BsPuzzle className="h-5 w-5 text-coding" />
                  ) : (
                    <FaCode className="h-5 w-5 text-coding" />
                  )}
                  {program.title}
                </CardTitle>
                <CardDescription className="text-lg font-medium text-coding">
                  {program.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {program.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="h-6 w-6 rounded-full bg-lime-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-coding text-sm">✓</span>
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {/* One main register button */}
        <div className="text-center">
          <Link href="/code-ninjas-club/register">
            <Button className="px-8 py-4 bg-coding hover:bg-lime-600 text-black font-bold text-lg rounded-xl shadow-lg">
              Register Now 
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Programs

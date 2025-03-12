import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { FaBolt, FaCode } from 'react-icons/fa'

const HeroSection = () => {
  return (
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
                  Code Ninjas Club
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8">
                  A 12-week coding adventure for young tech warriors ages 6-13
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/code-ninjas-club/register">
                <Button
                    size="lg"
                    className="bg-coding hover:bg-lime-600 text-black font-bold"
                  >
                    Enroll Now
                  </Button>
                </Link>
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
  )
}

export default HeroSection
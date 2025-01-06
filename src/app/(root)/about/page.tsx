"use client"

import Gallery from '@/components/about/Gallery'
import HeroSection from '@/components/about/HeroSection'
import OurValues from '@/components/about/OurValues'
import VisionAndMission from '@/components/about/VisionAndMission'
import React from 'react'
import {motion} from "framer-motion"
import CTA from '@/components/programs/CTA'
import OurStaff from '@/components/about/OurStaff'
import Curriculum from '@/components/about/Curriculum'

const About = () => {
  return (
    <div>
      <HeroSection />
      <VisionAndMission />
      <OurValues />
      <Curriculum />
      <motion.section 
          className="max-w-7xl mx-auto px-4 py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-[#007f94] to-[#009ca5] bg-clip-text text-transparent">
            Life at Petite Elise
          </h3>
          <Gallery />
        </motion.section>
        <OurStaff />
        <CTA />
    </div>
  )
}

export default About
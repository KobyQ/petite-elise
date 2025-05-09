import CTA from '@/components/programs/CTA'
import ProgramCards from '@/components/programs/ProgramCards'
import { Testimonials } from '@/components/programs/Testimonials'
import HeroSection from '@/components/shared/HeroSection'
import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: "Our Programs | Petite Elise Preschool",
  description: "Explore our range of programs including Daycare, Preschool, Afterschool Care, Baby & Me, Developmental Playgroup, and Experiential Learning Activities.",
  keywords: ["Daycare Accra", "Preschool programs", "Afterschool care", "Baby & Me", "Developmental Playgroup", "Experiential Learning"],
};


const page = () => {
  return (
    <div>
      <HeroSection image="https://media.istockphoto.com/id/639407632/photo/excited-school-girls-during-chemistry-experiment.jpg?s=612x612&w=0&k=20&c=-W-vGm-bJ9XnxiCyFIxmLz3Asi0NJEiUjJoPShtBGLo=" title="Nurturing Young Minds" subTitle="Discover our comprehensive programs designed to inspire, educate, and
          empower your child&apos;s early years." />
        <ProgramCards />
        <Testimonials />
        <CTA />
    </div>
  )
}

export default page
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
        
        {/* Fee Request Section */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Need to Pay School Fees?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                For parents of enrolled students, you can request an invoice for your child&apos;s school fees. 
                We&apos;ll send you a secure payment link to complete your payment.
              </p>
            </div>
            <div className="text-center">
              <a
                href="/request-fees"
                className="inline-block bg-primary hover:bg-opacity-90 text-white font-medium py-3 px-8 rounded-md transition-all duration-300"
              >
                Request Fee Invoice
              </a>
            </div>
          </div>
        </section>
        
        <Testimonials />
        <CTA />
    </div>
  )
}

export default page
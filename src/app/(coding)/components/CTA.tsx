import { Button } from '@/components/ui/button'
import React from 'react'

const CTA = () => {
  return (
    <section className="py-20 bg-black">
    <div className="container mx-auto px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Transform Your Child into a Coding Ninja?
        </h2>
        <p className="text-gray-400 mb-8">
          Limited spots available. Secure your child&apos;s place in our
          next cohort today!
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
  )
}

export default CTA
import Image from 'next/image'
import React from 'react'

const Partnership = () => {
  return (
    <section className="py-16 bg-[#cececb] text-black">
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
            <h3 className="text-xl font-bold">Petite Elise Preschool</h3>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Partnership
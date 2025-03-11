import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import React from 'react'

const Founders = () => {
  return (
    <section className="py-20 bg-gray-950">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-black text-coding border border-coding">
          Meet Our Founders
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          The Minds Behind Coding Ninjas Club
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
                &quot;Coding isn&apos;t just about technology, it&apos;s
                about empowering young minds to think, create, and solve
                problems. As a father teaching my kids how to code, I have
                seen firsthand the confidence and excitement that comes from
                learning to build something from scratch. That&apos;s why I
                have co-founded the Code Ninjas Club to give every child the
                same opportunity to explore, innovate, and master the
                digital world.&quot;
              </p>
              <p className="mt-4 text-gray-300 italic">
                &quot;I believe that by making coding fun and accessible, we
                can equip the next generation with skills that will shape
                the future. Join the journey, let&apos;s raise a generation
                of creative problem-solvers together!&quot;
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
                &quot;Empowering the next generation of tech warriors; I
                believe that every child has the potential to become a
                coding ninja. By co-founding the Code Ninjas Club, I
                envision a space where creativity meets technology, where
                problem-solving becomes an adventure, and where young minds
                sharpen their skills like true digital warriors.&quot;
              </p>
              <p className="mt-4 text-gray-300 italic">
                &quot;My mission is simple, to inspire, teach, and equip
                kids with the tools they need to conquer the future, one
                line of code at a time.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Founders
import Image from "next/image";
import React from "react";
import { BsQuote } from "react-icons/bs";

const TestimonialCard = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 lg:px-8 ">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center ">
        <div className="relative aspect-[4/5] w-full ">
          <Image
            src="/images/eno.jpg"
            alt="Founder with child"
            width={640}
            height={800}
            className="rounded-3xl object-cover"
            priority
          />
        </div>
        <div className="flex flex-col ">
          <div className=" text-primary text-7xl font-serif">
            <BsQuote />
          </div>
          <blockquote>
            <p className="text-[#2D3142] text-lg lg:text-2xl leading-relaxed mt-4">
            &quot;After 16 years of experience in childcare and witnessing how early
              childhood education can shape a child’s future, I decided to
              create a preschool that would provide not just quality education
              but a warm, home-like environment where every child feels valued.
              A space where creativity, emotional intelligence, and hands-on
              learning are just as important as academic achievement. There was
              a growing need in my community for a preschool that went beyond
              traditional teaching methods—one that nurtures the whole child,
              emotionally, socially, and intellectually. My vision for this
              preschool is simple. To create an environment where children feel
              safe, loved, and encouraged to be themselves. With a curriculum
              that emphasizes play-based learning, we focus on helping children
              develop critical thinking skills, emotional regulation, and a love
              for learning that will stay with them throughout their lives. Our
              staff is dedicated not only to academic excellence but also to
              fostering an atmosphere of empathy, respect, and creativity.&quot;
            </p>
            <footer className="mt-8">
              <div className="flex flex-col items-start">
                <div className="text-[#2D3142] font-medium text-xl">
                  Mrs. Eno Quagraine
                </div>
                <div className="text-gray-500 mt-1">
                  Founder & Head of School
                </div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCard;

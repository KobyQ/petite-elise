import React from "react";
import Card from "./Card";

interface Program {
  icon: string;
  title: string;
  description: string;
  time: string;
}
const Program = () => {
  const programs: Program[] = [
    {
      icon: "/images/abc.png",
      title: "Daycare",
      time: "8am-3pm",
      description:
        "Enrolling babies from 3 months-2years. We have 3 classes and age groups in our Daycare Block . Prewalkers, Walkers and Nursery 1. We have flexible options available as we understand babies take time to adjust. Daily, Weekly, Monthly and Termly Registration available.",
    },
    {
      icon: "/images/puzzle.png",
      title: "Preschool",
      time: "8am -3pm",
      description:
        "Enrolling kids 3years -5years. There are 3 classes in our Preschool block. Nursery 2, Kindergarten 1& 2. Only Full Term registration is available for our Preschool Program.",
    },
    {
      icon: "/images/calendar.png",
      title: "Afterschool Care",
      time: "4pm-6pm",
      description:
        "Parents who will like to pick up their children after 4pm can register for Afterschool care. Children enrolled will be given an early dinner and engaged till they’re picked up at 6pm.",
    },
  ];

  return (
    <div className="bg-[#ffe9d0]">
      <div className="relative w-full max-w-7xl mx-auto px-4 lg:px-12 py-16 ">
        <h2 className="text-3xl font-bold text-gray-800">Our Programs</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
              <Card key={index} {...program} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Program;

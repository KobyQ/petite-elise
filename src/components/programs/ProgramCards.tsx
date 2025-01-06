import { programs } from "@/utils/constants";
import React from "react";
import ProgramCard from "./ProgramCard";

const ProgramCards = () => {
  return (
    <div className="bg-[#e6f4f1]">
      <div className="relative w-full max-w-7xl mx-auto px-4 lg:px-12 py-16 ">
        <h2 className="text-3xl font-bold text-gray-800">Our Programs</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {programs.map((program, index) => (
       
              <ProgramCard
              key={index}
                icon={program?.icon}
                title={program?.title}
                description={program?.description}
                ageGroup={program?.ageGroup}
                schedule={program?.schedule}
                activities={program?.activities}
              />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramCards;

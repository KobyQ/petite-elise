/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Badge } from "../ui/badge";
import { Card, CardDescription, CardTitle } from "../ui/card";

interface ProgramCardProps {
  icon: string;
  title: string;
  description: string;
  ageGroup: string;
  schedule: string;
  activities: string[];
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  icon,
  title,
  description,
  ageGroup,
  schedule,
  activities,
}) => {
  return (
    <Card className="relative flex flex-col bg-gradient-to-b from-white to-gray-50 p-6 rounded-lg shadow-lg max-w-sm mt-16">
      {/* Icon Container */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20">
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <polygon
            points="50,3 93.3,25 93.3,75 50,97 6.7,75 6.7,25"
            className="fill-amber-100 stroke-[#aee87d] stroke-[3px]"
          />
        </svg>
        <img
          src={icon}
          alt={`${title} icon`}
          className="absolute inset-0 w-8 h-8 m-auto"
        />
      </div>

      {/* Content */}
      <div className="mt-16 text-center">
        <CardTitle className="text-2xl font-semibold text-gray-800 mb-2">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm mb-4">
          {description}
        </CardDescription>

        {/* Badges */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <Badge className="bg-blue-100 text-blue-700 w-max text-center py-1 hover:bg-inherit ">
            {ageGroup}
          </Badge>
          <Badge className="bg-green-100 text-green-700 w-max text-center py-1 hover:bg-inherit">
            {schedule}
          </Badge>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-200 my-4" />

        {/* Activities List */}
        <ul className="space-y-2 text-sm text-gray-700">
          {activities.map((activity, idx) => (
            <li key={idx} className="flex items-center">
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              {activity}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default ProgramCard;

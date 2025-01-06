import Image from "next/image";
import React from "react";
interface ITrustee {
  image: string;
  name: string;
  role: string;
  bio: string;
}

const TrusteeCard = ({ trustee }: { trustee: ITrustee }) => {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* Image Section */}
      <div className="relative w-full h-80  sm:h-[240px]  md:h-[270px] xl:h-[350px] rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105">
        <Image
          src={trustee.image}
          alt={trustee.name}
          layout="fill"
          objectFit="cover"
          className="rounded-xl object-top"
        />
      </div>

      {/* Text Section */}
      <div className=" w-full px-4">
        <h3 className="text-2xl font-semibold text-gray-800">{trustee.name}</h3>
        <p className="text-lg text-primary">{trustee.role}</p>
        <p className="mt-4 text-md text-gray-700 text-center">{trustee.bio}</p>
      </div>
    </div>
  );
};

export default TrusteeCard;

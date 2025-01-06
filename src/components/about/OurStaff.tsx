import Image from "next/image";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: "Adelaide Ankrah",
    role: "Head of Programs & Administration",
    image: "/images/adelaide-ankra.jpg", 
  },
  {
    id: 2,
    name: "Gifty Kobi Osei",
    role: "Assistant Head of Administration & HR",
    image: "/images/Gifty.jpg", 
  },
  {
    id: 3,
    name: "Isaac Dorkenu",
    role: "Security",
    image: "/images/Isaac.jpg",
  },
];

export default function OurStaff() {
  return (
    <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-4xl font-extrabold text-center bg-gradient-to-r from-[#007f94] to-[#009ca5] bg-clip-text text-transparent mb-6 tracking-tight">
          Our Dedicated Staff
        </h2>
        <p className="text-base lg:text-xl text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Meet our well-trained, dedicated staff who are passionate about the well-being and development of each child here.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {staffMembers.map((staff) => (
            <div
              key={staff.id}
              className="group bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-full h-[25rem] md:h-[30rem] lg:h-[35rem]">
                <Image
                  src={staff.image}
                  alt={staff.name}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute right-0 bottom-0 bg-white rounded-l-3xl p-4 md:p-6 text-right">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-primary mb-2">
                    {staff.name}
                  </h3>
                  <p className="text-gray-500 text-sm md:text-base">{staff.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Teaching Staff Section */}
        <div className="mt-16 text-center">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-6">
            Teaching Staff
          </h3>
          <div className="relative w-full h-[20rem] sm:h-[30rem] lg:h-[40rem] mx-auto">
            <Image
              src="/images/teaching-staff.jpg"
              alt="Teaching Staff"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg object-top"
            />
          </div>
        </div>

        {/* Kitchen Staff Section */}
        <div className="mt-16 text-center">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-6">
            Kitchen Staff
          </h3>
          <div className="relative w-full h-[20rem] sm:h-[30rem] lg:h-[40rem] mx-auto">
            <Image
              src="/images/kitchen-staff.jpg"
              alt="Kitchen Staff"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

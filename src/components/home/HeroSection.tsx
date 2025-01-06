import * as Dialog from "@radix-ui/react-dialog";
import { FaPlay } from "react-icons/fa";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="bg-primary min-h-screen lg:h-screen overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-0 flex flex-col h-full justify-center">
        <div className="grid lg:grid-cols-2 gap-20 items-center h-full relative">
          {/* Left Column */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4 flex flex-col items-center lg:items-start">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                Welcome to
                <br />
                <span className="bg-clip-text text-secondary animate-gradient-x">
                  Petite Elise Preschool
                </span>
              </h1>
              <div className="w-full h-1 bg-gradient-to-r from-[#fb9039] to-[#eab308] rounded-full transform -skew-x-12"></div>
              <p className="text-white/90 text-base md:text-lg max-w-lg leading-relaxed">
                Nurturing young minds to become curious, resilient, and
                independent thinkers in a safe, loving environment
              </p>
            </div>

            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="w-full lg:w-auto group lg:px-8 py-3 bg-white/10 backdrop-blur-sm text-secondary text-bold rounded-full hover:bg-white/20 transition-all duration-300 flex justify-center items-center gap-2 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-[#4B456F]">
                  <div className="bg-white rounded-full p-1 group-hover:bg-secondary transition-colors duration-300">
                    <FaPlay className="w-3 h-3 text-[#4B456F] group-hover:text-white transition-colors duration-300" />
                  </div>
                  School Tour
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl overflow-hidden w-[95%] max-w-[1200px] max-h-[90%] h-[80vh] sm:h-[90vh]">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <iframe
                      src="https://www.youtube.com/embed/3zvuBSYiB54?si=io491Tr0QULV22p8"
                      title="School Tour"
                      className="w-full h-full border-none"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <Dialog.Close className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg hover:bg-red-600">
                    &times;
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          {/* Right Column - Image */}
          <div className="relative w-full h-full flex items-center justify-center z-30">
            {/* Background Shapes */}
            <div className="absolute z-10">
              <svg
                viewBox="0 0 900 600"
                width="900"
                height="600"
                className="md:w-[900px] md:h-[600px] w-[600px] h-[400px]" // Adjust size for smaller screens
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
              >
                <g transform="translate(445.8140565158052 237.96097466701565)">
                  <path
                    d="M224.4 -119.7C260.1 -67.8 237 27.8 189.8 117.6C142.6 207.3 71.3 291.2 -11.1 297.6C-93.5 304 -187.1 233 -219.5 151.8C-252 70.5 -223.4 -21 -176.7 -79.3C-129.9 -137.5 -65 -162.5 14.7 -171C94.4 -179.5 188.8 -171.5 224.4 -119.7"
                    fill="#ffe9d0"
                  ></path>
                </g>
              </svg>
            </div>

            {/* Brown Blob (Foreground) */}
            <div className="absolute z-20">
              <svg
                viewBox="0 0 900 600"
                width="900"
                height="600"
                className="md:w-[900px] md:h-[600px] w-[600px] h-[400px]" // Adjust size for smaller screens
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
              >
                <g transform="translate(410.44737905047515 274.0199148296143)">
                  <path
                    d="M223.4 -120.5C276.6 -37 297.6 73.5 255 160.6C212.5 247.7 106.2 311.3 13 303.8C-80.3 296.3 -160.5 217.7 -187.6 139.5C-214.6 61.4 -188.5 -16.2 -148.4 -92.2C-108.3 -168.2 -54.1 -242.6 15.5 -251.5C85.2 -260.5 170.3 -204 223.4 -120.5"
                    fill="#95b0b7"
                  ></path>
                </g>
              </svg>
            </div>

            {/* Main Image */}
            <div className="relative z-20">
              <Image
                src="/images/hero.png"
                alt="Excited student"
                width={420}
                height={420}
                className="object-contain"
              />
              <div className="absolute z-10 -top-[10%] md:top-[4%] lg:top-[6%] left-[1%] md:left-[15%] lg:left-[6%]">
                <Image
                  src="/images/sun.png"
                  alt="Sun icon"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

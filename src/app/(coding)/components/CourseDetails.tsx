import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import {
  FaBolt,
  FaBookOpen,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";

const CourseDetails = () => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-black text-coding border border-coding">
            Course Details
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Next Cohort
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Is your child curious about computers and how games are made? Enroll
            them in our fun and interactive Scratch programming course designed
            for kids aged 6-13.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="bg-gray-950 rounded-2xl shadow-xl overflow-hidden border border-gray-800">
            <div className="h-1 bg-coding"></div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Schedule & Location
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-lime-950 flex items-center justify-center flex-shrink-0">
                    <FaCalendarAlt className="h-6 w-6 text-coding" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Every Saturday</h4>
                    <div className="flex flex-col mt-1 text-gray-400">
                      <div className="flex items-center gap-2">
                        <FaClock className="h-4 w-4" />
                        <span>Session 1: 10:00 AM – 12:00 PM</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <FaClock className="h-4 w-4" />
                        <span>Session 2: 12:30 PM – 2:30 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-lime-950 flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="h-6 w-6 text-coding" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Location</h4>
                    <p className="mt-1 text-gray-400">
                      Petite Elise Preschool
                      <br />1 Libreville Lake, East Legon
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-lime-950 flex items-center justify-center flex-shrink-0">
                    <FaUsers className="h-6 w-6 text-coding" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Limited Slots</h4>
                    <p className="mt-1 text-gray-400">
                      20 students only!
                      <br />
                      Cost: GHS 1,500 per child
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-950 rounded-2xl shadow-xl overflow-hidden border border-gray-800">
            <div className="h-1 bg-coding"></div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Important Dates
              </h3>

              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-coding"></div>

                <div className="space-y-8">
                  <div className="relative pl-16">
                    <div className="absolute left-0 h-12 w-12 rounded-full bg-lime-950 flex items-center justify-center">
                      <FaCalendarAlt className="h-6 w-6 text-coding" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Registration Deadline
                      </h4>
                      <p className="mt-1 text-gray-400">28th March, 2025</p>
                    </div>
                  </div>

                  <div className="relative pl-16">
                    <div className="absolute left-0 h-12 w-12 rounded-full bg-lime-950 flex items-center justify-center">
                      <FaBookOpen className="h-6 w-6 text-coding" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Cohort Starts
                      </h4>
                      <p className="mt-1 text-gray-400">5th April, 2025</p>
                    </div>
                  </div>

                  <div className="relative pl-16">
                    <div className="absolute left-0 h-12 w-12 rounded-full bg-lime-950 flex items-center justify-center">
                      <FaBolt className="h-6 w-6 text-coding" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Ready to Join?
                      </h4>
                      <Link href="/code-ninjas-club/register">
                        <Button className="mt-3 bg-coding hover:bg-lime-600 text-black font-bold">
                          Register Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetails;

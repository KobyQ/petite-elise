"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

import { LuSparkles, LuTarget } from "react-icons/lu";

const VisionAndMission = () => {
  return (
      <motion.section
        className="max-w-7xl mx-auto px-4 py-28"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8 bg-gradient-to-br from-blue-50 to-blue-100">
              <h3 className="text-2xl font-bold mb-4 text-blue-600 flex items-center gap-2">
                <LuTarget className="h-6 w-6" />
                Our Mission
              </h3>
              <p className="text-gray-700 group-hover:transform group-hover:translate-x-2 transition-transform duration-300">
                Committed to providing the best early years foundation through a
                safe, nurturing home-like environment.
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8 bg-gradient-to-br from-violet-50 to-violet-100">
              <h3 className="text-2xl font-bold mb-4 text-violet-600 flex items-center gap-2">
                <LuSparkles className="h-6 w-6" />
                Our Vision
              </h3>
              <p className="text-gray-700 group-hover:transform group-hover:translate-x-2 transition-transform duration-300">
                To be a leading name in child-care known for quality teaching
                and intentional play-based learning.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.section>
  );
};

export default VisionAndMission;

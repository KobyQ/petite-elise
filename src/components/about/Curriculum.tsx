"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const Curriculum = () => {
  return (
    <div className="bg-[#f5fafb]">
      <motion.section
        className="max-w-7xl mx-auto px-4 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-[#007f94] to-[#009ca5] bg-clip-text text-transparent">
          Our Curriculum
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8 bg-gradient-to-br from-cyan-50 to-cyan-100">
              <h4 className="text-2xl font-bold mb-4 text-cyan-600">EYFS Curriculum</h4>
              <p className="text-gray-700 leading-relaxed">
                At Petite Elise Preschool, we follow the British Early Years Foundation Stage (EYFS) curriculum, a
                globally recognized framework that supports children&apos;s development through play-based learning. EYFS
                focuses on nurturing the whole child, promoting skills in communication, physical development, literacy,
                numeracy, and personal, social, and emotional growth.
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8 bg-gradient-to-br from-blue-50 to-blue-100">
              <h4 className="text-2xl font-bold mb-4 text-blue-600">Teaching Philosophy</h4>
              <p className="text-gray-700 leading-relaxed">
                We emphasize play-based learning to foster curiosity and skill-building, focusing on:
              </p>
              <ul className="list-disc list-inside mt-4 text-gray-700">
                <li>Social-emotional growth</li>
                <li>Cognitive development</li>
                <li>Language and communication skills</li>
                <li>Physical activity and health</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  );
};

export default Curriculum;

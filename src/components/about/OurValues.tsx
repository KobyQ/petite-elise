"use client"
import React from 'react'
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { values } from '@/utils/constants'

const OurValues = () => {
  return (
  <div className="bg-[#e6f4f1]">
      <motion.section 
          className="max-w-7xl mx-auto px-4 py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-[#007f94] to-[#009ca5] bg-clip-text text-transparent">
            Our Values
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values?.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all bg-white h-full duration-300 border-t-4 border-t-primary">
                  <CardContent className="p-6">
                    <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                      {value.icon}
                    </div>
                    <h4 className="text-lg font-bold mb-2 text-gray-800">{value.name}</h4>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
  </div>
  )
}

export default OurValues
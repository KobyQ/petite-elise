import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { FiCalendar, FiMonitor, FiUsers } from "react-icons/fi"


const Intro = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-10">
       

    <motion.div variants={itemVariants}>
      <Accordion type="single" collapsible className="mb-8">
        <AccordionItem value="cohort-details" className="border-zinc-800">
          <AccordionTrigger className="text-xl font-semibold hover:text-lime-500 hover:no-underline">
            <span className="flex items-center">
              <FiCalendar size={20} className="text-lime-500 mr-2" />
              Cohort Details
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-7 text-gray-300">
              <div className="flex items-start">
                <span className="font-medium min-w-40">Registration Deadline:</span>
                <span>Friday, 28th March 2025</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium min-w-40">Cohort Duration:</span>
                <span>12 weeks (Saturday, April 5th 2025 - Saturday, June 21st 2025)</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium min-w-40">Cost:</span>
                <span>GHS 1,500 per child</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium min-w-40">Session Details:</span>
                <span>10:00am - 12:00pm & 12:30pm - 2:30pm</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>

    <motion.div variants={itemVariants}>
      <Card className="mb-8 bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FiUsers size={20} className="text-lime-500 mr-2" />
            Age Groups
          </CardTitle>
          <CardDescription>This cohort is limited to the following age groups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
            <h3 className="font-semibold text-lime-500 mb-1">Mini Coders (6-9 years)</h3>
            <p className="text-gray-300">Programming With Scratch Jr.</p>
          </div>
          <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
            <h3 className="font-semibold text-lime-500 mb-1">Little Ninjas (10-13 years)</h3>
            <p className="text-gray-300">Advanced Scratch Programming & HTML Basics</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div variants={itemVariants}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FiMonitor size={20} className="text-lime-500 mr-2" />
          Requirements
        </h2>
        <p className="text-gray-300 mb-4">
          Please note that you are to provide good laptops for your kids. (No tablets allowed)
        </p>
        <div className="bg-yellow-900/20 border border-yellow-800/30 rounded p-4 text-yellow-200">
          <p className="text-sm">
            <strong>Note:</strong> If you are registering more than one child, kindly fill a new form for each
            child.
          </p>
        </div>
      </div>
    </motion.div>
  </motion.div>
  )
}

export default Intro
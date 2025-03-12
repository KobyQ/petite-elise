/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import supabase from '@/utils/supabaseClient';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";

import SkeletonLoader from '../components/SkeletonLoader';
import { SearchBar } from '../students/page';
import CustomTable from '../components/CustomTable';
import { codeNinjaColumns } from '../students/columns';
import StudentDetails from '../components/StudentDetails';
import { Button } from '@/components/ui/button';
import CustomTabs from '@/components/shared/CustomTabs';

const CodeNinjaDetails = ({
  isOpen,
  setIsOpen,
  data,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg relative">
          <h2 className="text-xl font-semibold text-center">Code Ninja Details</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
          >
            &times;
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
          <div>
            <p className="text-sm text-gray-500">Child Name</p>
            <p className="font-semibold text-lg">{data.childName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Age Group</p>
            <p className="font-semibold text-lg">{data.ageGroup}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Parent Name</p>
            <p className="font-semibold text-lg">{data.parentName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-lg">{data.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-semibold text-lg">{data.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Has Coding Experience</p>
            <p className="font-semibold text-lg">{data.hasCodingExperience}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Coding Experience</p>
            <p className="font-semibold text-lg bg-gray-100 p-3 rounded-lg">{data.codingExperience || "No details provided"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Session Preference</p>
            <p className="font-semibold text-lg">{data.sessionPreference}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Method</p>
            <p className="font-semibold text-lg">{data.paymentMethod}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Special Requests</p>
            <p className="font-semibold text-lg bg-gray-100 p-3 rounded-lg">{data.specialRequests || "None"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeNinjaDetails;

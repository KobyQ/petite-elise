"use client";

import { useState } from "react";
import FeeRequestsTab from "./components/FeeRequestsTab";
import SchoolFeesPayments from "./components/SchoolFeesPayments";

const FeeRequests = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: "Fee Requests",
      content: <FeeRequestsTab />,
    },
    {
      label: "School Fees Payments",
      content: <SchoolFeesPayments />,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Fee Management</h1>
          <p className="text-gray-600">Manage fee requests and view school fees payments</p>
        </div>
      </div>
      
      {/* Custom Main Tabs with different design */}
      <div className="w-full mb-6">
        <div className="flex border-b-2 border-gray-200">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`py-4 px-8 text-lg font-semibold transition-all duration-200 border-b-4 ${
                index === activeTab
                  ? "text-blue-600 border-blue-600 bg-blue-50"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-6">
          {tabs[activeTab]?.content || <p>No content available for this tab.</p>}
        </div>
      </div>
    </div>
  );
};

export default FeeRequests; 
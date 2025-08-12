import React, { useState, useEffect } from "react";

interface TabItem {
  label: string;
  value?: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeColor?: string;
  inactiveColor?: string;
  onTabChange?: (tabValue: string) => void;
  defaultTab?: string;
}

const CustomTabs: React.FC<TabsProps> = ({
  tabs,
  activeColor = "text-blue-500",
  inactiveColor = "text-gray-500",
  onTabChange,
  defaultTab,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  // Set initial active tab based on defaultTab value
  useEffect(() => {
    if (defaultTab) {
      const tabIndex = tabs.findIndex(tab => tab.value === defaultTab);
      if (tabIndex !== -1) {
        setActiveTab(tabIndex);
      }
    }
  }, [defaultTab, tabs]);

  const handleTabClick = (index: number, tab: TabItem) => {
    setActiveTab(index);
    if (onTabChange && tab.value) {
      onTabChange(tab.value);
    }
  };

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index, tab)}
            className={`py-2 px-4 text-sm font-medium transition-colors duration-200 border-b-2 ${
              index === activeTab
                ? `${activeColor} border-blue-500`
                : `${inactiveColor} border-transparent`
            } hover:${activeColor}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tabs[activeTab]?.content || <p>No content available for this tab.</p>}
      </div>
    </div>
  );
};

export default CustomTabs;

// Example usage
// In your parent component, you can use the Tabs component like this:

// import Tabs from './Tabs';

// const App: React.FC = () => {
//   const tabData = [
//     { label: 'Tab 1', content: <p>Content for Tab 1</p> },
//     { label: 'Tab 2', content: <p>Content for Tab 2</p> },
//     { label: 'Tab 3', content: <p>Content for Tab 3</p> },
//   ];

//   return (
//     <div className="max-w-md mx-auto mt-10">
//       <Tabs tabs={tabData} activeColor="text-blue-600" inactiveColor="text-gray-400" />
//     </div>
//   );
// };

// export default App;

import React from 'react';

const HeaderBar: React.FC = () => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
      {/* Left side - potentially breadcrumbs or page title */}
      <div>
        {/* Placeholder for mobile nav toggle */}
        <button className="md:hidden mr-4 text-gray-600">
          {/* Icon placeholder */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <span className="text-lg font-semibold">Dashboard</span> {/* Example Title */}
      </div>

      {/* Right side - User info, actions */}
      <div className="flex items-center space-x-4">
        {/* FR3.3: Create New Button Placeholder */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
          Create New
        </button>

        {/* FR3.2: Quick Icons Placeholder */}
        <button className="text-gray-500 hover:text-gray-700">
          {/* Search Icon Placeholder */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          {/* Notification Icon Placeholder */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* FR3.1: User Info Placeholder */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Username</span>
          {/* Avatar Placeholder */}
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
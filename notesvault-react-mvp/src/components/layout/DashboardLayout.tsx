import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // Renders the matched child route component
import SidebarNav from './SidebarNav.tsx'; // The navigation sidebar
import HeaderBar from './HeaderBar.tsx';   // The top header bar

const DashboardLayout: React.FC = () => {
  // State to control sidebar visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to toggle the sidebar state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans"> {/* Use a common font */}

      {/* Sidebar */}
      {/* Fixed position on desktop (md and up), slides in/out on mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 md:static md:inset-0`} // Static position on desktop
      >
        <SidebarNav />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar} // Close sidebar when overlay is clicked
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Header Bar */}
        {/* Stays fixed at the top, takes full width remaining after sidebar on desktop */}
        <HeaderBar onToggleSidebar={toggleSidebar} />

        {/* Page Content */}
        {/* pt-16 ensures content starts below the fixed 64px (h-16) header */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16 p-4 md:p-6">
          <Outlet /> {/* Child routes defined in App.tsx will render here */}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;

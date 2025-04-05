import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import SidebarNav from './SidebarNav.tsx';
import HeaderBar from './HeaderBar.tsx';

// No longer need DashboardLayoutProps if we use Outlet

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar: Hidden on small screens, visible on medium+ */}
      {/* On small screens, visibility controlled by isSidebarOpen */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition-transform duration-300 ease-in-out bg-gray-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <SidebarNav />
      </div>

      {/* Overlay for small screens when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar} // Close sidebar on overlay click
        ></div>
      )}


      <div className="flex flex-col flex-1 md:ml-64"> {/* Main content wrapper */}
        {/* Header Bar: Pass toggle function */}
        <HeaderBar toggleSidebar={toggleSidebar} />
        {/* FR1.3: Main Content Area */}
        {/* Main Content Area: Use Outlet */}
        {/* Assuming HeaderBar is h-16 (64px), add padding-top */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16 px-4 md:px-6">
          <Outlet /> {/* Render routed components here */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

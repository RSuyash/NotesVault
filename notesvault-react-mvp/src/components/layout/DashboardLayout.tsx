import React, { ReactNode } from 'react';
import SidebarNav from './SidebarNav.tsx';
import HeaderBar from './HeaderBar.tsx';

interface DashboardLayoutProps {
  children: ReactNode; // To render the specific page content
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* FR1.1: Sidebar Navigation */}
      <SidebarNav />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* FR1.2: Header Bar */}
        <HeaderBar />

        {/* FR1.3: Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Page-specific content is rendered here */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
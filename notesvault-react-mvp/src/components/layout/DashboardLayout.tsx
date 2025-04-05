import React from 'react';
import Sidebar from './Sidebar.tsx';
import DashboardHeader from './DashboardHeader.tsx';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          {children}
        </main>

        {/* Floating Logo (Placeholder) */}
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg">
          Logo
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
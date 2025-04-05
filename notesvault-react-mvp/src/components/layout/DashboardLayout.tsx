import { ReactNode } from 'react';
import Sidebar from './Sidebar.js'; // Using .js extension as required
import DashboardHeader from './DashboardHeader.js'; // Using .js extension as required
// import styles from './DashboardLayout.module.css'; // Uncomment if you have/create this CSS module

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    // Basic structure using placeholder Tailwind classes for layout
    // Replace with actual styles/classes (e.g., from a CSS module) if needed
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900"> {/* Basic container */}
      <Sidebar /> {/* Render Sidebar */}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden"> {/* Main content flex container */}
        <DashboardHeader /> {/* Render Header */}

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 dark:bg-gray-800 p-6"> {/* Content area with padding and scroll */}
          {/* Children passed to the layout will be rendered here */}
          {children}
        </main>

        {/* Optional: Floating Logo/Element could be added here if needed */}
        {/* Example: <div className="fixed bottom-4 right-4">Logo</div> */}
      </div>
    </div>
  );
};

export default DashboardLayout;
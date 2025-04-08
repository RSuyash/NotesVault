import React, { useState, useEffect } from 'react';
// Removed unused Link import
import { getProfile } from '../../services/profileApi'; // Import profile API

interface HeaderBarProps {
  onToggleSidebar: () => void; // Function to toggle sidebar
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onToggleSidebar }) => {
  const [userName, setUserName] = useState('User'); // State for user name

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const profileData = await getProfile(); // Uses session cookie via profileApi
        if (profileData && profileData.name) {
          setUserName(profileData.name);
        }
      } catch (error) {
        console.error('HeaderBar: Failed to fetch user profile for name', error);
        // Keep default 'User' name on error
      }
    };
    fetchUserName();
  }, []); // Empty dependency array means run once on mount

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-gray-200 shadow-sm">
      {/* Left side: Toggle button (mobile only) */}
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden" // Visible only on small screens
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        {/* Optional: Add Title or Breadcrumbs here if needed */}
      </div>

      {/* Right side: Welcome message, Notifications, User Menu */}
      <div className="flex items-center space-x-4">
         {/* Welcome message - hidden on smaller screens if needed */}
         <span className="text-gray-700 hidden sm:inline">
           Welcome, <span className="font-medium">{userName}</span>!
         </span>

         {/* Notification Icon Button (Placeholder) */}
         <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100" aria-label="Notifications">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341A6.002 6.002 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
         </button>

         {/* User Menu Button (Placeholder) */}
         {/* TODO: Implement dropdown menu logic */}
         <div className="relative">
           <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out" aria-label="User menu">
             {/* Placeholder Avatar */}
             <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
               {userName.charAt(0).toUpperCase()}
             </div>
           </button>
           {/* Dropdown menu would go here */}
         </div>
       </div>
    </header>
  );
};

export default HeaderBar;
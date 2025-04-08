import React from 'react';

// Define props interface
interface HeaderBarProps {
  onToggleSidebar: () => void; // Function to toggle sidebar
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onToggleSidebar }) => {
  // TODO: Fetch user name here or receive as prop if needed in header
  const userName = localStorage.getItem('username') || 'User'; // Temporary fallback

  return (
    // Use fixed positioning and z-index to keep header above content
    // Adjust background, shadow, padding as needed
    <header className="fixed top-0 left-0 md:left-64 right-0 z-10 flex items-center justify-between h-16 px-4 md:px-6 bg-white shadow-md">
       {/* Button visible only on medium screens and below to toggle sidebar */}
       <button
         onClick={onToggleSidebar}
         className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden" // Hide on md and larger screens
         aria-label="Toggle sidebar"
       >
         &#9776; {/* Hamburger Icon */}
       </button>

       {/* Placeholder for Title or Search Bar (optional) */}
       {/* <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1> */}
       <div></div> {/* Spacer */}


       {/* Right side items - User menu, notifications etc. */}
       <div className="flex items-center">
         {/* Welcome message - simplified for header */}
         <span className="text-gray-600 mr-4 hidden sm:inline">Welcome, {userName}!</span>

         <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
           {/* Placeholder for Notifications Icon */}
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341A6.002 6.002 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
         </button>

         <button className="ml-3 p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
           {/* Placeholder for User Avatar/Menu Icon */}
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
         </button>
       </div>
    </header>
  );
};

export default HeaderBar;
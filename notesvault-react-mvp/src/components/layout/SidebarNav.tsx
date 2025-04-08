import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Placeholder icons (replace with actual icons later if needed)
const PlaceholderIcon = () => <span className="mr-3">▫️</span>;

const SidebarNav: React.FC = () => {
  const location = useLocation(); // To highlight active link

  // Define navigation items
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <PlaceholderIcon /> },
    { path: '/dashboard/profile', label: 'Profile', icon: <PlaceholderIcon /> },
    { path: '/dashboard/notes', label: 'Smart Notes', icon: <PlaceholderIcon /> },
    { path: '/dashboard/flashcards', label: 'Flashcards', icon: <PlaceholderIcon /> },
    { path: '/dashboard/studygroups', label: 'Study Groups', icon: <PlaceholderIcon /> },
    { path: '/dashboard/leaderboard', label: 'Leaderboard', icon: <PlaceholderIcon /> },
    { path: '/dashboard/docs', label: 'MindHack Docs', icon: <PlaceholderIcon /> },
    // Add more links as needed
    { path: '/dashboard/settings', label: 'Settings', icon: <PlaceholderIcon /> },
  ];

  return (
    <div className="flex flex-col h-full text-gray-300">
      {/* Logo/Brand Area */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        {/* Replace with your actual logo */}
        <span className="text-white text-xl font-semibold">NotesVault</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                ${isActive
                  ? 'bg-gray-900 text-white' // Active link style
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Inactive link style
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Optional Footer Area (e.g., Logout Button) */}
      <div className="mt-auto p-4 border-t border-gray-700">
        <button className="w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-150 ease-in-out">
          <PlaceholderIcon /> {/* Replace with logout icon */}
          Logout
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;
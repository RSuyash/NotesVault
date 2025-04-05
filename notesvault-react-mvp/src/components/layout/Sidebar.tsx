import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication token from local storage
    localStorage.removeItem('authToken'); // Assuming 'authToken' is the key
    // Redirect to login page
    navigate('/login');
    // Optionally: Add API call to invalidate token on the server
  };

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">NotesVault</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {/* TEST: Sidebar is visible and contains navigation links. */}
        <Link to="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-700">Dashboard Home</Link>
        <Link to="/dashboard/notes" className="block px-4 py-2 rounded hover:bg-gray-700">My Notes</Link>
        <Link to="/dashboard/generate" className="block px-4 py-2 rounded hover:bg-gray-700">Generate Notes</Link>
        <Link to="/dashboard/study-groups" className="block px-4 py-2 rounded hover:bg-gray-700">Study Groups</Link>
        <Link to="/dashboard/flashcards" className="block px-4 py-2 rounded hover:bg-gray-700">Flashcards</Link>
        <Link to="/dashboard/knowledge-graph" className="block px-4 py-2 rounded hover:bg-gray-700">Knowledge Graph</Link>
        <Link to="/dashboard/settings" className="block px-4 py-2 rounded hover:bg-gray-700">Settings</Link>
      </nav>
      <div className="p-4 border-t border-gray-700">
        {/* TEST: Logout button exists in sidebar. */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-center"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
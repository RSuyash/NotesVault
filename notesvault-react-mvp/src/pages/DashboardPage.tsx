import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout.js'; // Import the new layout

const DashboardPage = () => {
  return (
    <DashboardLayout>
      {/* Main Content Area */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>

      {/* TEST: Main content area displays feature icons. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Feature Card: Generate Notes */}
        <Link to="/dashboard/generate" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
          <h2 className="text-lg font-semibold mb-2 text-blue-600">Generate Notes</h2>
          <p className="text-sm text-gray-600">Create notes from topics or syllabus.</p>
        </Link>

        {/* Feature Card: Flashcards */}
        <Link to="/dashboard/flashcards" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
          <h2 className="text-lg font-semibold mb-2 text-green-600">Flashcards</h2>
          <p className="text-sm text-gray-600">Review key concepts with flashcards.</p>
        </Link>

        {/* Feature Card: Knowledge Graph */}
        <Link to="/dashboard/knowledge-graph" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
          <h2 className="text-lg font-semibold mb-2 text-purple-600">Knowledge Graph</h2>
          <p className="text-sm text-gray-600">Visualize connections between notes.</p>
        </Link>

        {/* Feature Card: Study Groups */}
        <Link to="/dashboard/study-groups" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
          <h2 className="text-lg font-semibold mb-2 text-yellow-600">Study Groups</h2>
          <p className="text-sm text-gray-600">Collaborate and learn with peers.</p>
        </Link>
      </div>

      {/* Widgets Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget: Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          {/* TEST: Recent activity widget displays relevant data. */}
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Recent Activity</h2>
          {/* Placeholder Content */}
          <ul className="space-y-2">
            <li className="text-sm text-gray-600 italic">No recent activity yet.</li>
            {/* Example items:
            <li>Generated notes for "Chapter 5: Thermodynamics"</li>
            <li>Joined study group "Calculus Crew"</li>
            <li>Accessed note "Quantum Physics Basics"</li>
            */}
          </ul>
        </div>

        {/* Widget: Profile Overview/Settings Link */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Profile & Settings</h2>
          {/* Placeholder Content */}
          <p className="text-sm text-gray-600 mb-4">Manage your account details and preferences.</p>
          <Link to="/dashboard/settings" className="text-blue-600 hover:underline text-sm font-medium">
            Go to Settings
          </Link>
        </div>
      </div>

      {/* TEST: Floating logo is present in the bottom-right corner. (Handled in DashboardLayout) */}
    </DashboardLayout>
  );
};

export default DashboardPage;
import React from 'react';

// Mock data for study groups
const mockStudyGroups = [
  { id: 1, name: 'Organic Chemistry Q&A', members: 12, recentActivity: 'New flashcards added' },
  { id: 2, name: 'Calculus Problem Solving', members: 8, recentActivity: 'Meeting scheduled for tomorrow' },
  { id: 3, name: 'World History Discussion', members: 15, recentActivity: 'Shared notes on Chapter 3' },
];

const StudyGroupsOverviewWidget: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">Study Groups Overview</h3>
      <ul className="space-y-3 overflow-y-auto flex-grow">
        {mockStudyGroups.length > 0 ? (
          mockStudyGroups.map((group) => (
            <li key={group.id} className="text-sm p-2 rounded hover:bg-gray-50">
              <p className="font-medium text-gray-800">{group.name}</p>
              <p className="text-xs text-gray-500">{group.members} members</p>
              <p className="text-xs text-gray-600 mt-1 italic">"{group.recentActivity}"</p>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-2">You haven't joined any study groups yet.</p>
        )}
      </ul>
      <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 self-start">
        View All Groups
      </button>
    </div>
  );
};

export default StudyGroupsOverviewWidget;
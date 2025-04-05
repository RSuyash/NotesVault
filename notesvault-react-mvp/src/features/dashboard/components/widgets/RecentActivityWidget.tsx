import React from 'react';

// Mock data for recent activities
const mockActivities = [
  { id: 1, type: 'note_created', description: 'Created note "React Hooks Deep Dive"', timestamp: '2 hours ago' },
  { id: 2, type: 'flashcard_reviewed', description: 'Reviewed "JavaScript Fundamentals" deck', timestamp: '5 hours ago' },
  { id: 3, type: 'note_edited', description: 'Edited note "Project Planning Q2"', timestamp: '1 day ago' },
  { id: 4, type: 'group_joined', description: 'Joined study group "Web Dev Wizards"', timestamp: '2 days ago' },
];

// Simple mapping for icons (can be expanded with actual icons later)
const activityIcons: { [key: string]: string } = {
  note_created: '📝',
  note_edited: '✏️',
  flashcard_reviewed: '🧠',
  group_joined: '👥',
};

const RecentActivityWidget: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded shadow h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Recent Activity</h3>
      {mockActivities.length > 0 ? (
        <ul className="space-y-3 overflow-y-auto flex-grow">
          {mockActivities.map((activity) => (
            <li key={activity.id} className="flex items-start space-x-3 text-sm">
              <span className="text-xl mt-[-2px]">{activityIcons[activity.type] || '🔔'}</span>
              <div>
                <p className="text-gray-700">{activity.description}</p>
                <p className="text-gray-500 text-xs">{activity.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm flex-grow flex items-center justify-center">No recent activity yet.</p>
      )}
      <button className="text-sm text-blue-600 hover:text-blue-800 mt-3 self-start">
        View All Activity
      </button>
    </div>
  );
};

export default RecentActivityWidget;
import React from 'react';

// Mock data for quick actions
interface QuickAction {
  id: string;
  label: string;
  icon: string; // Placeholder for icon component or emoji
  action: () => void; // Placeholder for actual action dispatch
  colorClasses: string; // Tailwind classes for button color
}

const mockActions: QuickAction[] = [
  {
    id: 'new-note',
    label: 'New Note',
    icon: '📝',
    action: () => console.log('Trigger New Note action'),
    colorClasses: 'bg-green-500 hover:bg-green-600',
  },
  {
    id: 'new-deck',
    label: 'New Flashcard Deck',
    icon: '📚',
    action: () => console.log('Trigger New Flashcard Deck action'),
    colorClasses: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    id: 'new-group',
    label: 'New Study Group',
    icon: '👥',
    action: () => console.log('Trigger New Study Group action'),
    colorClasses: 'bg-blue-500 hover:bg-blue-600',
  },
];


const QuickActionsWidget: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded shadow h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 flex-grow content-start">
        {mockActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className={`flex items-center justify-center space-x-2 ${action.colorClasses} text-white px-4 py-2 rounded text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            <span className="text-lg">{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
      {/* Functionality TBD - FR4.2 */}
    </div>
  );
};

export default QuickActionsWidget;
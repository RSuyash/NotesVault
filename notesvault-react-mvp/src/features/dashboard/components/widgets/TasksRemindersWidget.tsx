import React from 'react';

// Mock data for tasks/reminders
const mockTasks = [
  { id: 1, text: 'Review Chapter 5 notes', dueDate: '2025-04-07', completed: false },
  { id: 2, text: 'Prepare presentation slides', dueDate: '2025-04-08', completed: false },
  { id: 3, text: 'Schedule meeting with study group', dueDate: '2025-04-06', completed: true },
  { id: 4, text: 'Complete practice quiz for Biology', dueDate: '2025-04-09', completed: false },
];

const TasksRemindersWidget: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">Tasks & Reminders</h3>
      <ul className="space-y-2 overflow-y-auto flex-grow">
        {mockTasks.length > 0 ? (
          mockTasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between text-sm p-2 rounded hover:bg-gray-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly // In a real app, this would trigger an update
                  className={`mr-2 form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 ${task.completed ? 'opacity-50' : ''}`}
                />
                <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {task.text}
                </span>
              </div>
              <span className={`text-xs ${task.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                {task.dueDate}
              </span>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-2">No upcoming tasks.</p>
        )}
      </ul>
      <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 self-start">
        View All Tasks
      </button>
    </div>
  );
};

export default TasksRemindersWidget;
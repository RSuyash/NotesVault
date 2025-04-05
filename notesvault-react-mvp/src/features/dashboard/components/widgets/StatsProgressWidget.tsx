import React from 'react';

// Mock data for stats/progress
const mockStats = {
  notesCreated: 42,
  flashcardsReviewed: 153,
  studyStreakDays: 7,
  overallProgress: 65, // Example percentage
};

const StatsProgressWidget: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">Stats & Progress</h3>
      <div className="space-y-3 flex-grow">
        {/* Simple Stats Display */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-gray-600">Notes Created</p>
            <p className="text-xl font-semibold text-blue-700">{mockStats.notesCreated}</p>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <p className="text-gray-600">Flashcards Reviewed</p>
            <p className="text-xl font-semibold text-green-700">{mockStats.flashcardsReviewed}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded">
            <p className="text-gray-600">Study Streak</p>
            <p className="text-xl font-semibold text-yellow-700">{mockStats.studyStreakDays} days</p>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-4">
          <label htmlFor="overall-progress" className="block text-sm font-medium text-gray-700 mb-1">
            Overall Progress
          </label>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${mockStats.overallProgress}%` }}
              aria-valuenow={mockStats.overallProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
           <p className="text-xs text-gray-500 text-right mt-1">{mockStats.overallProgress}% Complete</p>
        </div>
      </div>
       <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 self-start">
        View Detailed Stats
      </button>
    </div>
  );
};

export default StatsProgressWidget;
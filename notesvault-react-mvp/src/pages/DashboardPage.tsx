import React from 'react';
// Assuming you might want to reuse layout components if they exist
// import Navbar from '../components/layout/Navbar'; // Adjust path if needed
// import Footer from '../components/layout/Footer'; // Adjust path if needed

// Placeholder for user data - replace with actual data fetching/state management
const userData = {
  name: 'User', // Replace with actual user name later
};

const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background-start to-background-end text-text-primary">
      {/* Optional: Include Navbar if you have a shared one */}
      {/* <Navbar /> */}

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-text-heading">
          Welcome back, {userData.name}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Quick Action: Generate Notes */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-3 text-primary dark:text-primary-lighter">Generate Notes</h2>
            <p className="text-text-secondary mb-4">
              Upload your syllabus or enter topics to get AI-powered notes instantly.
            </p>
            <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors duration-300">
              Start Generating
            </button>
          </div>

          {/* Placeholder: Recent Activity */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-xl font-semibold mb-3 text-text-heading">Recent Activity</h2>
            <p className="text-text-secondary">Your recently generated notes will appear here.</p>
            {/* Add list of recent notes later */}
            <ul className="mt-4 space-y-2">
              <li className="text-text-secondary italic">No recent notes yet.</li>
            </ul>
          </div>
        </div>

        {/* Placeholder: Other Features/Sections */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-text-heading">Explore More Features</h2>
          <p className="text-text-secondary">Knowledge Graph and Flashcards coming soon!</p>
          {/* Add links or info about upcoming features */}
        </div>

      </main>

      {/* Optional: Include Footer if you have a shared one */}
      {/* <Footer /> */}
    </div>
  );
};

export default DashboardPage;
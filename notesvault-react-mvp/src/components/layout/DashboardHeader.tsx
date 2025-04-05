
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication token from local storage
    localStorage.removeItem('authToken'); // Assuming 'authToken' is the key
    // Redirect to login page
    navigate('/login');
    // Optionally: Add API call to invalidate token on the server
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* TEST: Top navigation bar is visible and contains user summary and quick links. */}
      <div>
        {/* Placeholder for Quick Links/Search */}
        <span className="text-gray-600">Quick Links Placeholder</span>
      </div>
      <div className="flex items-center space-x-4">
        {/* Placeholder for User Summary */}
        <span className="text-gray-800 font-medium">User Name Placeholder</span>
        {/* TEST: Logout button exists in top bar. */}
        {/* Consider placing this inside a dropdown menu later */}
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
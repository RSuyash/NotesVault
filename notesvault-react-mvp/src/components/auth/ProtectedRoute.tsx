import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = loading, true = auth, false = not auth
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Use the same base URL logic as other services
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        if (!API_BASE_URL) {
          throw new Error('VITE_API_BASE_URL is not set');
        }

        const response = await axios.get<{ authenticated: boolean }>(`${API_BASE_URL}/user.php`, {
          withCredentials: true, // Send session cookie
        });
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false); // Assume not authenticated on error
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []); // Run only once on mount

  if (isLoading) {
    // Optional: Show a loading spinner or message
    return <div>Loading authentication status...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
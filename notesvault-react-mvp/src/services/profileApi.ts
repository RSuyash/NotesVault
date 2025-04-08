import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not set in environment variables');
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export async function getProfile(): Promise<UserProfile> {
  try {
    // No need to manually attach token, session cookie is handled by browser with withCredentials: true
    const response = await axios.get<UserProfile>(`${API_BASE_URL}/user.php`, {
      withCredentials: true,
      // headers: {} // Removed Authorization header
    });
    console.log('User profile fetch response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch user profile:', error?.response?.status, error?.response?.data, error?.message);
    throw error;
  }
}

export async function updateProfile(data: { name: string; email: string }): Promise<void> {
  // No need to manually attach token, session cookie is handled by browser with withCredentials: true
  await axios.post(`${API_BASE_URL}/user.php`, data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      // Removed Authorization header
    },
  });
}
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export async function getProfile(): Promise<UserProfile> {
  try {
    const response = await axios.get<UserProfile>(`${API_BASE_URL}/user.php`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch user profile:', error?.response?.status, error?.response?.data, error?.message);
    throw error;
  }
}

export async function updateProfile(data: { name: string; email: string }): Promise<void> {
  await axios.post(`${API_BASE_URL}/user.php`, data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not set in environment variables');
}

// Updated UserProfile interface
export interface UserProfile {
  id: number;
  username?: string; // Add username
  first_name?: string; // Optional or provide default ''
  last_name?: string;  // Optional or provide default ''
  email: string;
  profile_picture_path?: string | null; // Relative path from backend
}

// Type for the data sent to update profile
export interface UpdateProfileData {
    first_name: string;
    last_name: string;
    email: string;
    // profile_picture_url is removed, handled by separate upload endpoint
}

// Type for the response from the update endpoint
interface UpdateProfileResponse {
    success: boolean;
    user?: UserProfile; // Backend returns updated user on success
    error?: string;
}

// Type for password change data
export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}


// --- API Functions ---

export async function getProfile(): Promise<UserProfile> {
  try {
    // No need to manually attach token, session cookie is handled by browser with withCredentials: true
    const response = await axios.get<UserProfile>(`${API_BASE_URL}/user.php`, {
      withCredentials: true,
      // headers: {} // Removed Authorization header
    });
    console.log('User profile fetch response:', response.data);
    // Ensure required fields exist, provide defaults if necessary
    return {
        ...response.data,
        first_name: response.data.first_name ?? '',
        last_name: response.data.last_name ?? '',
    };
  } catch (error: any) {
    console.error('Failed to fetch user profile:', error?.response?.status, error?.response?.data, error?.message);
    // Re-throw or handle error appropriately for the caller
    throw error;
  }
}

export async function updateProfile(data: UpdateProfileData): Promise<UpdateProfileResponse> {
  try {
      // No need to manually attach token, session cookie is handled by browser with withCredentials: true
      const response = await axios.post<UpdateProfileResponse>(`${API_BASE_URL}/user.php`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          // Removed Authorization header
        },
      });
      return response.data; // Return the full response object
  } catch (error: any) {
       console.error('Failed to update profile:', error?.response?.status, error?.response?.data, error?.message);
       // Rethrow or return error structure
       throw error;
  }
}

// TODO: Implement Password Change API call
export async function changePassword(data: ChangePasswordData): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await axios.post<{ success: boolean; error?: string }>(`${API_BASE_URL}/change_password.php`, data, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error: any) {
        console.error('Failed to change password:', error?.response?.status, error?.response?.data, error?.message);
        throw error;
    }
}

// --- Upload Profile Picture ---
export async function uploadProfilePicture(formData: FormData): Promise<{ success: boolean; filePath?: string; message?: string }> {
  try {
    const response = await axios.post<{ success: boolean; filePath?: string; message?: string }>(
      `${API_BASE_URL}/upload_profile_picture.php`,
      formData,
      {
        withCredentials: true,
        headers: {
          // 'Content-Type': 'multipart/form-data' // Axios sets this automatically for FormData
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to upload profile picture:', error?.response?.status, error?.response?.data, error?.message);
    // Return a structured error object
    return {
      success: false,
      message: error?.response?.data?.message || 'Upload failed. Please try again.'
    };
  }
}
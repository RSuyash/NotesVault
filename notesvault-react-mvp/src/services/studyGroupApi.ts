import {
  StudyGroup,
  StudyGroupMember,
  CreateStudyGroupData,
  UpdateStudyGroupData,
  AddMemberData,
} from '../types/studyGroup.js';

// TODO: Move this to environment configuration (.env)
// Example: const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/api'; // Adjust '/api' if needed
const API_BASE_URL = '/api'; // Assuming PHP API is served from /api relative to the frontend host

const STUDY_GROUP_ENDPOINT = `${API_BASE_URL}/study_groups.php`;

// Helper function to handle fetch responses and errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } catch (e) {
      // Ignore if response body is not JSON
    }
    throw new Error(errorMessage);
  }
  // Handle 204 No Content specifically for DELETE requests
  if (response.status === 204) {
    return {} as T; // Return an empty object or null/undefined as appropriate
  }
  return response.json() as Promise<T>;
}

// --- Study Group CRUD ---

export const getAllStudyGroups = async (): Promise<StudyGroup[]> => {
  const response = await fetch(STUDY_GROUP_ENDPOINT);
  return handleResponse<StudyGroup[]>(response);
};

export const getStudyGroupById = async (id: number): Promise<StudyGroup> => {
  const response = await fetch(`${STUDY_GROUP_ENDPOINT}/${id}`);
  return handleResponse<StudyGroup>(response);
};

export const createStudyGroup = async (data: CreateStudyGroupData): Promise<StudyGroup> => {
  const response = await fetch(STUDY_GROUP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<StudyGroup>(response);
};

export const updateStudyGroup = async (id: number, data: UpdateStudyGroupData): Promise<StudyGroup> => {
  const response = await fetch(`${STUDY_GROUP_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<StudyGroup>(response);
};

export const deleteStudyGroup = async (id: number): Promise<void> => {
  const response = await fetch(`${STUDY_GROUP_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
  await handleResponse<void>(response); // Expects 204 No Content on success
};

// --- Membership Management ---

export const getGroupMembers = async (groupId: number): Promise<StudyGroupMember[]> => {
    const response = await fetch(`${STUDY_GROUP_ENDPOINT}/${groupId}/members`);
    return handleResponse<StudyGroupMember[]>(response);
};

export const addMemberToGroup = async (groupId: number, data: AddMemberData): Promise<{ message: string }> => {
    const response = await fetch(`${STUDY_GROUP_ENDPOINT}/${groupId}/members`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse<{ message: string }>(response); // Expects a success message
};

export const removeMemberFromGroup = async (groupId: number, userId: number): Promise<void> => {
    const response = await fetch(`${STUDY_GROUP_ENDPOINT}/${groupId}/members/${userId}`, {
        method: 'DELETE',
    });
    await handleResponse<void>(response); // Expects 204 No Content
};
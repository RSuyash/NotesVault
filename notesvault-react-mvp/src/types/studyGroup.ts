// Represents a user (adjust based on your actual user data structure)
export interface StudyGroupMember {
  id: number; // Assuming users.id is INT UNSIGNED
  username: string; // Assuming you have a username column
  email?: string; // Optional email
  joined_at: string; // ISO 8601 date string
}

// Represents a study group fetched from the API
export interface StudyGroup {
  id: number; // Assuming study_groups.id is INT UNSIGNED
  name: string;
  description: string | null;
  is_public: boolean; // In PHP, boolean might come as 0 or 1
  owner_id: number; // Assuming users.id is INT UNSIGNED
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  members?: StudyGroupMember[]; // Optional: Members might be fetched separately or included
}

// Data needed to create a new study group
export interface CreateStudyGroupData {
  name: string;
  description?: string;
  is_public?: boolean;
  owner_id: number; // Temporary: Get from auth state later
}

// Data needed to update a study group
export interface UpdateStudyGroupData {
  name?: string;
  description?: string;
  is_public?: boolean;
}

// Data needed to add a member
export interface AddMemberData {
    user_id: number;
}
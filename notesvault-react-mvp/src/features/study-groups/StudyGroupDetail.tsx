import React, { useState, useEffect } from 'react';
import { StudyGroup, StudyGroupMember } from '../../types/studyGroup.js';
import * as studyGroupApi from '../../services/studyGroupApi.js';
import styles from './StudyGroupDetail.module.css'; // Create this CSS module next

interface StudyGroupDetailProps {
  groupId: number | null; // ID of the group to display, or null if none selected
  onBackToList: () => void; // Function to go back to the list view
}

const StudyGroupDetail: React.FC<StudyGroupDetailProps> = ({ groupId, onBackToList }) => {
  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [members, setMembers] = useState<StudyGroupMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) {
      setGroup(null); // Clear details if no group is selected
      setMembers([]);
      return;
    }

    const fetchGroupDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch group details and members in parallel (or sequentially if preferred)
        const [groupData, memberData] = await Promise.all([
          studyGroupApi.getStudyGroupById(groupId),
          studyGroupApi.getGroupMembers(groupId)
        ]);
        setGroup(groupData);
        setMembers(memberData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch group details');
        console.error(err);
        setGroup(null); // Clear group on error
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]); // Re-run effect when groupId changes

  if (!groupId) {
    return null; // Don't render anything if no group is selected
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading group details...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!group) {
    // This might happen briefly or if fetch failed but didn't set error correctly
    return <div className={styles.error}>Study group not found.</div>;
  }

  return (
    <div className={styles.detailContainer}>
      <button onClick={onBackToList} className={styles.backButton}>&larr; Back to List</button>
      <h2>{group.name}</h2>
      <span className={styles.groupStatus}>{group.is_public ? 'Public' : 'Private'}</span>
      {group.description && <p className={styles.description}>{group.description}</p>}
      <p className={styles.owner}>Owner ID: {group.owner_id}</p> {/* Replace with owner name later */}
      <p className={styles.dates}>Created: {new Date(group.created_at).toLocaleString()}</p>
      <p className={styles.dates}>Updated: {new Date(group.updated_at).toLocaleString()}</p>

      <hr className={styles.separator} />

      <h3>Members ({members.length})</h3>
      {members.length === 0 ? (
        <p>No members yet.</p>
      ) : (
        <ul className={styles.memberList}>
          {members.map(member => (
            <li key={member.id} className={styles.memberItem}>
              {member.username} ({member.email || 'No email'})
              {/* Add button to remove member later (check permissions) */}
            </li>
          ))}
        </ul>
      )}
      {/* Add button/form to add new members later */}
      {/* Add buttons to edit/delete group later (check permissions) */}
    </div>
  );
};

export default StudyGroupDetail;
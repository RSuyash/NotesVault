import React, { useState, useEffect } from 'react';
import { StudyGroup } from '../../types/studyGroup.js';
import * as studyGroupApi from '../../services/studyGroupApi.js';
import StudyGroupListItem from './StudyGroupListItem.js';
import styles from './StudyGroupList.module.css'; // Create this CSS module next

interface StudyGroupListProps {
  onSelectGroup: (id: number) => void; // Pass selection handler up
}

const StudyGroupList: React.FC<StudyGroupListProps> = ({ onSelectGroup }) => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedGroups = await studyGroupApi.getAllStudyGroups();
        setGroups(fetchedGroups);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch study groups');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []); // Empty dependency array means this runs once on mount

  if (isLoading) {
    return <div className={styles.loading}>Loading study groups...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.listContainer}>
      <h2>Study Groups</h2>
      {groups.length === 0 ? (
        <p>No study groups found.</p>
      ) : (
        <ul className={styles.groupList}>
          {groups.map((group) => (
            <StudyGroupListItem
              key={group.id}
              group={group}
              onSelectGroup={onSelectGroup}
            />
          ))}
        </ul>
      )}
      {/* Add button to create new group later */}
    </div>
  );
};

export default StudyGroupList;
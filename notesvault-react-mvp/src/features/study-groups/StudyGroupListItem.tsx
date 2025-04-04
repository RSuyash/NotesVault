import React from 'react';
import { StudyGroup } from '../../types/studyGroup';
import styles from './StudyGroupListItem.module.css'; // Create this CSS module next

interface StudyGroupListItemProps {
  group: StudyGroup;
  onSelectGroup: (id: number) => void; // Function to handle selecting a group
}

const StudyGroupListItem: React.FC<StudyGroupListItemProps> = ({ group, onSelectGroup }) => {
  return (
    <li className={styles.listItem} onClick={() => onSelectGroup(group.id)}>
      <h3 className={styles.groupName}>{group.name}</h3>
      {group.description && <p className={styles.groupDescription}>{group.description}</p>}
      <span className={styles.groupStatus}>{group.is_public ? 'Public' : 'Private'}</span>
      {/* Add more details like member count if needed */}
    </li>
  );
};

export default StudyGroupListItem;
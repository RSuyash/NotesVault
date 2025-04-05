import React, { useState } from 'react';
import StudyGroupList from './StudyGroupList.js';
import StudyGroupDetail from './StudyGroupDetail.js';
// import styles from './StudyGroupsPage.module.css'; // Optional: Add page-level styles if needed

const StudyGroupsPage: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const handleSelectGroup = (id: number) => {
    setSelectedGroupId(id);
  };

  const handleBackToList = () => {
    setSelectedGroupId(null);
  };

  return (
    <div> {/* Optional: Add className={styles.pageContainer} if using CSS module */}
      <h1>Study Groups Feature</h1> {/* Placeholder Title */}

      {selectedGroupId === null ? (
        <StudyGroupList onSelectGroup={handleSelectGroup} />
      ) : (
        <StudyGroupDetail groupId={selectedGroupId} onBackToList={handleBackToList} />
      )}

      {/*
        Future additions:
        - Button to trigger 'Create New Group' form/modal
        - Integration with main app layout/navigation
      */}
    </div>
  );
};

export default StudyGroupsPage;
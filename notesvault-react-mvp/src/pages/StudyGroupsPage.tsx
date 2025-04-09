import React, { useState, useEffect } from 'react';
import styles from './StudyGroupsPage.module.css';
import { PlusIcon, UserPlusIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import Modal from '../../components/ui/Modal.tsx'; // Assuming a Modal component exists

interface Group {
  id: number;
  name: string;
}

const StudyGroupsPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [createdGroupInfo, setCreatedGroupInfo] = useState<{ id: number; code: string } | null>(null);
  const [joinStatus, setJoinStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [myGroups, setMyGroups] = useState<Group[]>([]); // Placeholder for fetched groups
  const [loading, setLoading] = useState(false);

  // TODO: Fetch user's groups on component mount
  useEffect(() => {
    // Placeholder data
    setMyGroups([
      { id: 1, name: 'Physics Study Group' },
      { id: 2, name: 'React Devs' },
    ]);
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCreatedGroupInfo(null);
    try {
      const response = await fetch('/api/study_groups.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', name: groupName, description: groupDesc }),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create group');
      }
      setCreatedGroupInfo({ id: data.group_id, code: data.invite_code });
      // Reset form, keep modal open to show info
      setGroupName('');
      setGroupDesc('');
    } catch (error: any) {
      alert(`Error: ${error.message}`); // Simple alert for now
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setJoinStatus(null);
    try {
      const response = await fetch('/api/study_groups.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', invite_code: inviteCode }),
        credentials: 'include',
      });
      const data = await response.json();
       if (!response.ok || !data.success) {
         // Handle specific errors like 404 for invalid code
         if (response.status === 404) {
            throw new Error('Invalid invite code');
         }
        throw new Error(data.error || 'Failed to join group');
      }
      setJoinStatus({ success: true, message: data.message || 'Successfully joined!' });
       // TODO: Refetch groups list
      setShowJoinModal(false); // Close modal on success
    } catch (error: any) {
       setJoinStatus({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = () => {
    if (createdGroupInfo) {
      navigator.clipboard.writeText(createdGroupInfo.code)
        .then(() => alert('Invite code copied!'))
        .catch(() => alert('Failed to copy code'));
    }
  };


  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Study Groups</h1>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Actions</h2>
        <div className={styles.buttonContainer}>
          <button className={`${styles.button} ${styles.createButton}`} onClick={() => setShowCreateModal(true)}>
            <PlusIcon className={styles.buttonIcon} />
            Create Group
          </button>
          <button className={`${styles.button} ${styles.joinButton}`} onClick={() => setShowJoinModal(true)}>
            <UserPlusIcon className={styles.buttonIcon} />
            Join Group
          </button>
        </div>
      </div>

      <div className={styles.card}>
         <h2 className={styles.cardTitle}>My Groups</h2>
         {myGroups.length > 0 ? (
           <ul className={styles.groupList}>
             {myGroups.map(group => (
               <li key={group.id} className={styles.groupItem}>{group.name}</li>
             ))}
           </ul>
         ) : (
           <p className={styles.noGroupsText}>You haven't joined any groups yet.</p>
         )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <Modal title="Create New Study Group" onClose={() => { setShowCreateModal(false); setCreatedGroupInfo(null); }}>
          {!createdGroupInfo ? (
            <form onSubmit={handleCreateGroup} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="groupName">Group Name</label>
                <input
                  type="text"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="groupDesc">Description (Optional)</label>
                <textarea
                  id="groupDesc"
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Creating...' : 'Create Group'}
              </button>
            </form>
          ) : (
            <div className={styles.inviteInfo}>
              <p>Group created successfully!</p>
              <p>Invite Code:</p>
              <div className={styles.inviteCodeBox}>
                <code>{createdGroupInfo.code}</code>
                <button onClick={copyInviteCode} className={styles.copyButton} title="Copy code">
                  <ClipboardDocumentIcon className={styles.copyIcon} />
                </button>
              </div>
              {/* <p>Share this link: {`${window.location.origin}/join-group?code=${createdGroupInfo.code}`}</p> */}
              <button onClick={() => { setShowCreateModal(false); setCreatedGroupInfo(null); }} className={styles.closeButton}>
                Close
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* Join Group Modal */}
      {showJoinModal && (
        <Modal title="Join Study Group" onClose={() => { setShowJoinModal(false); setJoinStatus(null); }}>
          <form onSubmit={handleJoinGroup} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="inviteCode">Invite Code</label>
              <input
                type="text"
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />
            </div>
             {joinStatus && (
                <p className={joinStatus.success ? styles.successText : styles.errorText}>
                  {joinStatus.message}
                </p>
             )}
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Joining...' : 'Join Group'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StudyGroupsPage;
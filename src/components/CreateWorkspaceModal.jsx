import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

const CreateWorkspaceModal = ({ closeModal }) => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [teamLead, setTeamLead] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  // Filter users who are available for the Team Lead role (not admin, and AvailableForTeamLead is true or not false)
  const availableForTeamLeadUsers = users.filter(user => user.role !== 'admin' && user.AvailableForTeamLead !== false);

  // Filter out users who are available for membership and are not the selected Team Lead and also exclude those whose AvailableForTeamLead is false
  const availableMembers = users.filter(user => 
    user.id !== teamLead && 
    user.role !== 'admin' && 
    user.AvailableForMember !== false &&
    user.AvailableForTeamLead !== false  // Exclude members with AvailableForTeamLead as false
  );

  const handleCreateWorkspace = async () => {
    try {
      if (!workspaceName || !teamLead || selectedMembers.length === 0) {
        alert("Please fill in all the required fields.");
        return;
      }

      // Create a new workspace document in the Firestore `workspaces` collection
      await addDoc(collection(db, 'workspaces'), {
        WorkspaceName: workspaceName,
        TeamLead: availableForTeamLeadUsers.find(user => user.id === teamLead).name,
        Members: selectedMembers.map(memberId => availableMembers.find(member => member.id === memberId).name),
      });

      // Update the Team Lead's `AvailableForTeamLead` to false
      const teamLeadRef = doc(db, 'users', teamLead);
      await updateDoc(teamLeadRef, {
        AvailableForTeamLead: false,
      });

      // Update each selected member's `AvailableForMember` to false
      for (const memberId of selectedMembers) {
        const memberRef = doc(db, 'users', memberId);
        await updateDoc(memberRef, {
          AvailableForMember: false,
        });
      }

      alert('Workspace created successfully!');

      // Reset the form
      setWorkspaceName('');
      setTeamLead('');
      setSelectedMembers([]);

      closeModal();
    } catch (error) {
      console.error("Error creating workspace: ", error);
      alert('Error creating workspace. Please try again.');
    }
  };

  const handleMemberSelection = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  return (
    <div className="modal">
      <h2>Create Workspace</h2>
      <input
        type="text"
        placeholder="Workspace Name"
        value={workspaceName}
        onChange={(e) => setWorkspaceName(e.target.value)}
      /><br />

      <label>Assign Team Lead:</label>
      <select value={teamLead} onChange={(e) => setTeamLead(e.target.value)}>
        <option value="">Select Team Lead</option>
        {availableForTeamLeadUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select><br />

      <h4>Select Members:</h4>
      {availableMembers.map((user) => (
        <div key={user.id}>
          <label>
            <input
              type="checkbox"
              value={user.id}
              checked={selectedMembers.includes(user.id)}
              onChange={() => handleMemberSelection(user.id)}
            />
            {user.name}
          </label>
        </div>
      ))}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleCreateWorkspace}>Create Workspace</button>
      <button onClick={closeModal}>Cancel</button>
    </div>
  );
};

export default CreateWorkspaceModal;

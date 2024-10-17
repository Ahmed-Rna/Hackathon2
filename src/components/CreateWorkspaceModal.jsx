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

  const availableForTeamLeadUsers = users.filter(user => user.role !== 'admin' && user.AvailableForTeamLead !== false);
  const availableMembers = users.filter(user => 
    user.id !== teamLead && 
    user.role !== 'admin' && 
    user.AvailableForMember !== false &&
    user.AvailableForTeamLead !== false 
  );

  const handleCreateWorkspace = async () => {
    try {
      if (!workspaceName || !teamLead || selectedMembers.length === 0) {
        alert("Please fill in all the required fields.");
        return;
      }

      await addDoc(collection(db, 'workspaces'), {
        WorkspaceName: workspaceName,
        TeamLead: availableForTeamLeadUsers.find(user => user.id === teamLead).name,
        Members: selectedMembers.map(memberId => availableMembers.find(member => member.id === memberId).name),
      });

      const teamLeadRef = doc(db, 'users', teamLead);
      await updateDoc(teamLeadRef, {
        AvailableForTeamLead: false,
      });

      for (const memberId of selectedMembers) {
        const memberRef = doc(db, 'users', memberId);
        await updateDoc(memberRef, {
          AvailableForMember: false,
        });
      }

      alert('Workspace created successfully!');
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
    <div className="bg-gray-300 p-6 rounded-lg shadow-lg max-w-lg mx-auto my-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Workspace</h2>
      <input
        type="text"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        placeholder="Workspace Name"
        value={workspaceName}
        onChange={(e) => setWorkspaceName(e.target.value)}
      />

      <label className="block mb-2">Assign Team Lead:</label>
      <select
        value={teamLead}
        onChange={(e) => setTeamLead(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      >
        <option value="">Select Team Lead</option>
        {availableForTeamLeadUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      <h4 className="mb-2">Select Members:</h4>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {availableMembers.map((user) => (
          <label key={user.id} className="flex items-center">
            <input
              type="checkbox"
              value={user.id}
              checked={selectedMembers.includes(user.id)}
              onChange={() => handleMemberSelection(user.id)}
              className="mr-2"
            />
            {user.name}
          </label>
        ))}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-end space-x-4">
        <button
          onClick={handleCreateWorkspace}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Create Workspace
        </button>
        <button
          onClick={closeModal}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;

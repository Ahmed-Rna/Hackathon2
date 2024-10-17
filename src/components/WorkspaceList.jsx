import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc, arrayRemove, query, where, deleteDoc } from 'firebase/firestore';

const WorkspaceList = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedMemberName, setSelectedMemberName] = useState('');

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const workspacesSnapshot = await getDocs(collection(db, 'workspaces'));
        const workspacesList = workspacesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWorkspaces(workspacesList);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleDeleteMember = async (workspaceId, memberId) => {
    try {
      console.log("Attempting to delete member with ID:", memberId);

      const workspaceRef = doc(db, 'workspaces', workspaceId);
      await updateDoc(workspaceRef, {
        Members: arrayRemove(memberId)
      });

      const userQuery = query(collection(db, 'users'), where('name', '==', selectedMemberName));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        await updateDoc(userDoc.ref, {
          AvailableForMember: true
        });
        console.log("Successfully updated AvailableForMember to true.");
      } else {
        console.error("User document does not exist for member name:", selectedMemberName);
        alert("Error: The user document does not exist.");
      }

      setWorkspaces(prevWorkspaces => 
        prevWorkspaces.map(workspace => 
          workspace.id === workspaceId 
            ? { ...workspace, Members: workspace.Members.filter(member => member !== memberId) }
            : workspace
        )
      );

      alert('Member removed successfully from workspace.');
    } catch (error) {
      console.error('Error removing member from workspace:', error);
      alert('Error removing member. Please try again.');
    }
  };

  const handleDeleteWorkspace = async (workspaceId, teamLead, members) => {
    try {
      const teamLeadQuery = query(collection(db, 'users'), where('name', '==', teamLead));
      const teamLeadSnapshot = await getDocs(teamLeadQuery);

      if (!teamLeadSnapshot.empty) {
        const teamLeadDoc = teamLeadSnapshot.docs[0];
        await updateDoc(teamLeadDoc.ref, {
          AvailableForTeamLead: true
        });
        console.log("Successfully updated AvailableForTeamLead to true.");
      } else {
        console.error("User document does not exist for team lead name:", teamLead);
        alert("Error: The team lead document does not exist.");
      }

      for (const memberId of members) {
        const memberQuery = query(collection(db, 'users'), where('name', '==', memberId));
        const memberSnapshot = await getDocs(memberQuery);

        if (!memberSnapshot.empty) {
          const memberDoc = memberSnapshot.docs[0];
          await updateDoc(memberDoc.ref, {
            AvailableForMember: true
          });
          console.log(`Successfully updated AvailableForMember to true for ${memberId}.`);
        } else {
          console.error("User document does not exist for member name:", memberId);
        }
      }

      const workspaceRef = doc(db, 'workspaces', workspaceId);
      await deleteDoc(workspaceRef);

      console.log("Workspace deleted successfully.");
      setWorkspaces(prevWorkspaces => prevWorkspaces.filter(workspace => workspace.id !== workspaceId));

      alert('Workspace deleted successfully.');
    } catch (error) {
      console.error('Error deleting workspace:', error);
      alert('Error deleting workspace. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">List of Workspaces</h2>
      <div className="space-y-4">
        {workspaces.length === 0 ? (
          <p className="text-gray-500">No workspaces available.</p>
        ) : (
          workspaces.map((workspace) => (
            <div key={workspace.id} className="border p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium">Workspace Name: {workspace.WorkspaceName}</h3>
              <p><strong>Team Lead:</strong> {workspace.TeamLead}</p>
              <p><strong>Members:</strong> {workspace.Members.join(', ')}</p>

              <div className="mt-4">
                <label className="block mb-2">Select a member to remove:</label>
                <select
                  className="border p-2 rounded w-full mb-2"
                  value={selectedMember}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setSelectedWorkspace(workspace.id);
                    setSelectedMember(selectedId);
                    setSelectedMemberName(selectedId);
                  }}
                >
                  <option value="">Select a member</option>
                  {workspace.Members.map((memberId) => (
                    <option key={memberId} value={memberId}>{memberId}</option> 
                  ))}
                </select>
              </div>

              <div className="flex justify-between space-x-4">
                <button
                  onClick={() => handleDeleteMember(selectedWorkspace, selectedMember)}
                  disabled={!selectedMember}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  Remove Member
                </button>

                <button
                  onClick={() => handleDeleteWorkspace(workspace.id, workspace.TeamLead, workspace.Members)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                >
                  Delete Workspace
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkspaceList;

// import React, { useState, useEffect } from 'react';
// import { db } from '../../firebase';
// import { collection, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
// import CreateWorkspaceModal from '../../components/CreateWorkspaceModal';

// const AdminDashboard = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [workspaces, setWorkspaces] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
       
//         const usersSnapshot = await getDocs(collection(db, 'users'));
//         const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setUsers(usersList);

       
//         const workspacesSnapshot = await getDocs(collection(db, 'workspaces'));
//         const workspacesList = workspacesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setWorkspaces(workspacesList);
//       } catch (error) {        console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

  
//   const handleAddUser = async (workspaceId, userId) => {
//     try {
//       const workspaceRef = doc(db, 'workspaces', workspaceId);
//       await updateDoc(workspaceRef, {
//         Members: arrayUnion(userId)
//       });
//     } catch (error) {
//       console.error("Error adding user to workspace:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Admin Dashboard</h1>
//       <button onClick={openModal}>Create Workspace</button>

     
//       {isModalOpen && <CreateWorkspaceModal users={users} closeModal={closeModal} />}

      
//       <h2>List of Workspaces</h2>
//       <div>
//         {workspaces.length === 0 ? (
//           <p>No workspaces available.</p>
//         ) : (
//           workspaces.map((workspace) => (
//             <div key={workspace.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
//               <h3>Workspace Name: {workspace.WorkspaceName}</h3>
//               <p><strong>Team Lead:</strong> {workspace.TeamLead}</p> 
//               <p><strong>Members:</strong> {workspace.Members.join(', ')}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import CreateWorkspaceModal from '../../components/CreateWorkspaceModal';

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // useNavigate for navigation

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={openModal}>Create Workspace</button>
      <button onClick={() => navigate('/workspaces')}>View Workspaces</button> {/* Button to navigate to WorkspaceList */}

      {isModalOpen && <CreateWorkspaceModal closeModal={closeModal} />}
    </div>
  );
};

export default AdminDashboard;

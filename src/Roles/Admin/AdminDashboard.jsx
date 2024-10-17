import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateWorkspaceModal from '../../components/CreateWorkspaceModal';

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-400 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      <div className="flex space-x-4">
        <button
          onClick={openModal}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
        >
          Create Workspace
        </button>
        <button
          onClick={() => navigate('/workspaces')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
        >
          View Workspaces
        </button>
      </div>

      {isModalOpen && <CreateWorkspaceModal closeModal={closeModal} />}
    </div>
  );
};

export default AdminDashboard;

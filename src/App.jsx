
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup'
import Login from './components/Login'
import AdminDashboard from './Roles/Admin/AdminDashboard'
import MemberDashboard from './Roles/Member/MemberDashboard'
import TeamLeadDashboard from './Roles/TeamLead/TeamLeadDashboard'
import WorkspaceList from './components/WorkspaceList';

export default function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/Team-lead-dashboard" element={<TeamLeadDashboard/>} />
        <Route path="/member-dashboard" element={<MemberDashboard/>} />
        <Route path="/workspaces" element={<WorkspaceList />} /> 
        
      </Routes>
    </Router>
    </>
  )
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        if (userRole === role) {
          alert('User logged in successfully ');

          if (userRole === 'admin') {
            navigate('/Admin-dashboard ');
          } else if (userRole === 'team_lead') {
            navigate('/Team-lead-dashboard');
          } else if (userRole === 'team_member') {
            navigate('/member-dashboard');
          }

          setEmail('');
          setPassword('');
          setRole('');
        } else {
          throw new Error('Unauthorized role: ' + userRole);
        }
      } else {
        throw new Error('User document not found.');
      }
    } catch (error) {
      setError(error.message);
      alert(error.message);
      setEmail('');
      setPassword('');
      setRole('');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-400 to-purple-600">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 space-y-6">
        <h1 className="text-3xl font-semibold text-center text-gray-700">Login</h1>
        {error && (
          <p className="text-red-500 text-center bg-red-100 p-2 rounded-md">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Role</label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={(e) => setRole(e.target.value)}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Admin</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  value="team_lead"
                  checked={role === 'team_lead'}
                  onChange={(e) => setRole(e.target.value)}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Team Lead</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  value="team_member"
                  checked={role === 'team_member'}
                  onChange={(e) => setRole(e.target.value)}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Team Member</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:bg-gradient-to-l focus:ring-4 focus:ring-blue-300"
          >
            Log in
          </button>

          <button
            type="button"
            onClick={() => navigate('/Signup')}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
          >
            Go to Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

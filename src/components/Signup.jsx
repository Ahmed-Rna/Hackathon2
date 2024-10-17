import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('team_member');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const availableForTeamLead = role !== 'admin';
      const availableForMember = true;

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email: user.email,
        role,
        AvailableForTeamLead: availableForTeamLead,
        AvailableForMember: availableForMember
      });

      if (userCredential && user) {
        alert('User signed up successfully');
      }

      setName('');
      setEmail('');
      setPassword('');
      setRole('team_member');
    } catch (error) {
      setError(error.message);
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-700">Sign Up</h2>
        {error && (
          <p className="text-red-500 text-center bg-red-100 p-2 rounded-md">
            {error}
          </p>
        )}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>

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
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                  className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Admin</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  value="team_lead"
                  checked={role === 'team_lead'}
                  onChange={(e) => setRole(e.target.value)}
                  className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Team Lead</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  value="team_member"
                  checked={role === 'team_member'}
                  onChange={(e) => setRole(e.target.value)}
                  className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Team Member</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:bg-gradient-to-l focus:ring-4 focus:ring-green-300"
          >
            Sign Up
          </button>
        </form>

        <Link to="/">
          <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 mt-4">
            Go to Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Signup;

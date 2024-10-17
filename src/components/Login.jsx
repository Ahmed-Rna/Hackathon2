// src/components/Login.jsx
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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />

        <div>
          <label>
            <input
              type="radio"
              value="admin"
              checked={role === 'admin'}
              onChange={(e) => setRole(e.target.value)}
            />
            Admin<br />
          </label>
          <label>
            <input
              type="radio"
              value="team_lead"
              checked={role === 'team_lead'}
              onChange={(e) => setRole(e.target.value)}
            />
            Team Lead<br />
          </label>
          <label>
            <input
              type="radio"
              value="team_member"
              checked={role === 'team_member'}
              onChange={(e) => setRole(e.target.value)}
            />
            Team Member<br />
          </label>
        </div>

        <button type="submit">Submit </button><br /><br /><br />
        <button onClick={() => navigate('/Signup')}>Go to Signup</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;


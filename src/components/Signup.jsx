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
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br />
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

        <button type="submit">Submit</button><br /><br /><br />
      </form>
      {error && <p>{error}</p>}
      <Link to="/">
        <button>Go to Login</button>
      </Link>
    </div>
  );
};

export default Signup;


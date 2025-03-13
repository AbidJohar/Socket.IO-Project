/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import '../index.css'; // Import the new CSS file

function UserLogin({ onLogin }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onLogin(input.trim());
    } else {
      alert("Enter a username please");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Enter Username</h2>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your username"
        />
        <button type="submit">Join Chat</button>
      </form>
    </div>
  );
}

export default UserLogin;
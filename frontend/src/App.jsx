/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import UserLogin from './components/UserLogin';
import './App.css';

function App() {
  const [username, setUsername] = useState(null);

  return (
    <div className="App">
      {!username ? (
        <UserLogin onLogin={setUsername} />
      ) : (
        <ChatWindow username={username} />
      )}
    </div>
  );
}

export default App;
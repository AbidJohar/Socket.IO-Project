/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react';
import io from 'socket.io-client';
import '../App.css'; // Import App.css (adjust path if needed)

function ChatWindow({ username }) {
  const socket = useMemo(() => {
    return io('http://localhost:3000', {
      reconnection: true,
    });
  }, []);

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [unreadCounts, setUnreadCounts] = useState({}); // New state for unread counts

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      socket.emit('register', username);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setUsers([]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('userList', (userList) => {
      setUsers(userList.filter(user => user !== username));
    });

    socket.on('privateMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
      // Increment unread count if sender isn't selected
      if (!selectedUsers.includes(msg.from)) {
        setUnreadCounts(prev => ({
          ...prev,
          [msg.from]: (prev[msg.from] || 0) + 1
        }));
      }
    });

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('userList');
      socket.off('privateMessage');
      socket.emit('userDisconnect', username);
      socket.disconnect();
    };
  }, [username, socket, selectedUsers]);

  const sendMessage = () => {
    if (!isConnected) {
      alert('Not connected to server');
      return;
    }

    if (message.trim() && selectedUsers.length > 0) {
      if (selectedUsers.length === 1) {
        socket.emit('privateMessage', {
          to: selectedUsers[0],
          message,
          from: username
        });
      } else {
        socket.emit('groupMessage', {
          recipients: selectedUsers,
          message,
          from: username
        });
      }
      setMessages(prev => [...prev, {
        from: username,
        message,
        timestamp: new Date(),
        isGroup: selectedUsers.length > 1
      }]);
      setMessage('');
    }
  };

  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => 
      prev.includes(user) 
        ? prev.filter(u => u !== user)
        : [...prev, user]
    );
    // Reset unread count for the selected user
    setUnreadCounts(prev => ({
      ...prev,
      [user]: 0
    }));
  };

  return (
    <div className="chat-window">
      <div className="sidebar">
        <h3>Users {username} {isConnected ? '(Online)' : '(Offline)'}</h3>
        {users.map(user => (
          <div 
            key={user}
            className={`user ${selectedUsers.includes(user) ? 'selected' : ''}`}
            onClick={() => toggleUserSelection(user)}
          >
            <div className="user-info">
              <img 
                src={`http://dummyimage.com/50x50/c/0?text=${user.charAt(0)}`} 
                alt={`${user}'s profile`}
                className="user-avatar"
              />
              <span className="user-name">{user}</span>
            </div>
            {unreadCounts[user] > 0 && (
              <div className="unread-count">
                {unreadCounts[user]}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="chat-area">
        <div className="messages">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.from === username ? 'sent' : 'received'}`}
              data-timestamp={new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            >
              <strong>{msg.from}: </strong>
              {msg.message}
              {msg.isGroup && <span> (Group)</span>}
            </div>
          ))}
        </div>
        <div className="message-input">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected}
          />
          <button onClick={sendMessage} disabled={!isConnected}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
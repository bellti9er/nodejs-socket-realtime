import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:8080');

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [username, setUsername] = useState<string>("");
  const [message, setMessage]   = useState<string>("");

  useEffect(() => {
    socket.on('new_connect', (username: string) => {
      setMessages(prev => [...prev, `${username} has joined the chat`]);
    });

    socket.on('username_changed', (data: { oldUsername: string, newUsername: string }) => {
      setMessages(prev => [...prev, `${data.oldUsername} changed username to ${data.newUsername}`]);
    });

    socket.on('receive_message', (message: string) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('error_message', (errorMsg: string) => {
      setMessages(prev => [...prev, `Error: ${errorMsg}`]);
    });
  }, []);

  const sendMessage = () => {
    socket.emit('send_message', message);
    setMessage("");
  };

  const changeUsername = () => {
    socket.emit('change_username', { username });  // 여기에 username 변경 로직 추가
  };

  return (
    <div className="App">
      <h1>Chat</h1>
      <div id="chat-box">
        {messages.map((msg, i) => <p key={i}>{msg}</p>)}
      </div>
      <div className="message-box">
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Enter your message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div className="username-box">
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Enter new username"
        />
        <button onClick={changeUsername}>Change Username</button>
      </div>
    </div>
  );
}

export default App;

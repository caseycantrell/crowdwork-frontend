import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const Dancefloor = () => {
  const router = useRouter();
  const { dancefloorId } = router.query; // dancefloorId from the URL params
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>(''); // State for input message
  const [messages, setMessages] = useState<string[]>([]); // State for received messages

  // Connect to the WebSocket server when the component mounts
  useEffect(() => {
    if (typeof dancefloorId === 'string') {
      console.log('Establishing WebSocket connection...');
      const newSocket = io('http://localhost:3002', {
        withCredentials: true, // This ensures the connection uses credentials, matching your backend CORS setup
      });

      // Listen for the 'connect' event
      newSocket.on('connect', () => {
        console.log('WebSocket connected:', newSocket.id);

        // Join the dancefloor room by sending the dancefloorId to the server
        newSocket.emit('joinDancefloor', dancefloorId);
      });

      // Listen for incoming messages from the server
      newSocket.on('message', (message) => {
        console.log('Received message from server:', message);
        setMessages((prevMessages) => [...prevMessages, message]); // Update messages state
      });

      // Handle disconnection
      newSocket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      // Clean up the socket connection when the component unmounts
      setSocket(newSocket);
      return () => {
        newSocket.close();
      };
    }
  }, [dancefloorId]);

  // Function to handle sending messages
  const handleSendMessage = () => {
    if (socket && message.trim()) {
      console.log('Sending message:', message); // Log the message being sent
      socket.emit('sendMessage', { dancefloorId, message }); // Emit the message with dancefloorId
      setMessage(''); // Clear the input after sending
    }
  };

  return (
    <div>
      <h1>Dancefloor {dancefloorId}</h1>

      {/* Input field for sending messages */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <button onClick={handleSendMessage}>Send Message</button>

      {/* Display received messages */}
      <div>
        <h2>Messages</h2>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dancefloor;

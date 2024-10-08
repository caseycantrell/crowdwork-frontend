import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Link from 'next/link';

const Dancefloor = () => {
  const router = useRouter();
  const { dancefloorId, djId } = router.query;
  console.log("dancefloorId",dancefloorId )
  console.log("djId",djId )
  const [socket, setSocket] = useState<Socket | null>(null);
  const [songRequest, setSongRequest] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [songRequests, setSongRequests] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [voteErrors, setVoteErrors] = useState<{ [key: string]: string | null }>({});
  const [messageError, setMessageError] = useState<string>('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // fetch existing song requests and messages when the component mounts
  useEffect(() => {
    if (typeof dancefloorId === 'string') {
      fetchSongRequests();
      fetchMessages(); // fetch messages when component mounts
    }
  }, [dancefloorId, backendUrl]);

  // connect to websocket server when component mounts
  useEffect(() => {
    if (typeof dancefloorId === 'string') {
      const newSocket = io('http://localhost:3002', { withCredentials: true });

      newSocket.on('connect', () => {
        newSocket.emit('joinDancefloor', dancefloorId);
      });

      // listen for new song requests
      newSocket.on('songRequest', (data) => {
        setSongRequests((prevRequests) => [...prevRequests, data]);
      });

      // listen for status updates
      newSocket.on('statusUpdate', (data) => {
        setSongRequests((prevRequests) =>
          prevRequests.map((song) =>
            song.id === data.requestId ? { ...song, status: data.status } : song
          )
        );
      });

      // listen for new messages
      newSocket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      newSocket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      setSocket(newSocket);
      return () => {
        newSocket.close(); // clean up the socket on unmount
      };
    }
  }, [dancefloorId]);


  const fetchSongRequests = async () => {
    if (typeof dancefloorId === 'string') {
      try {
        const res = await fetch(`${backendUrl}/api/dancefloor/${dancefloorId}/song-requests`);
        const data = await res.json();
        setSongRequests(data);
      } catch (error) {
        console.error('Error fetching song requests:', error);
      }
    }
  };

  const fetchMessages = async () => {
    if (typeof dancefloorId === 'string') {
      try {
        const res = await fetch(`${backendUrl}/api/dancefloor/${dancefloorId}/messages`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  };

  // stop dancefloor
  const handleStopDancefloor = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/stop-dancefloor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ djId }),  // Assuming djId is available from the query
      });
  
      if (res.ok) {
        console.log('Dancefloor stopped.');
        router.push(`/dj/${djId}`); // Redirect back to DJ page after stopping
      } else {
        const data = await res.json();
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error stopping dancefloor:', error);
    }
  };
  
  // sending song requests
  const handleSendSongRequest = () => {
    if (socket && songRequest.trim()) {
      socket.emit('songRequest', { dancefloorId, song: songRequest });
      setSongRequest(''); // clear input after sending
    }
  };

  // sending messages
  const handleSendMessage = async () => {
    if (socket && message.trim()) {
      if (message.length > 300) {
        setMessageError('Message exceeds maximum length of 300 characters.');
        return;
      } else {
        setMessageError('');
      }

      try {
        const res = await fetch(`${backendUrl}/api/dancefloor/${dancefloorId}/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }), // Send the message in the request body
        });

        if (res.ok) {
          setMessage(''); // clear input after sending
          const newMessage = { id: Date.now(), message, created_at: new Date() };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } else {
          const data = await res.json();
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // playing a song
  const handlePlay = async (requestId: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/song-request/${requestId}/play`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        console.log('Song is now playing:', requestId);
        fetchSongRequests(); // refresh song requests after playing
      } else {
        const data = await res.json();
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error starting song:', error);
    }
  };

  // completing a song
  const handleComplete = async (requestId: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/song-request/${requestId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        console.log('Song has been marked as completed.');
        fetchSongRequests(); // refresh song requests after completing
      } else {
        const data = await res.json();
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error completing song:', error);
    }
  };

  // declining a song request
  const handleDecline = async (requestId: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/song-request/${requestId}/decline`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        console.log('Song request declined.');
        fetchSongRequests(); // refresh song requests after declining
      } else {
        const data = await res.json();
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error declining song request:', error);
    }
  };

  // voting for a song request
  const handleVote = async (requestId: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/song-request/${requestId}/vote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: socket?.id }),
      });

      const data = await res.json();
      if (res.ok) {
        setSongRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === requestId ? { ...req, votes: data.votes } : req
          )
        );
      } else {
        setVoteErrors((prevErrors) => ({
          ...prevErrors,
          [requestId]: data.error,
        }));
      }
    } catch (error) {
      console.error('Error voting for song:', error);
    }
  };

  // requeuing a song
  const handleRequeue = async (requestId: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/song-request/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'queued' }),
      });

      if (res.ok) {
        console.log('Song has been requeued.');
        fetchSongRequests(); // refresh song requests after requeuing
      } else {
        const data = await res.json();
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error requeuing song:', error);
    }
  };

  const activeRequests = songRequests.filter((request) => request.status === 'queued');
  const nowPlayingSong = songRequests.find((request) => request.status === 'playing');
  const completedRequests = songRequests.filter((request) => request.status === 'completed');
  const declinedRequests = songRequests.filter((request) => request.status === 'declined');

  return (
    <div>
     {djId && 
      <Link 
        href={{
          pathname: `/dj/${djId}`
        }} 
        style={{ marginLeft: '10px' }}
      >
        Go to DJ Page
      </Link>}

      <h1>Dancefloor {dancefloorId}</h1>
      {/* placeholder input for song requests */}
      <button onClick={handleStopDancefloor}>Stop Dancefloor</button>
      <br/>
      <br/>
      <input
        type="text"
        value={songRequest}
        onChange={(e) => setSongRequest(e.target.value)}
        placeholder="Enter your song request"
      />
      <button onClick={handleSendSongRequest}>Send Song Request</button>

      {/* placeholder input for messages */}
      <input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (e.target.value.length > 300) {
            setMessageError('Message exceeds maximum length of 300 characters.');
          } else {
            setMessageError('');
          }
        }}
        placeholder="Enter your message"
      />
      <button onClick={handleSendMessage}>Send Message</button>

      {/* messages input error message display */}
      {messageError && <p style={{ color: 'red' }}>{messageError}</p>}

      <div>
        <h2>Messages</h2>
        {messages.length > 0 ? (
          messages.map((msg, index) => <p key={index}>{msg.message}</p>)
        ) : (
          <p>No messages yet.</p>
        )}
      </div>

      {nowPlayingSong ? (
        <div>
          <h2>Now Playing</h2>
          <p>
            {nowPlayingSong.song} (Votes: {nowPlayingSong.votes})
          </p>
          <button onClick={() => handleComplete(nowPlayingSong.id)}>Complete</button>
          <button onClick={() => handleRequeue(nowPlayingSong.id)}>Requeue</button>
        </div>
      ) : (
        <p>No song is currently playing.</p>
      )}

      <div>
        <h2>Active Requests</h2>
        {activeRequests.length > 0 ? (
          activeRequests.map((request, index) => (
            <div key={index}>
              <p>
                {request.song} (Votes: {request.votes}) (Status: {request.status})
              </p>
              <button onClick={() => handleVote(request.id)}>Vote</button>
              <button onClick={() => handlePlay(request.id)}>Play</button>
              <button onClick={() => handleDecline(request.id)}>Decline</button>
              {voteErrors[request.id] && <p style={{ color: 'red' }}>{voteErrors[request.id]}</p>}
            </div>
          ))
        ) : (
          <p>No active requests.</p>
        )}
      </div>

      <div>
        <h2>Completed Requests</h2>
        {completedRequests.length > 0 ? (
          completedRequests.map((request, index) => (
            <div key={index}>
              <p>
                {request.song} (Votes: {request.votes}) (Status: {request.status})
              </p>
            </div>
          ))
        ) : (
          <p>No completed requests.</p>
        )}
      </div>

      <div>
        <h2>Declined Requests</h2>
        {declinedRequests.length > 0 ? (
          declinedRequests.map((request, index) => (
            <div key={index}>
              <p>
                {request.song} (Votes: {request.votes}) (Status: {request.status})
              </p>
            </div>
          ))
        ) : (
          <p>No declined requests.</p>
        )}
      </div>
    </div>
  );
};

export default Dancefloor;

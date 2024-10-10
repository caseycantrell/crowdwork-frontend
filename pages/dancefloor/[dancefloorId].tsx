import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Link from 'next/link';

const Dancefloor = () => {
  const router = useRouter();
  const { dancefloorId, djId } = router.query;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [songRequest, setSongRequest] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [songRequests, setSongRequests] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [voteErrors, setVoteErrors] = useState<{ [key: string]: string | null }>({});
  const [messageError, setMessageError] = useState<string>('');
  const [isLoadingRequests, setIsLoadingRequests] = useState<boolean>(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);
  const [songRequestsError, setSongRequestsError] = useState<string | null>(null);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [djInfo, setDjInfo] = useState<any>(null); // State for DJ info
  const [djError, setDjError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch DJ info
  const fetchDjInfo = async () => {
    if (typeof djId === 'string') {
      try {
        const res = await fetch(`${backendUrl}/api/dj/${djId}`);
        const data = await res.json();

        if (res.ok) {
          setDjInfo(data);
          setDjError(null); // Clear error
        } else {
          setDjError(data.message || 'Failed to load DJ info.');
        }
      } catch (error) {
        console.error('Error fetching DJ info:', error);
        setDjError('Failed to load DJ info.');
      }
    }
  };
  // fetch existing song requests and messages when the component mounts
  useEffect(() => {
    if (typeof dancefloorId === 'string') {
      fetchSongRequests();
      fetchMessages(); 
    
    if (typeof djId === 'string') {
      fetchDjInfo(); // Fetch DJ info when component mounts
    }// fetch messages when component mounts
    }
  }, [dancefloorId, backendUrl]);

  // connect to websocket server when component mounts
  useEffect(() => {
    if (typeof dancefloorId === 'string') {
      const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, { withCredentials: true });

      newSocket.on('connect', () => {
        newSocket.emit('joinDancefloor', dancefloorId);
      });

      // listen for new song requests
      newSocket.on('songRequest', (data) => {
        setNotification('New song request received!');
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
      newSocket.on('sendMessage', (message) => {
        setNotification('New message received!');
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      newSocket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      setSocket(newSocket);

      // cleanup the socket connection
      return () => {
        if (newSocket && newSocket.connected) {
          newSocket.close();
        }
      };
    }
  }, [dancefloorId]);

  const fetchSongRequests = async () => {
    if (typeof dancefloorId === 'string') {
      setIsLoadingRequests(true);
      try {
        const res = await fetch(`${backendUrl}/api/dancefloor/${dancefloorId}/song-requests`);
        const data = await res.json();

        if (res.ok) {
          setSongRequests(Array.isArray(data) ? data : []);
          setSongRequestsError(null);
        } else {
          setSongRequestsError(data.message || 'Failed to load song requests.');
          setSongRequests([]);
        }
      } catch (error) {
        console.error('Error fetching song requests:', error);
        setSongRequestsError('Failed to load song requests.');
        setSongRequests([]);
      } finally {
        setIsLoadingRequests(false);
      }
    }
  };

  const fetchMessages = async () => {
    if (typeof dancefloorId === 'string') {
      setIsLoadingMessages(true);
      try {
        const res = await fetch(`${backendUrl}/api/dancefloor/${dancefloorId}/messages`);
        const data = await res.json();

        if (res.ok) {
          setMessages(Array.isArray(data) ? data : []);
          setMessagesError(null); // Clear any previous errors if successful
        } else {
          setMessagesError(data.message || 'Failed to load messages.');
          setMessages([]); // Default to empty array on error
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessagesError('Failed to load messages.');
        setMessages([]); // Default to empty array on error
      } finally {
        setIsLoadingMessages(false);
      }
    }
  };

  // stop dancefloor
  const handleStopDancefloor = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/stop-dancefloor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ djId }), 
      });
  
      if (res.ok) {
        console.log('Dancefloor stopped.');
        router.push(`/dj/${djId}`); // redirect back to DJ page after stopping
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
  const handleSendMessage = () => {
    if (socket && message.trim()) {
      if (message.length > 300) {
        setMessageError('Message exceeds maximum length of 300 characters.');
        return;
      } else {
        setMessageError('');
      }
  
      socket.emit('sendMessage', { dancefloorId, message });
      setMessage(''); // clear input after sending
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
    // check if the user has already voted for this request in their cookies
    if (document.cookie.includes(`voted_for_${requestId}`)) {
      setVoteErrors((prevErrors) => ({
        ...prevErrors,
        [requestId]: 'You have already voted for this song request.',
      }));
      return;
    }
  
    try {
      const res = await fetch(`${backendUrl}/api/song-request/${requestId}/vote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
  
      const data = await res.json();
      if (res.ok) {
        // set a cookie to record the vote (expires in 24 hours)
        document.cookie = `voted_for_${requestId}=true; max-age=86400;`;
  
        setSongRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === requestId ? { ...req, votes: data.votes } : req
          )
        );
        setVoteErrors((prevErrors) => ({
          ...prevErrors,
          [requestId]: null, // clear any previous error
        }));
      } else {
        setVoteErrors((prevErrors) => ({
          ...prevErrors,
          [requestId]: data.error,
        }));
      }
    } catch (error) {
      setVoteErrors((prevErrors) => ({
        ...prevErrors,
        [requestId]: 'Error voting for this song.',
      }));
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

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const activeRequests = songRequests.filter((request) => request.status === 'queued');
  const nowPlayingSong = songRequests.find((request) => request.status === 'playing');
  const completedRequests = songRequests.filter((request) => request.status === 'completed');
  const declinedRequests = songRequests.filter((request) => request.status === 'declined');

  return (
    <div>
       {notification && <div className="notification">{notification}</div>}

      {djInfo ? (
        <div>
          <h2>DJ Information</h2>
          <p>Name: {djInfo.name}</p>
          <p>Bio: {djInfo.bio}</p>
          <p>Website: <a href={djInfo.website} target="_blank" rel="noopener noreferrer">{djInfo.website}</a></p>
          <p>Instagram: {djInfo.instagramHandle}</p>
          <p>Twitter: {djInfo.twitterHandle}</p>
          <p>Venmo: {djInfo.venmoHandle}</p>
          <p>CashApp: {djInfo.cashappHandle}</p>
        </div>
      ) : djError ? (
        <p style={{ color: 'red' }}>{djError}</p>
      ) : (
        <p>Loading DJ information...</p>
      )}

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
        {isLoadingMessages ? (
          <p>Loading messages...</p>
        ) : messagesError ? (
          <p style={{ color: 'red' }}>{messagesError}</p>
        ) : messages.length > 0 ? (
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
        <h2>Song Requests</h2>
        {isLoadingRequests ? (
          <p>Loading song requests...</p>
        ) : songRequestsError ? (
          <p style={{ color: 'red' }}>{songRequestsError}</p>
        ) : (
          <>
            {nowPlayingSong ? (
              <div>
                <h2>Now Playing</h2>
                <p>{nowPlayingSong.song} (Votes: {nowPlayingSong.votes})</p>
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
                    <p>{request.song} (Votes: {request.votes})</p>
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
                    <p>{request.song} (Votes: {request.votes})</p>
                    <button onClick={() => handleRequeue(request.id)}>Requeue</button>
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
                    <p>{request.song} (Votes: {request.votes})</p>
                    <button onClick={() => handleRequeue(request.id)}>Requeue</button>
                  </div>
                ))
              ) : (
                <p>No declined requests.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dancefloor;
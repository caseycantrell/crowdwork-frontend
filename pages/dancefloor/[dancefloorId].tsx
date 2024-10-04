import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const Dancefloor = () => {
  const router = useRouter();
  const { dancefloorId } = router.query; 
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>(''); 
  const [messages, setMessages] = useState<string[]>([]); 
  const [songRequest, setSongRequest] = useState<string>(''); 
  const [songRequests, setSongRequests] = useState<any[]>([]);
  const [voteErrors, setVoteErrors] = useState<{ [key: string]: string | null }>({});

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL; 

  // fetch existing song requests when component mounts
  useEffect(() => {
    if (typeof dancefloorId === 'string') {
      fetch(`${backendUrl}/api/dancefloor/${dancefloorId}/song-requests`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Fetched song requests:', data);
          setSongRequests(data);
        })
        .catch((error) => {
          console.error('Error fetching song requests:', error);
        });
    }
  }, [dancefloorId, backendUrl]);

  // connect to the WebSocket server when component mounts
  useEffect(() => {
    if (typeof dancefloorId === 'string') {
      console.log('Establishing WebSocket connection...');
      const newSocket = io('http://localhost:3002', {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        console.log('WebSocket connected:', newSocket.id);
        newSocket.emit('joinDancefloor', dancefloorId);
      });

      newSocket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      newSocket.on('songRequest', (data) => {
        setSongRequests((prevRequests) => [...prevRequests, data]);
      });

      newSocket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      setSocket(newSocket);
      return () => {
        newSocket.close();
      };
    }
  }, [dancefloorId]);


  const handleSendMessage = () => {
    if (socket && message.trim()) {
      socket.emit('sendMessage', { dancefloorId, message });
      setMessage(''); // clear the input after sending
    }
  };


  const handleSendSongRequest = () => {
    if (socket && songRequest.trim()) {
      socket.emit('songRequest', { dancefloorId, song: songRequest });
      setSongRequest(''); // clear the input after sending
    }
  };


  const handleVote = async (requestId: string) => {
    setVoteErrors((prevErrors) => ({ ...prevErrors, [requestId]: null })); // reset error for this request
    if (socket) {
      try {
        const res = await fetch(`${backendUrl}/api/song-request/${requestId}/vote`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: socket.id }), // pass the userId (socket ID)
        });

        const data = await res.json();

        if (res.ok) {
          // update the vote count locally
          const updatedRequest = { ...songRequests.find(req => req.id === requestId), votes: data.votes };
          setSongRequests((prevRequests) => {
            // create a new array including the updated request
            const updatedRequests = prevRequests.map((req) =>
              req.id === requestId ? updatedRequest : req
            );

            // sort the updated requests based on # of votes
            return updatedRequests.sort((a, b) => b.votes - a.votes);
          });
        } else {
          // user has already voted, display the error for the specific song request
          setVoteErrors((prevErrors) => ({ ...prevErrors, [requestId]: data.error }));
        }
      } catch (error) {
        console.error('Error voting for song request:', error);
      }
    }
  };


  const handlePlay = async (requestId: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/song-request/${requestId}/play`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (res.ok) {
        // update the song request status locally
        setSongRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === requestId ? { ...req, status: 'playing' } : req
          )
        );
        console.log(data.message);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error starting song:', error);
    }
  };


  const handleComplete = async (requestId: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/song-request/${requestId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (res.ok) {
        // update the song request status locally
        setSongRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === requestId ? { ...req, status: 'completed' } : req
          )
        );
        console.log(data.message);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error completing song:', error);
    }
  };


  const handleDecline = async (requestId: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/song-request/${requestId}/decline`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await res.json();
      if (res.ok) {
        // update the song request status locally to 'declined'
        setSongRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === requestId ? { ...req, status: 'declined' } : req // update the status of the declined request
          )
        );
        console.log(data.message);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error declining song request:', error);
    }
  };

  return (
    <div>
      <h1>Dancefloor {dancefloorId}</h1>

      {/* input field for messages */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <button onClick={handleSendMessage}>Send Message</button>

      {/* input field for song requests */}
      <input
        type="text"
        value={songRequest}
        onChange={(e) => setSongRequest(e.target.value)}
        placeholder="Enter your song request"
      />
      <button onClick={handleSendSongRequest}>Send Song Request</button>

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


      <div>
        <h2>Active Requests</h2>
        {songRequests.length > 0 ? (
          songRequests
            .filter(request => request.status === 'queued' || request.status === 'playing') // show only active requests
            .sort((a, b) => b.votes - a.votes) // sort by votes
            .map((request, index) => (
              <div key={index}>
                <p>
                  {request.song} (Votes: {request.votes}) (Status: {request.status})
                </p>
                <button onClick={() => handleVote(request.id)}>Vote</button>
                {request.status === 'queued' && (
                  <>
                    <button onClick={() => handlePlay(request.id)}>Play</button>
                    <button onClick={() => handleDecline(request.id)}>Decline</button>
                  </>
                )}
                {request.status === 'playing' && (
                  <button onClick={() => handleComplete(request.id)}>Complete</button>
                )}
                {/* display error message only for this specific song request */}
                {voteErrors[request.id] && <p style={{ color: 'red' }}>{voteErrors[request.id]}</p>}
              </div>
            ))
        ) : (
          <p>No active requests.</p>
        )}

        <h3>Completed Requests</h3>
        {songRequests
          .filter(request => request.status === 'completed')
          .map((request, index) => (
            <div key={index}>
              <p>
                {request.song} (Votes: {request.votes}) (Status: {request.status})
              </p>
            </div>
          ))}

        <h3>Declined Requests</h3>
        {songRequests
          .filter(request => request.status === 'declined')
          .map((request, index) => (
            <div key={index}>
              <p>
                {request.song} (Votes: {request.votes}) (Status: {request.status})
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Dancefloor;

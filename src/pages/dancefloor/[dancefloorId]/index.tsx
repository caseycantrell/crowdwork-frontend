import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import DJView from '@/components/Dancefloor/DJView';
import { checkAuth } from '@/utils/checkAuth';
import MobileView from '@/components/Dancefloor/Mobile/MobileView';

const Dancefloor = () => {
  const router = useRouter();
  const { dancefloorId } = router.query;
  const [ socket, setSocket ] = useState<Socket | null>(null);
  const [ message, setMessage ] = useState<string>('');
  const [ messageError, setMessageError ] = useState<string | null>('');
  const [ messages, setMessages ] = useState<any[]>([]);
  const [ messagesError, setMessagesError ] = useState<string | null>(null);
  const [ songRequest, setSongRequest ] = useState<string>('');
  const [ songRequests, setSongRequests ] = useState<any[]>([]);
  const [ songRequestsError, setSongRequestsError ] = useState<string | null>(null);
  const [ voteErrors, setVoteErrors ] = useState<{ [key: string]: string | null }>({});
  const [ djInfo, setDjInfo ] = useState<any>(null);
  const [ djInfoError, setDjInfoError ] = useState<string | null>(null);
  const [ notification, setNotification ] = useState<string | null>(null);
  const [ requestsCount, setRequestsCount ] = useState<number>(0);
  const [ messagesCount, setMessagesCount ] = useState<number>(0);
  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean | null>(null);
 
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // TODO: decide to show these or not
  console.log("requestsCount", requestsCount)
  console.log("messagesCount", messagesCount)

  // fetch dancefloor & DJ info
  const fetchDancefloorInfo = async () => {
    if (typeof dancefloorId === 'string') {
      try {
        const res = await fetch(`${backendUrl}/api/dancefloor/${dancefloorId}`);
        const data = await res.json();
  
        if (res.ok) {
          setDjInfo(data.dj);
          setSongRequests(data.songRequests || []);
          setMessages(data.messages || []);
          setRequestsCount(data.requests_count || 0);
          setMessagesCount(data.messages_count || 0);
          setDjInfoError(null);
          setSongRequestsError(null);
          setMessagesError(null);
        } else {
          setDjInfoError('Failed to load DJ info.');
          setSongRequestsError('Failed to load dancefloor data.');
          setMessagesError('Failed to load messages.');
        }
      } catch (error) {
        console.error('Error fetching dancefloor and DJ info:', error);
        setDjInfoError('Failed to load DJ info.');
        setSongRequestsError('Failed to load dancefloor data.');
        setMessagesError('Failed to load messages.');
      }
    }
  };
  
  // fetch existing song requests and messages when the component mounts
  useEffect(() => {
    if (typeof dancefloorId === 'string') {
      fetchDancefloorInfo();
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

       // Listen for updated total requests count
      newSocket.on('updateRequestsCount', ({ requestsCount }) => {
        setRequestsCount(requestsCount);
      });

      // listen for new messages
      newSocket.on('sendMessage', (message) => {
        setNotification('New message received!');
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      newSocket.on('updateMessagesCount', ({ messagesCount }) => {
        setMessagesCount(messagesCount);
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


  // stop dancefloor
  const handleStopDancefloor = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/stop-dancefloor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: djInfo.id }), 
      });
  
      if (res.ok) {
        console.log('Dancefloor stopped.');
        router.push(`/dj/${djInfo.id}`); // redirect back to DJ page after stopping
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
        fetchDancefloorInfo(); // refresh song requests after playing
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
        fetchDancefloorInfo(); // refresh song requests after completing
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
        fetchDancefloorInfo(); // refresh song requests after declining
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
        [requestId]: "Only one vote per track is allowed!",
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
        fetchDancefloorInfo(); // refresh song requests after requeuing
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


  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
  
    Object.keys(voteErrors).forEach((requestId) => {
      if (voteErrors[requestId]) {
        const timer = setTimeout(() => {
          setVoteErrors((prevErrors) => ({
            ...prevErrors,
            [requestId]: null,
          }));
        }, 3000);
  
        timers.push(timer);
      }
    });
  
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [voteErrors]);

  useEffect(() => {
    const authenticateUser = async () => {
      const { isAuthenticated, dj } = await checkAuth();
      setIsAuthenticated(isAuthenticated);
      if (dj) setDjInfo(dj);
    };

    authenticateUser();
  }, []);

  const activeRequests = songRequests.filter((request) => request.status === 'queued');
  const nowPlayingSong = songRequests.find((request) => request.status === 'playing');
  const completedRequests = songRequests.filter((request) => request.status === 'completed');
  const declinedRequests = songRequests.filter((request) => request.status === 'declined');

  console.log("isAuthenticated YO", isAuthenticated)

  return ( 
    isAuthenticated ? (
      <DJView 
        notification={notification} 
        isAuthenticated={isAuthenticated}
        djInfo={djInfo} 
        djInfoError={djInfoError}
        songRequest={songRequest}
        setSongRequest={setSongRequest}
        handleSendSongRequest={handleSendSongRequest} 
        songRequestsError={songRequestsError} 
        nowPlayingSong={nowPlayingSong}
        activeRequests={activeRequests}
        completedRequests={completedRequests} 
        declinedRequests={declinedRequests}
        message={message}
        setMessage={setMessage}
        messageError={messageError}
        setMessageError={setMessageError}
        messages={messages}
        messagesError={messagesError} 
        handleSendMessage={handleSendMessage} 
        handleStopDancefloor={handleStopDancefloor} 
        handlePlay={handlePlay} 
        handleDecline={handleDecline} 
        handleComplete={handleComplete} 
        handleRequeue={handleRequeue}  
        handleVote={handleVote} 
        voteErrors={voteErrors} 
      />
    ) : (
      <MobileView 
        isAuthenticated={isAuthenticated}
        djInfo={djInfo} 
        songRequestsError={songRequestsError} 
        nowPlayingSong={nowPlayingSong}
        activeRequests={activeRequests}
        completedRequests={completedRequests} 
        declinedRequests={declinedRequests}
        message={message}
        setMessage={setMessage}
        messageError={messageError}
        setMessageError={setMessageError}
        messages={messages}
        messagesError={messagesError} 
        handleSendMessage={handleSendMessage} 
        handleVote={handleVote} 
        voteErrors={voteErrors} 
      />
    )
  );
};  

export default Dancefloor;
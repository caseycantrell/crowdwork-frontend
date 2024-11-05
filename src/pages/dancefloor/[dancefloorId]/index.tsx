import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DJView from '@/components/Dancefloor/DJView';
import MobileView from '@/components/Dancefloor/Mobile/MobileView';
import { getSocket } from '@/utils/socket';
import { DJInfo } from '@/types/types';
import { useSession } from "next-auth/react";

interface DJ {
  id: string;
  name: string;
}

interface Message {
  id: string;
  created_at: string;
  message: string;
}

interface SongRequest {
  id: string;
  song: string;
  artist: string;
  likes: number;
  created_at: string;
  status: string;
}

interface Dancefloor {
  id: string;
  dj_id: string;
  created_at: string;
  ended_at: string;
  status: string;
  name: string | null;
  requests_count: number;
  messages_count: number;
  messages: Message[];
  songRequests: SongRequest[];
  dj: DJ;
}

const Dancefloor: React.FC = () => {
  const router = useRouter();
  const socket = getSocket();
  const { data: session } = useSession();
  const dancefloorId = Array.isArray(router.query.dancefloorId)
  ? router.query.dancefloorId[0]
  : router.query.dancefloorId || '';
  const [ message, setMessage ] = useState<string>('');
  const [ messageError, setMessageError ] = useState<string | null>('');
  const [ messages, setMessages ] = useState<Message[]>([]);
  const [ messagesError, setMessagesError ] = useState<string | null>(null);
  const [ songRequest, setSongRequest ] = useState<string>('');
  const [ songRequests, setSongRequests ] = useState<SongRequest[]>([]);
  const [ songRequestsError, setSongRequestsError ] = useState<string | null>(null);
  const [ likeErrors, setLikeErrors ] = useState<{ [key: string]: string | null }>({});
  const [ djInfo, setDjInfo ] = useState<DJInfo | null>(null);
  const [ djInfoError, setDjInfoError ] = useState<string | null>(null);
  const [ notification, setNotification ] = useState<string | null>(null);
  const [ requestsCount, setRequestsCount ] = useState<number>(0);
  const [ messagesCount, setMessagesCount ] = useState<number>(0);
 
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // TODO: decide to show these or not
  console.log("requestsCount", requestsCount)
  console.log("messagesCount", messagesCount)

  // fetch dancefloor & DJ info
  const fetchDancefloorInfo = async () => {
    if (backendUrl && dancefloorId) {
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
    if (dancefloorId) {
      fetchDancefloorInfo();
    }
  }, [dancefloorId, backendUrl]);

  // connect to websocket server when component mounts
  useEffect(() => {
    if (dancefloorId) {
      socket.emit('joinDancefloor', dancefloorId);

      socket.on('songRequest', (data) => {
        setNotification('New song request received!');
        setSongRequests((prevRequests) => [...prevRequests, data]);
      });

      socket.on('statusUpdate', (data) => {
        setSongRequests((prevRequests) =>
          prevRequests.map((song) =>
            song.id === data.requestId ? { ...song, status: data.status } : song
          )
        );
      });

      socket.on('updateRequestsCount', ({ requestsCount }) => {
        setRequestsCount(requestsCount);
      });

      socket.on('sendMessage', (message) => {
        setNotification('New message received!');
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('updateMessagesCount', ({ messagesCount }) => {
        setMessagesCount(messagesCount);
      });

      socket.on('likeSongRequest', ({ requestId, likes }) => {
        setSongRequests((prevRequests) =>
          prevRequests.map((song) =>
            song.id === requestId ? { ...song, likes } : song
          )
        );
      });

      socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      return () => {
        socket.off('songRequest');
        socket.off('statusUpdate');
        socket.off('updateRequestsCount');
        socket.off('sendMessage');
        socket.off('updateMessagesCount');
        socket.off('likeSongRequest');
      };
    }
  }, [dancefloorId, socket]);


  // stop dancefloor
  const handleStopDancefloor = async () => {
    if (!backendUrl) return;
    
    try {
      const res = await fetch(`${backendUrl}/api/stop-dancefloor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: djInfo?.id }), 
      });
  
      if (res.ok) {
        console.log('Dancefloor stopped.');
        router.push(`/dj/${djInfo?.id}`); // redirect back to DJ page after stopping
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
      setSongRequest('');
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
      setMessage('');
    }
  };

  // updating song request status
  const updateStatus = async (requestId: string, status: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/song-request/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
  
      if (res.ok) {
        console.log(`Song status updated to ${status}`);
        fetchDancefloorInfo()
      } else {
        console.error('Failed to update song status.');
      }
    } catch (error) {
      console.error('Error updating song status:', error);
    }
  };

  // liking a song request
  const handleLike = (requestId: string, dancefloorId: string) => {
    // check if the user has already liked this request in their cookies
    if (document.cookie.includes(`liked_${requestId}`)) {
      setLikeErrors((prevErrors) => ({
        ...prevErrors,
        [requestId]: "Only one like per track is allowed!",
      }));
      return;
    }
  
    socket.emit('likeSongRequest', { requestId, dancefloorId });
  
    // set a cookie to record the like (24hr exp)
    document.cookie = `liked_${requestId}=true; max-age=86400;`;
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
  
    Object.keys(likeErrors).forEach((requestId) => {
      if (likeErrors[requestId]) {
        const timer = setTimeout(() => {
          setLikeErrors((prevErrors) => ({
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
  }, [likeErrors]);

  const activeRequests = songRequests.filter((request) => request.status === 'queued');
  const nowPlayingSong = songRequests.find((request) => request.status === 'playing');
  const completedRequests = songRequests.filter((request) => request.status === 'completed');
  const declinedRequests = songRequests.filter((request) => request.status === 'declined');

  return ( 
    session ? (
      <DJView 
        notification={notification} 
        dancefloorId={dancefloorId}
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
        handleLike={handleLike} 
        likeErrors={likeErrors} 
        updateStatus={updateStatus}
      />
    ) : (
      <MobileView 
        djInfo={djInfo} 
        dancefloorId={dancefloorId}
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
        handleLike={handleLike} 
        likeErrors={likeErrors}
      />
    )
  );
};  

export default Dancefloor;
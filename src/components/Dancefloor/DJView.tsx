import React, { useState } from 'react';
import Link from 'next/link';

interface DJInfo {
  name: string;
  bio: string;
  website: string;
  instagramHandle: string;
  twitterHandle: string;
  venmoHandle: string;
  cashappHandle: string;
}

interface SongRequest {
  id: string;
  song: string;
  votes: number;
  status: string;
}

interface Message {
  message: string;
}

interface Props {
    djId: string | undefined;
    dancefloorId: string | undefined;
    notification: string | null;
    djInfo: DJInfo | null;
    djError: string | null;
    songRequest: string;
    setSongRequest: (value: string) => void;
    handleSendSongRequest: () => void;
    songRequestsError: string | null;
    isLoadingRequests: boolean;
    nowPlayingSong: SongRequest | null;
    activeRequests: SongRequest[];
    completedRequests: SongRequest[];
    declinedRequests: SongRequest[];
    message: string;
    messages: Message[];
    setMessage: (value: string) => void;
    handleSendMessage: () => void;
    messagesError: string | null;
    isLoadingMessages: boolean;
    handleStopDancefloor: () => void;
    handlePlay: (requestId: string) => void;
    handleDecline: (requestId: string) => void;
    handleComplete: (requestId: string) => void;
    handleRequeue: (requestId: string) => void;
    handleVote: (requestId: string) => void;
    voteErrors: { [key: string]: string | null };
  }

const DJView: React.FC<Props> = ({
  djId,
  dancefloorId,
//   notification,
  djInfo,
  djError,
  songRequest,
  setSongRequest,
  handleSendSongRequest,
  songRequestsError,
  isLoadingRequests,
  nowPlayingSong,
  activeRequests,
  completedRequests,
  declinedRequests,
  message,
  messages,
  setMessage,
  handleSendMessage,
  messagesError,
  isLoadingMessages,
  handleStopDancefloor,
  handlePlay,
  handleDecline,
  handleComplete,
  handleRequeue,
  handleVote,
  voteErrors
}) => {
//   const [message, setMessage] = useState<string>('');
  const [messageError, setMessageError] = useState<string | null>(null);
  
  const djInfoWebsiteUrl = djInfo && (djInfo.website.startsWith('http://') || djInfo.website.startsWith('https://'))
  ? djInfo.website
  : djInfo ? `http://${djInfo.website}` : '';

  return (

    //   {notification && <div className="notification">{notification}</div>}

    <div className="min-h-screen bg-white">
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-4 lg:grid-flow-col gap-4 bg-red-400">
            {/* DJ INFO */}
            <div className="col-span-1 lg:col-span-3 bg-blue-400">
                <p className='text-2xl font-bold'>DJ Information</p>
                {djInfo ? (
                    <div>
                        <p>Name: {djInfo.name}</p>
                        <p>Bio: {djInfo.bio}</p>
                        <p>
                            Website:{' '}
                            <a href={djInfoWebsiteUrl} target="_blank" rel="noopener noreferrer">
                            {djInfo.website}
                            </a>
                        </p>
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

                {djId && (
                    <Link href={`/dj/${djId}`} style={{ marginLeft: '10px' }}>
                        Go to DJ Page
                    </Link>
                )}
            </div>
            
            {/* REQUEST AREA */}
            <div className="row-span-3 col-span-1 lg:col-span-3 bg-green-400">
                <h1>Dancefloor {dancefloorId}</h1>

                <button onClick={handleStopDancefloor}>Stop Dancefloor</button>
                <br />
                <br />

                <input
                type="text"
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                    placeholder="Enter your song request"
                />
                <button onClick={handleSendSongRequest}>Send Song Request</button>

                <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                    setMessage(e.target.value);
                    if (e.target.value.length > 300) {
                        setMessageError('Message exceeds maximum length of 300 characters.');
                    } else {
                        setMessageError(null);
                    }
                    }}
                    placeholder="Enter your message"
                />
                <button onClick={handleSendMessage}>Send Message</button>

        

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

            {/* CHAT */}
            <div className="row-span-1 lg:row-span-4 col-span-1 bg-yellow-400 overflow-y-auto">
            {messageError && <p style={{ color: 'red' }}>{messageError}</p>}
                <p className='text-2xl font-bold'>Messages</p>
                {messageError && <p style={{ color: 'red' }}>{messageError}</p>}
                <div className="break-words overflow-hidden">
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
            </div>
        </div>
    </div>
  );
};

export default DJView;
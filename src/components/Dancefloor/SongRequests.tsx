import React from 'react';

interface SongRequest {
  id: string;
  song: string;
  votes: number;
  status: string;
}

interface Props {
  dancefloorId: string | undefined;
  songRequest: string;
  setSongRequest: (value: string) => void;
  handleSendSongRequest: () => void;
  songRequestsError: string | null;
  isLoadingRequests: boolean;
  nowPlayingSong: SongRequest | null;
  activeRequests: SongRequest[];
  completedRequests: SongRequest[];
  declinedRequests: SongRequest[];
  handleStopDancefloor: () => void;
  handlePlay: (requestId: string) => void;
  handleDecline: (requestId: string) => void;
  handleComplete: (requestId: string) => void;
  handleRequeue: (requestId: string) => void;
  handleVote: (requestId: string) => void;
  voteErrors: { [key: string]: string | null };
}

const SongRequests: React.FC<Props> = ({
  dancefloorId,
  songRequest,
  setSongRequest,
  handleSendSongRequest,
  songRequestsError,
  isLoadingRequests,
  nowPlayingSong,
  activeRequests,
  completedRequests,
  declinedRequests,
  handleStopDancefloor,
  handlePlay,
  handleDecline,
  handleComplete,
  handleRequeue,
  handleVote,
  voteErrors
}) => {
  return (
    <div className="row-span-3 col-span-1 lg:col-span-3 bg-green-400">
      <h1>Dancefloor {dancefloorId}</h1>
      <input
        type="text"
        value={songRequest}
        onChange={(e) => setSongRequest(e.target.value)}
        placeholder="Enter your song request"
      />
      <button onClick={handleSendSongRequest}>Send Song Request</button>
      <button onClick={handleStopDancefloor}>Stop Dancefloor</button>

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
                    <p>
                      {request.song} (Votes: {request.votes})
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
              {completedRequests.map((request, index) => (
                <div key={index}>
                  <p>
                    {request.song} (Votes: {request.votes})
                  </p>
                  <button onClick={() => handleRequeue(request.id)}>Requeue</button>
                </div>
              ))}
            </div>

            <div>
              <h2>Declined Requests</h2>
              {declinedRequests.map((request, index) => (
                <div key={index}>
                  <p>
                    {request.song} (Votes: {request.votes})
                  </p>
                  <button onClick={() => handleRequeue(request.id)}>Requeue</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SongRequests;

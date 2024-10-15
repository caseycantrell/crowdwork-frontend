import React from 'react';
import Request from './Request';
import NowPlaying from './NowPlaying';
import { motion, AnimatePresence } from 'framer-motion'

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
  isChatVisible: boolean;
  setIsChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
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
  voteErrors,
  setIsChatVisible,
  isChatVisible
}) => {
  return (
    <div className="row-span-4 col-span-1 lg:col-span-3 bg-green-400">
     <div className='flex flex-row items-center justify-between my-2 mx-2'>
     <p className='text-2xl font-bold'>Dancefloor {dancefloorId}</p>
     <AnimatePresence>
    {!isChatVisible && (
          <motion.div
          initial={{ opacity: 0 }}  // Start invisible when the button is rendered
          animate={{ opacity: 1 }}  // Fade in to full opacity
          exit={{ opacity: 0 }}  // Fade out when the button is removed
          transition={{ duration: 0.5 }}  // Set the duration for both fade-in and fade-out
        >
          <button
            onClick={() => setIsChatVisible(true)}
            className="bg-purple-500 text-white font-semibold py-2 px-4 rounded"
          >
            Show Chat
          </button>
        </motion.div>
    )}
  </AnimatePresence>
     </div>
      <input
        type="text"
        value={songRequest}
        onChange={(e) => setSongRequest(e.target.value)}
        placeholder="Enter your song request here brotha"
        className='h-10 w-1/3 rounded-md px-2 font-bold ml-2 text-gray-500'
      />
      <button onClick={handleSendSongRequest} className='bg-purple-500 rounded-lg p-2 font-bold mx-3'>Send Song Request</button>
      <button onClick={handleStopDancefloor} className='bg-red-500 rounded-lg p-2 font-bold'>Stop Dancefloor</button>

      {nowPlayingSong ? (
        <div>  
          <NowPlaying id={nowPlayingSong.id} song={nowPlayingSong.song} votes={nowPlayingSong.votes} handleRequeue={handleRequeue} handleComplete={handleComplete} />
        </div>
      ) : (
        <div className='py-4 ml-8'>  
          <p className='text-xl italic'>No song is currently playing.</p>
        </div>
      )}

      <div>
        <p className='text-4xl font-bold ml-2'>Song Requests</p>
        <br/>
        {isLoadingRequests ? (
          <p>Loading song requests...</p>
        ) : songRequestsError ? (
          <p style={{ color: 'red' }}>{songRequestsError}</p>
        ) : (
          <>
            <div>
            <p className='text-2xl font-bold ml-4'>Active Requests</p>
              {activeRequests.length > 0 ? (
                activeRequests.map((request, index) => (
                  <div key={index}>
                    <Request id={request.id} song={request.song} votes={request.votes} voteErrors={voteErrors} handlePlay={handlePlay} handleDecline={handleDecline} handleVote={handleVote} handleRequeue={handleRequeue} />
                  </div>
                ))
              ) : (
                <p className='italic ml-8'>No active requests.</p>
              )}
            </div>
            <div>
              <p className='text-2xl font-bold ml-4'>Completed Requests</p>
              {completedRequests.length > 0 ? (
                completedRequests.map((request, index) => (
                  <div key={index}>
                    <Request id={request.id} song={request.song} votes={request.votes} voteErrors={voteErrors} handlePlay={handlePlay} handleDecline={handleDecline} handleVote={handleVote} handleRequeue={handleRequeue} />
                  </div>
                ))
              ) : (
                <p className='italic ml-8'>No completed requests.</p>
              )}
            </div>
            <div>
            <p className='text-2xl font-bold ml-4'>Declined Requests</p>
            {declinedRequests.length > 0 ? (
                declinedRequests.map((request, index) => (
                  <div key={index}>
                    <Request id={request.id} song={request.song} votes={request.votes} voteErrors={voteErrors} handlePlay={handlePlay} handleDecline={handleDecline} handleVote={handleVote} handleRequeue={handleRequeue} />
                  </div>
                ))
              ) : (
                <p className='italic ml-8'>No declined requests.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SongRequests;
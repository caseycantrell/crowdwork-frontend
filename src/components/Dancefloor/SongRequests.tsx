import React from 'react';
import Request from './Requests/Request';
import ActiveRequest from './Requests/ActiveRequest';
import CompletedRequest from './Requests/CompletedRequest';
import NowPlaying from './Requests/NowPlaying';
import { motion, AnimatePresence } from 'framer-motion'
import DeclinedRequest from './Requests/DeclinedRequest';

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
    <div className="row-span-4 col-span-1 lg:col-span-3 bg-gray-800 pb-96">
     <div className='flex flex-row items-center justify-between m-4'>
     <p className='text-2xl font-bold'>Dancefloor {dancefloorId}</p>
     <AnimatePresence>
      {!isChatVisible && (
            <motion.div
          initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => setIsChatVisible(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 px-4 rounded"
            >
              Show Chat
            </button>
          </motion.div>
      )}
    </AnimatePresence>
     </div>
      {/* <input
        type="text"
        value={songRequest}
        onChange={(e) => setSongRequest(e.target.value)}
        placeholder="Enter your song request here brotha"
        className='h-10 w-1/3 rounded-md px-2 font-bold ml-2 mb-4 text-gray-500'
      />
      <button onClick={handleSendSongRequest} className='bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-2 font-bold mx-3'>Send Song Request</button> */}
      

      {nowPlayingSong ? (
        <div>  
          <NowPlaying id={nowPlayingSong.id} song={nowPlayingSong.song} votes={nowPlayingSong.votes} handleRequeue={handleRequeue} handleComplete={handleComplete} />
        </div>
      ) : (
        <div className='pt-4 pb-8 ml-8'>  
          <p className='text-xl italic'>No song is currently playing.</p>
        </div>
      )}

      <div>
        {isLoadingRequests ? (
          <p>Loading song requests...</p>
        ) : songRequestsError ? (
          <p style={{ color: 'red' }}>{songRequestsError}</p>
        ) : (
          <>
            <div>
            <p className='text-xl font-bold ml-4 py-1'>Active Requests</p>
              {activeRequests.length > 0 ? (
                activeRequests.map((request, index) => (
                  <div key={index}>
                    <ActiveRequest id={request.id} song={request.song} votes={request.votes} voteErrors={voteErrors} handlePlay={handlePlay} handleDecline={handleDecline} handleVote={handleVote} />
                  </div>
                ))
              ) : (
                <p className='italic ml-8'>No active requests.</p>
              )}
            </div>
            <div>
              <p className='text-xl font-bold ml-4 py-1'>Completed Requests</p>
              {completedRequests.length > 0 ? (
                completedRequests.map((request, index) => (
                  <div key={index}>
                    <CompletedRequest id={request.id} song={request.song} votes={request.votes} voteErrors={voteErrors} handleRequeue={handleRequeue} />
                  </div>
                ))
              ) : (
                <p className='italic ml-8'>No completed requests.</p>
              )}
            </div>
            <div>
            <p className='text-xl font-bold ml-4 py-1'>Declined Requests</p>
            {declinedRequests.length > 0 ? (
                declinedRequests.map((request, index) => (
                  <div key={index}>
                    <DeclinedRequest id={request.id} song={request.song} votes={request.votes} voteErrors={voteErrors} handleVote={handleVote} handleRequeue={handleRequeue} />
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
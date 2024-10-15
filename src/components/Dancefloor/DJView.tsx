import { useState } from 'react';
import Chat from './Chat/Chat';
import DJInfo from './DJInfo';
import SongRequests from './SongRequests';
import { AnimatePresence, motion } from 'framer-motion';

interface DJInfo {
  name: string;
  bio: string;
  website: string;
  instagramHandle: string;
  twitterHandle: string;
  venmoHandle: string;
  cashappHandle: string;
  qrCode: string;
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
  notification,
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

  const [isChatVisible, setIsChatVisible] = useState<boolean>(true);

  return (
    <div className="flex min-h-screen gap-4 bg-red-500">
      <motion.div
        className="flex-grow flex flex-col h-screen overflow-y-auto scrollbar-hide"
        animate={{ width: isChatVisible ? '75%' : '100%' }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <DJInfo
          djId={djId}
          djInfo={djInfo}
          djError={djError}
        />
        <SongRequests
          dancefloorId={dancefloorId}
          songRequest={songRequest}
          setSongRequest={setSongRequest}
          handleSendSongRequest={handleSendSongRequest}
          handleStopDancefloor={handleStopDancefloor}
          nowPlayingSong={nowPlayingSong}
          activeRequests={activeRequests}
          completedRequests={completedRequests}
          declinedRequests={declinedRequests}
          handlePlay={handlePlay}
          handleComplete={handleComplete}
          handleDecline={handleDecline}
          handleRequeue={handleRequeue}
          handleVote={handleVote}
          voteErrors={voteErrors}
          isLoadingRequests={isLoadingRequests}
          songRequestsError={songRequestsError}
          isChatVisible={isChatVisible}
          setIsChatVisible={setIsChatVisible}
        />
      </motion.div>

      {/* Chat Section */}
      <AnimatePresence>
        {isChatVisible && (
          <motion.div
            className="flex-shrink-0 flex-grow-0 w-[25%] flex flex-col h-screen overflow-y-auto"
            initial={{ width: 0 }}
            animate={{ width: '25%' }}
            exit={{ width: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Chat
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              messages={messages}
              messagesError={messagesError}
              isLoadingMessages={isLoadingMessages}
              setIsChatVisible={setIsChatVisible}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DJView;
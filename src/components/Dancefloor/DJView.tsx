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
  created_at: string;
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
    messageError: string | null;
    setMessageError: React.Dispatch<React.SetStateAction<string | null>>;
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
  messageError,
  setMessageError,
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

  const [isChatVisible, setIsChatVisible] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen bg-gray-800">
          {notification && (
        <div className="z-50 notification absolute top-0 right-0 left-0 justify-center flex items-center bg-orange-400 h-24 bg-opacity-75">
          {notification}
        </div>
      )}

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
              messageError={messageError}
              setMessageError={setMessageError}
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
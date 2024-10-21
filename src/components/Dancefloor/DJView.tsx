import { useState } from 'react';
import Chat from './Chat/Chat';
import DJInfo from './DJInfo';
import SongRequests from './SongRequests';
import { AnimatePresence, motion } from 'framer-motion';

interface DJInfo {
  id: string;
  name: string;
  bio: string;
  website: string;
  instagram_handle: string;
  twitter_handle: string;
  venmo_handle: string;
  cashapp_handle: string;
  qr_code: string;
  profile_pic_url: string;
}

interface SongRequest {
  id: string;
  song: string;
  likes: number;
  status: string;
}

interface Message {
  message: string;
  created_at: string;
}

interface Props {
  notification: string | null;
  isAuthenticated: boolean | null;
  djInfo: DJInfo | null;
  djInfoError: string | null;
  songRequest: string;
  setSongRequest: (value: string) => void;
  handleSendSongRequest: () => void;
  songRequestsError: string | null;
  nowPlayingSong: SongRequest | any | null;
  activeRequests: SongRequest[];
  completedRequests: SongRequest[];
  declinedRequests: SongRequest[];
  message: string;
  setMessage: (value: string) => void;
  messageError: string | null;
  setMessageError: React.Dispatch<React.SetStateAction<string | null>>;
  messages: Message[];
  messagesError: string | null;
  handleSendMessage: () => void;
  handleStopDancefloor: () => void;
  handleLike: (requestId: string) => void;
  likeErrors: { [key: string]: string | null };
  updateStatus: (requestId: string, status: 'queued' | 'playing' | 'completed' | 'declined') => Promise<void>;
}

const variants = {
  hidden: { y: '-100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 10 },
  },
  exit: {
    y: '-100%',
    opacity: 0,
    transition: { type: 'spring', stiffness: 80, damping: 12 },
  },
};


const DJView: React.FC<Props> = ({
  notification,
  isAuthenticated,
  djInfo,
  djInfoError,
  songRequest,
  setSongRequest,
  handleSendSongRequest,
  songRequestsError,
  nowPlayingSong,
  activeRequests,
  completedRequests,
  declinedRequests,
  message,
  setMessage,
  messageError,
  setMessageError,
  messages,
  messagesError,
  handleSendMessage,
  handleStopDancefloor,
  handleLike,
  likeErrors,
  updateStatus
}) => {

  const [isChatVisible, setIsChatVisible] = useState<boolean>(false);

  console.log("isAuthenticated", isAuthenticated)

  return (
    <div className="flex min-h-screen bg-gray-800">
      <AnimatePresence>
        {notification && (
          <motion.div
            className="z-50 fixed inset-x-0 top-16 mt-4 mx-auto bg-gradient-to-r from-teal-500/40 to-blue-500/40 backdrop-blur-md backdrop-brightness-75 text-white p-4 text-center rounded-lg shadow-lg"
            style={{ maxWidth: '22rem' }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            key="notification"
          >
            <p className='font-semibold text-xl'>{notification}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="flex-grow flex flex-col h-screen overflow-y-auto scrollbar-hide"
        animate={{ width: isChatVisible ? '75%' : '100%' }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <DJInfo
          djInfo={djInfo}
          djInfoError={djInfoError}
          handleStopDancefloor={handleStopDancefloor}
          songRequest={songRequest}
          setSongRequest={setSongRequest}
          handleSendSongRequest={handleSendSongRequest}
          isChatVisible={isChatVisible}
          setIsChatVisible={setIsChatVisible}
        />
        <SongRequests
          nowPlayingSong={nowPlayingSong}
          activeRequests={activeRequests}
          completedRequests={completedRequests}
          declinedRequests={declinedRequests}
          handleLike={handleLike}
          likeErrors={likeErrors}
          songRequestsError={songRequestsError}
          updateStatus={updateStatus}
          
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
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DJView;
import { useState } from 'react';
import Chat from './Chat/Chat';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import DJInfoComponent from './DJInfoComponent';
import SongRequests from './SongRequests';
import { AnimatePresence, motion } from 'framer-motion';
import { DJInfo } from '@/types/types';
import Notification from '../UI/Notification';

interface SongRequest {
  id: string;
  song: string;
  likes: number;
  status: string;
}

interface Message {
  dj_id: string | null;
  message: string;
  created_at: string;
}

interface Props {
  notificationMessage: string | null;
  isError: boolean;
  showNotification: boolean;
  onClose: () => void;
  dancefloorId: string;
  djInfo: DJInfo | null;
  djInfoError: string | null;
  songRequestsError: string | null;
  nowPlayingSong: SongRequest | null | undefined;
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
  handleLike: (requestId: string, dancefloorId: string) => void;
  likeErrors: { [key: string]: string | null };
  updateStatus: (requestId: string, status: 'queued' | 'playing' | 'completed' | 'declined') => Promise<void>;
}

const DJView: React.FC<Props> = ({
  notificationMessage,
  isError,
  showNotification,
  onClose,
  dancefloorId,
  djInfo,
  djInfoError,
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
  const [ isChatVisible, setIsChatVisible ] = useState<boolean>(false);
  const [ isStopDancefloorModalOpen, setIsStopDancefloorModalOpen ] = useState<boolean>(false);
  const [ isQRModalOpen, setIsQRModalOpen ] = useState<boolean>(false);

  const closeQRModal = () => {
    setIsQRModalOpen(false)
  }

  return (
    <div className="flex min-h-screen justify-center">
      <div className='gradient-background-variation backdrop-blur'></div>
        <Notification
          notificationMessage={notificationMessage}
          isError={isError}
          showNotification={showNotification}
          onClose={onClose}
        />
      <motion.div
        className="flex-grow flex flex-col h-screen overflow-y-auto scrollbar-hide"
        animate={{ width: isChatVisible ? '75%' : '100%' }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <DJInfoComponent
          djInfo={djInfo}
          djInfoError={djInfoError}
          isChatVisible={isChatVisible}
          setIsChatVisible={setIsChatVisible}
          setIsStopDancefloorModalOpen={setIsStopDancefloorModalOpen}
          setIsQRModalOpen={setIsQRModalOpen}
        />
        <SongRequests
          dancefloorId={dancefloorId}
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

      {/* confirm stop dancefloor modal */}
      <Modal isOpen={isStopDancefloorModalOpen} onClose={() => setIsStopDancefloorModalOpen(false)} >
        <div className='mr-8 w-full'>
          <p className='font-extrabold text-2xl '>Really stop this dancefloor?</p>
          <p className='font-semibold mb-4 mt-2 w-full text-center'>&#40;You can always reactivate it later.&#41;</p>
          <div className='flex flex-row items-center space-x-4 mt-2'>
            <Button bgColor='bg-red-400' padding='py-3' className='w-full text-lg' onClick={() => setIsStopDancefloorModalOpen(false)}>Cancel</Button>
            <Button padding='py-3' className='w-full text-lg' onClick={handleStopDancefloor}>Confirm</Button>
          </div>
        </div>
      </Modal>

      {/* QR code modal */}
      <Modal isOpen={isQRModalOpen} onClose={closeQRModal}>
        <div className="w-full pt-6 relative">
          <p className='absolute -top-3 left-0 text-lg font-bold'>Your QR Code</p>
          {djInfo?.qr_code && (
            <div className='w-full'>
              <img
                src={djInfo?.qr_code}
                alt="DJ QR Code"
                className="object-contain rounded-sm mb-4"
                style={{ width: '500px', height: '500px' }}
              />
              <Button padding='py-3' className='w-full text-lg'>
                <a
                  href={djInfo?.qr_code}
                  download="DJ-QR-Code.png"
                >
                  Save QR Code
                </a>
              </Button>
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
};

export default DJView;
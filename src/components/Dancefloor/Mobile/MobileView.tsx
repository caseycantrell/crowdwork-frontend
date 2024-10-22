import DJInfo from '../DJInfo';
import Button from '../../UI/Button';
import ChatMobile from './ChatMobile';
import SongRequestsMobile from './SongRequestsMobile';
import Image from 'next/image';
import { useRouter } from 'next/router';

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
  djInfo: DJInfo | null;
  songRequestsError: string | null;
  nowPlayingSong: SongRequest | null;
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
  handleLike: (requestId: string) => void;
  likeErrors: { [key: string]: string | null };
  dancefloorId: string | string[] | undefined; 
}

const MobileView: React.FC<Props> = ({
  djInfo,
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
  handleLike,
  likeErrors,
  dancefloorId,
}) => {

  const router = useRouter();

  return (
    <div>
      <div className="hidden lg:flex min-h-screen items-center justify-center bg-gray-900">
        <p className="text-white text-2xl font-semibold">
          Please view this on a mobile device.
        </p>
      </div>
      <div className="lg:hidden min-h-screen flex flex-col bg-gray-800 pt-2">
          <div className='flex flex-row items-center'>
            <div className='w-16 h-16 flex flex-col mx-2'>
                <Image
                    src={djInfo?.profile_pic_url || '/images/profile_placeholder.jpg'}
                    width={160}
                    height={160}
                    alt="Profile Pic"
                    className="object-cover w-full h-full rounded-sm"
                    priority
                  />
            </div>
            <div className='flex flex-col'>
            <p className="font-semibold">{djInfo?.name || 'No DJ name set.'}</p>
              {djInfo?.website && 
                <a
                  href={djInfo.website || ""}
                  className='font-semibold'
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {djInfo.website}
                </a>
              }
            </div>
          </div>

          <div className="grid grid-cols-2 mt-2 mx-2 font-semibold">
            {djInfo?.instagram_handle && <p>IG: {djInfo.instagram_handle}</p>}
            {djInfo?.twitter_handle && <p>Twitter: {djInfo.twitter_handle}</p>}
            {djInfo?.venmo_handle && <p>Venmo: {djInfo.venmo_handle}</p>}
            {djInfo?.cashapp_handle && <p>CashApp: {djInfo.cashapp_handle}</p>}
          </div>
          <div className='bg-gray-800 flex justify-center pt-2 pb-2'>
              <Button 
                className='w-full mx-2 bg-gradient-to-r from-emerald-400 to-cyan-500 py-3 rounded font-semibold'
                onClick={(e) => {
                  e.preventDefault();
                  void router.push(`/dancefloor/${dancefloorId}/request`);
                }}
              >
                Make a Song Request
              </Button>
          </div>
          <SongRequestsMobile
              songRequestsError={songRequestsError}
              nowPlayingSong={nowPlayingSong}
              activeRequests={activeRequests}
              completedRequests={completedRequests}
              declinedRequests={declinedRequests}
              handleLike={handleLike}
              likeErrors={likeErrors}
          />
          <ChatMobile
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              messages={messages}
              messageError={messageError}
              setMessageError={setMessageError}
              messagesError={messagesError}
          />
      </div>
    </div>
  );
};

export default MobileView;
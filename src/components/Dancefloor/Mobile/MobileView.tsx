import Button from '../../UI/Button';
import ChatMobile from './ChatMobile';
import SongRequestsMobile from './SongRequestsMobile';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { DJInfo } from '@/types/types';

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

  // handle the mobile browser height issue
  useEffect(() => {
    const handleResize = () => {
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`
      );
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className="hidden lg:flex min-h-screen items-center justify-center bg-gray-900">
        <p className="text-white text-2xl font-semibold">
          Please view this on a mobile device.
        </p>
      </div>

      <div className="lg:hidden h-screen overflow-hidden flex flex-col">
        <div className="flex-none h-1/4 bg-gray-800">
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-row items-center mt-5">
              <div className="w-16 h-16 flex flex-col mx-2">
                <Image
                  src={djInfo?.profile_pic_url || '/images/profile_placeholder.jpg'}
                  width={160}
                  height={160}
                  alt="Profile Pic"
                  className="object-cover w-full h-full rounded-sm"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold">{djInfo?.name || 'No DJ name set.'}</p>
                {djInfo?.website && (
                  <a
                    href={djInfo.website || ''}
                    className="font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {djInfo.website}
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 mt-1.5 gap-1.5 mx-2 font-semibold mb-1.5">
              <div className="flex flex-row items-center">
                <Image 
                  src={'/icons/instagram.png'} 
                  className="invert" 
                  width={24} 
                  height={24} 
                  alt="Instagram" 
                />
                {djInfo?.instagram_handle ? (
                  <a 
                    href={`https://www.instagram.com/${djInfo.instagram_handle.replace(/^@/, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-2 text-white truncate"
                    style={{ maxWidth: '155px' }}
                  >
                    {djInfo.instagram_handle}
                  </a>
                ) : (
                  <p className="ml-2 text-gray-400 text-xs italic">No IG info.</p>
                )}
              </div>
              <div className="flex flex-row items-center">
                <Image 
                  src={'/icons/twitter.png'} 
                  className="invert" 
                  width={24} 
                  height={24} 
                  alt="Twitter" 
                />
                {djInfo?.twitter_handle ? (
                  <a 
                    href={`https://x.com/${djInfo.twitter_handle.replace(/^@/, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-2 text-white truncate"
                    style={{ maxWidth: '155px' }}
                  >
                    {djInfo.twitter_handle}
                  </a>
                ) : (
                  <p className="ml-2 text-gray-400 text-xs italic">No Twitter info.</p>
                )}
              </div>
              <div className="flex flex-row items-center">
                <Image 
                  src={'/icons/venmo.png'} 
                  className="invert rounded-md" 
                  width={24} 
                  height={24} 
                  alt="Venmo" 
                />
                {djInfo?.venmo_handle ? (
                  <a 
                    href={`https://account.venmo.com/u/${djInfo.venmo_handle.replace(/^@/, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-2 text-white truncate"
                    style={{ maxWidth: '155px' }}
                  >
                    {djInfo.venmo_handle}
                  </a>
                ) : (
                  <p className="ml-2 text-gray-400 text-xs italic">No Venmo info.</p>
                )}
              </div>
              <div className="flex flex-row items-center">
                  <Image 
                    src={'/icons/cashapp.png'} 
                    width={24} 
                    height={24} 
                    alt="Cash App" 
                  />
                  {djInfo?.cashapp_handle ? (
                    <a 
                      href={`https://cash.app/${djInfo.cashapp_handle.replace(/^\$/, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="ml-2.5 text-white truncate"
                      style={{ maxWidth: '155px' }}
                    >
                      {djInfo.cashapp_handle}
                    </a>
                  ) : (
                    <p className="ml-2.5 text-gray-400 text-xs italic">No Cash App info.</p>
                  )}
              </div>
            </div>

            <div className="bg-gray-800 flex justify-center pb-2">
              <Button
                padding="py-4"
                fontWeight="font-semibold"
                className="w-full mx-2 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded"
                onClick={(e) => {
                  e.preventDefault();
                  void router.push(`/dancefloor/${dancefloorId}/request`);
                }}
              >
                Make a Song Request
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto bg-gray-800">
          <SongRequestsMobile
            songRequestsError={songRequestsError}
            nowPlayingSong={nowPlayingSong}
            activeRequests={activeRequests}
            completedRequests={completedRequests}
            declinedRequests={declinedRequests}
            handleLike={handleLike}
            likeErrors={likeErrors}
          />
        </div>

        <div className="flex-none h-1/4">
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
    </>
  );
};

export default MobileView;
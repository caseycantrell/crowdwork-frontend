import DJInfo from '../DJInfo';
import Button from '../../UI/Button';
import ChatMobile from './ChatMobile';
import SongRequestsMobile from './SongRequestsMobile';

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
  votes: number;
  status: string;
}

interface Message {
  message: string;
  created_at: string;
}

interface Props {
  isAuthenticated: boolean | null;
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
  handleVote: (requestId: string) => void;
  voteErrors: { [key: string]: string | null };
}

const MobileView: React.FC<Props> = ({
  isAuthenticated,
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
  handleVote,
  voteErrors
}) => {

  console.log("isAuthenticated", isAuthenticated)
  console.log("djInfo", djInfo)

  return (
    <div className="xl:hidden min-h-screen flex flex-col bg-gray-800">
        <div className='bg-red-500 p-2'>
            <p className='font-semibold'>DJ Info</p>
            <p className='font-semibold'>{djInfo && djInfo.name ? djInfo.name : 'casey butt'}</p>
            {djInfo && djInfo.website && <p>Website: {djInfo.website}</p>}
            {djInfo && djInfo.instagram_handle && <p>IG: {djInfo.instagram_handle}</p>}
            {djInfo && djInfo.twitter_handle && <p>Twitter: {djInfo.twitter_handle}</p>}
            {djInfo && djInfo.venmo_handle && <p>Venmo: {djInfo.venmo_handle}</p>}
            {djInfo && djInfo.cashapp_handle && <p>CashApp: {djInfo.cashapp_handle}</p>}
        </div>
        <div className='bg-gray-600 flex justify-center py-3'>
            <Button>Make a Song Request</Button>
        </div>
        <SongRequestsMobile
            songRequestsError={songRequestsError}
            nowPlayingSong={nowPlayingSong}
            activeRequests={activeRequests}
            completedRequests={completedRequests}
            declinedRequests={declinedRequests}
            handleVote={handleVote}
            voteErrors={voteErrors}
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
  );
};

export default MobileView;
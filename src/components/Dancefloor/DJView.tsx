import Chat from './Chat';
import DJInfo from './DJInfo';
import SongRequests from './SongRequests';

interface DJInfo {
  name: string;
  bio: string;
  website: string;
  instagramHandle: string;
  twitterHandle: string;
  venmoHandle: string;
  cashappHandle: string;
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
  return (
    <div className="min-h-screen bg-white">
        {notification && <div className="notification">{notification}</div>}
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-4 lg:grid-flow-col gap-4 bg-red-400">
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
            />
            <Chat
                message={message}
                setMessage={setMessage}
                handleSendMessage={handleSendMessage}
                messages={messages}
                messagesError={messagesError}
                isLoadingMessages={isLoadingMessages}
            />
        </div>
    </div>
  );
};

export default DJView;
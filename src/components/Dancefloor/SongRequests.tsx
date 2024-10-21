import ActiveRequest from './Requests/ActiveRequest';
import CompletedRequest from './Requests/CompletedRequest';
import NowPlaying from './Requests/NowPlaying';
import DeclinedRequest from './Requests/DeclinedRequest';

interface SongRequest {
  id: string;
  song: string;
  likes: number;
  status: string;
}

interface Props {
  songRequestsError: string | null;
  nowPlayingSong: SongRequest | null;
  activeRequests: SongRequest[];
  completedRequests: SongRequest[];
  declinedRequests: SongRequest[];
  handleLike: (requestId: string) => void;
  likeErrors: { [key: string]: string | null };
  updateStatus: (requestId: string, status: 'queued' | 'playing' | 'completed' | 'declined') => Promise<void>;
}

const SongRequests: React.FC<Props> = ({
  songRequestsError,
  nowPlayingSong,
  activeRequests,
  completedRequests,
  declinedRequests,
  handleLike,
  likeErrors,
  updateStatus
}) => {
  return (
    <div className="row-span-4 col-span-1 lg:col-span-3 bg-gray-800 pb-96">
       <p className='text-xl font-bold ml-4 py-1'>Now Playing</p>

      {nowPlayingSong ? (
        <div>  
          <NowPlaying id={nowPlayingSong.id} song={nowPlayingSong.song} likes={nowPlayingSong.likes} handleLike={handleLike} likeErrors={likeErrors} updateStatus={updateStatus}/>
        </div>
      ) : (
        <div className='pt-4 pb-8 ml-8'>  
          <p className='text-xl italic'>No song is currently set as playing.</p>
        </div>
      )}

      <div>
        {songRequestsError ? (
          <p style={{ color: 'red' }}>{songRequestsError}</p>
        ) : (
          <>
            <div>
            <p className='text-xl font-bold ml-4 py-1'>Active Requests</p>
              {activeRequests.length > 0 ? (
                activeRequests.map((request, index) => (
                  <div key={index}>
                    <ActiveRequest id={request.id} song={request.song} likes={request.likes} updateStatus={updateStatus} handleLike={handleLike} likeErrors={likeErrors} />
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
                    <CompletedRequest id={request.id} song={request.song} likes={request.likes} updateStatus={updateStatus} />
                    {/* <CompletedRequest id={request.id} song={request.song} likes={request.likes} handleLike={handleLike} likeErrors={likeErrors} handleRequeue={handleRequeue} /> */}
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
                    <DeclinedRequest id={request.id} song={request.song} likes={request.likes} updateStatus={updateStatus} />
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
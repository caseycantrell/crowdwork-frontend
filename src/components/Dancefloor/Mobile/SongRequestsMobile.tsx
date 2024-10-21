import Button from "../../UI/Button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
}

const SongRequestsMobile: React.FC<Props> = ({
  songRequestsError,
  nowPlayingSong,
  activeRequests,
  completedRequests,
  declinedRequests,
  handleLike,
  likeErrors,
}) => {    
  return (
    <div className="row-span-4 col-span-1 lg:col-span-3 bg-gray-900 h-72 overflow-y-scroll scrollbar-thin pb-0">
       <p className='text-sm font-bold ml-2 py-0.5'>Now Playing</p>

      {nowPlayingSong ? (
          <div className="bg-gradient-to-r from-amber-500 to-pink-500 flex flex-row items-center justify-between px-2 py-1">
          <div className="flex flex-col font-medium">
            <div className="flex flex-row items-center">
              <p className="text-sm"> Song: {nowPlayingSong.song}</p>
            </div>
            <div className="flex flex-row items-center">
              <p className="text-xs"> Likes: {nowPlayingSong.likes}</p>
              <AnimatePresence>
                {likeErrors[nowPlayingSong.id] && (
                  <motion.p
                    className="text-gray-800 text-xs ml-16 font-semibold"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{
                      type: 'tween',
                      duration: 0.3,
                      ease: 'easeInOut',
                    }}
                  >
                    {likeErrors[nowPlayingSong.id]}
                  </motion.p>
              )}
              </AnimatePresence>
            </div>
          </div>
            <Button bgColor="" onClick={() => handleLike(nowPlayingSong.id)}>
              <Image src={'/icons/like.png'} width={25} height={25} alt="Like" />
            </Button>
        </div>
      ) : (
        <div className='p-4 bg-gray-800'>  
          <p className='italic text-xs text-gray-500 text-center'>No song is currently set as playing.</p>
        </div>
      )}

      <div>
        {songRequestsError ? (
          <p style={{ color: 'red' }}>{songRequestsError}</p>
        ) : (
          <>
            <div>
            <p className='text-sm font-bold ml-2 py-0.5'>Active Requests</p>
              {activeRequests.length > 0 ? (
                activeRequests.map((request, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-600 to-fuchsia-600 flex flex-row items-center justify-between px-2 py-1">
                    <div className="flex flex-col font-medium">
                      <div className="flex flex-row items-center">
                        <p className="text-sm"> Song: {request.song}</p>
                      </div>
                      <div className="flex flex-row items-center">
                        <p className="text-xs"> Likes: {request.likes}</p>
                        <AnimatePresence>
                          {likeErrors[request.id] && (
                            <motion.p
                              className="text-gray-800 text-xs ml-16 font-semibold"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{
                                  type: 'tween',
                                  duration: 0.3,
                                  ease: 'easeInOut',
                              }}
                            >
                            {likeErrors[request.id]}
                            </motion.p>
                        )}
                        </AnimatePresence>
                      </div>
                    </div>
                      <Button bgColor="" onClick={() => handleLike(request.id)}>
                        <Image src={'/icons/like.png'} width={25} height={25} alt="Like" />
                      </Button>
                  </div>
                ))
              ) : (
                <div className='p-4'>  
                  <p className='italic text-xs text-gray-500 text-center'>No active requests.</p>
                </div>
              )}
            </div>
            <div>
              <p className='text-sm font-bold ml-2 py-0.5'>Completed Requests</p>
              {completedRequests.length > 0 ? (
                completedRequests.map((request, index) => (
                  <div key={index} className="bg-gradient-to-r from-indigo-400 to-cyan-400 flex flex-row items-center justify-between px-2 py-1">
                    <div className="flex flex-col font-medium">
                      <div className="flex flex-row items-center">
                        <p className="text-sm italic line-through"> Song: {request.song}</p>
                      </div>
                      <div className="flex flex-row items-center">
                        <p className="text-xs italic line-through"> Likes: {request.likes}</p>
                        <AnimatePresence>
                          {likeErrors[request.id] && (
                              <motion.p
                                  className="text-gray-800 text-xs ml-16 font-semibold"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{
                                      type: 'tween',
                                      duration: 0.3,
                                      ease: 'easeInOut',
                                  }}
                              >
                            {likeErrors[request.id]}
                            </motion.p>
                        )}
                        </AnimatePresence>
                      </div>
                    </div>
                      <Button bgColor="" onClick={() => handleLike(request.id)}>
                        <Image src={'/icons/like.png'} width={25} height={25} alt="Like" />
                      </Button>
                  </div>
                ))
              ) : (
                <div className='p-4 bg-gray-800'>  
                  <p className='italic text-xs text-gray-500 text-center'>No completed requests.</p>
                </div>
              )}
            </div>
            <div>
            <p className='text-sm font-bold ml-2 py-0.5'>Declined Requests</p>
            {declinedRequests.length > 0 ? (
                declinedRequests.map((request, index) => (
                  <div key={index} className="bg-gradient-to-r from-red-500 to-orange-500 flex flex-row items-center justify-between px-2 py-1">
                    <div className="flex flex-col font-medium">
                      <div className="flex flex-row items-center">
                        <p className="text-sm italic line-through"> Song: {request.song}</p>
                      </div>
                      <div className="flex flex-row items-center">
                        <p className="text-xs italic line-through"> Likes: {request.likes}</p>
                        <AnimatePresence>
                          {likeErrors[request.id] && (
                              <motion.p
                                className="text-gray-800 text-xs ml-16 font-semibold"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{
                                    type: 'tween',
                                    duration: 0.3,
                                    ease: 'easeInOut',
                                }}
                              >
                            {likeErrors[request.id]}
                            </motion.p>
                        )}
                        </AnimatePresence>
                      </div>
                    </div>
                      <Button bgColor="" onClick={() => handleLike(request.id)}>
                        <Image src={'/icons/like.png'} width={25} height={25} alt="Like" />
                      </Button>
                  </div>
                ))
              ) : (
                <div className='p-4 bg-gray-800'>  
                  <p className='italic text-xs text-gray-500 text-center'>No declined requests.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SongRequestsMobile;
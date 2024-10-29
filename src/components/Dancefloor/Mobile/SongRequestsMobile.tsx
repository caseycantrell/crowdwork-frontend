import Button from "../../UI/Button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface SongRequest {
  id: string;
  song: string;
  likes: number;
  status: string;
}

interface Props {
  songRequestsError: string | null;
  nowPlayingSong: SongRequest | null | undefined;
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
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState<number>(0);

  useEffect(() => {
    if (textRef.current && containerRef.current) {
      const textWidth = textRef.current.scrollWidth;
      const containerWidth = containerRef.current.clientWidth;
      const distance = textWidth > containerWidth ? textWidth - containerWidth : 0;
      setScrollDistance(distance);
    }
  }, [nowPlayingSong?.song]);

  return (
    <div className="bg-gray-900 overflow-y-scroll scrollbar-thin pb-0">
       <p className='text-sm font-bold ml-2 py-'>Now Playing</p>
       {nowPlayingSong ? (
          <div className="animated-rainbow flex items-center justify-between px-2 py-4">
            <div className="flex flex-col max-w-[88%] font-medium">
              <div className="flex items-center">
                <div
                  ref={containerRef}
                  className="relative overflow-hidden ml-1"
                  style={{ maxWidth: "calc(100%)" }}
                >
                  <motion.div
                    ref={textRef}
                    className="inline-block whitespace-nowrap"
                    initial={{ x: 0 }}
                    animate={{
                      x: scrollDistance ? [0, -scrollDistance - 50, 0] : 0,
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "linear",
                      repeatDelay: 2,
                    }}
                  >
                    <p className="text-md font-semibold">{nowPlayingSong.song}</p>
                  </motion.div>
                </div>
              </div>

              <div className="flex items-center mt-0">
                <p className="text-sm font-semibold ml-1">Likes: {nowPlayingSong.likes}</p>
                <AnimatePresence>
                  {likeErrors[nowPlayingSong.id] && (
                    <motion.p
                      className="text-gray-800 text-xs ml-16 font-semibold"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{
                        type: "tween",
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                    >
                      {likeErrors[nowPlayingSong.id]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <Button bgColor="" padding="" className="mr-1.5" onClick={() => handleLike(nowPlayingSong.id)}>
              <Image src={"/icons/like.png"} width={25} height={25} alt="Like" />
            </Button>
          </div>
        ) : (
          <div className="p-4 bg-gray-800">
            <p className="italic text-xs text-gray-500 text-center">
              No song is currently set as playing.
            </p>
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
                    <div className="flex flex-col max-w-[90%]">
                      <div className="flex flex-row items-center">
                        <p className="font-bold mr-1.5 text-sm">Song:</p>
                        <p className="font-semibold text-xs truncate">{request.song}</p>
                      </div>
                      <div className="flex flex-row items-center text-xs ">
                        <p className="font-bold mr-1.5">Likes:</p>
                        <p className="font-semibold">{request.likes}</p>
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
                      <Button bgColor="" padding="" className="mr-1.5" onClick={() => handleLike(request.id)}>
                        <Image src={'/icons/like.png'} width={25} height={25} alt="Like" />
                      </Button>
                  </div>
                ))
              ) : (
                <div className='p-4 bg-gray-800'>  
                  <p className='italic text-xs text-gray-500 text-center'>No active requests.</p>
                </div>
              )}
            </div>
            <div>
              <p className='text-sm font-bold ml-2 py-0.5'>Completed Requests</p>
              {completedRequests.length > 0 ? (
                completedRequests.map((request, index) => (
                  <div key={index} className="bg-gradient-to-r from-indigo-400 to-cyan-400 flex flex-row items-center justify-between px-2 py-1">
                    <div className="flex flex-col max-w-[90%] font-medium">
                      <div className="flex flex-row items-center">
                        <p className="text-sm italic line-through truncate"> Song: {request.song}</p>
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
                      <Button bgColor="" padding="" className="mr-1.5" onClick={() => handleLike(request.id)}>
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
                    <div className="flex flex-col max-w-[90%] font-medium">
                      <div className="flex flex-row items-center">
                        <p className="text-sm italic line-through truncate"> Song: {request.song}</p>
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
                      <Button bgColor="" padding="" className="mr-1.5" onClick={() => handleLike(request.id)}>
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
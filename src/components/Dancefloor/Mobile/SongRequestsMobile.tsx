import Button from "../../UI/Button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { likeIcon } from "@/icons";

interface SongRequest {
  id: string;
  song: string;
  likes: number;
  status: string;
}

interface Props {
  dancefloorId: string;
  songRequestsError: string | null;
  nowPlayingSong: SongRequest | null | undefined;
  activeRequests: SongRequest[];
  completedRequests: SongRequest[];
  declinedRequests: SongRequest[];
  handleLike: (requestId: string, dancefloorId: string) => void;
  likeErrors: { [key: string]: string | null };
}

const SongRequestsMobile: React.FC<Props> = ({
  dancefloorId,
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

  const dotVariants = {
    animate: (i: number) => ({
      scale: [0, 1, 0],
      opacity: [0.3, 1, 0.3],
      transition: {
        delay: i * 0.25,
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className="overflow-y-scroll scrollbar-hide pb-0">
       <p className='text-xs font-bold pl-2 py-1 bg-gray-900'>Now Playing</p>
       {nowPlayingSong ? (
          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex flex-row items-center min-w-0">
              <svg
                  className="h-12 w-12"
                  viewBox="0 0 40 40"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.rect
                    x="4"
                    y="10"
                    width="6"
                    height="20"
                    rx="3"
                    animate={{ scaleY: [1, 1.4, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      ease: "easeInOut",
                      delay: 0,
                    }}
                    style={{ originY: "center" }}
                  />
                  <motion.rect
                    x="16"
                    y="5"
                    width="6"
                    height="30"
                    rx="3"
                    animate={{ scaleY: [1, 1.2, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      ease: "easeInOut",
                      delay: 0.3,
                    }}
                    style={{ originY: "center" }}
                  />
                  <motion.rect
                    x="28"
                    y="10"
                    width="6"
                    height="20"
                    rx="3"
                    animate={{ scaleY: [1, 1.4, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      ease: "easeInOut",
                      delay: 0,
                    }}
                    style={{ originY: "center" }}
                  />
              </svg>
              <div className="flex flex-col max-w-[82%] font-medium ml-2">
                <div className="flex items-center">
                  <div
                    ref={containerRef}
                    className="relative overflow-hidden"
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
                      <div className="flex flex-row items-center">
                        <p className="font-bold mr-1.5 text-lg">Song:</p>
                        <p className="font-semibold text-lg truncate">{nowPlayingSong.song}</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
      
                <div className="flex flex-row items-center relative">
                  <p className="text-md font-semibold ml-0.5 text-gray-300">Likes: {nowPlayingSong.likes}</p>
                  <AnimatePresence>
                    {likeErrors[nowPlayingSong.id] && (
                      <motion.p
                        className="text-gray-800 text-xs font-semibold absolute right-0 top-1.5"
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
            </div>
      
            <Button
              ariaLabel="Like Request"
              bgColor=""
              padding=""
              className="flex-shrink-0 px-2"
              onClick={() => handleLike(nowPlayingSong.id, dancefloorId)}
            >
              <Image src={likeIcon} width={22} height={22} alt="Like" />
            </Button>
          </div>
        ) : (
          <div className="p-4">
            <p className="italic text-xs font-semibold text-gray-300 text-center">
              No song is currently set as playing.
            </p>
          </div>
        )}
      <div>
        {songRequestsError ? (
          <p style={{ color: 'red' }}>{songRequestsError}</p>
        ) : (
          <>
            <div className="">  
              <p className='text-xs font-bold pl-2 py-1 bg-gray-900 w-full'>Active Requests</p>
              {activeRequests.length > 0 ? (
                activeRequests.map((request, index) => (
                  <div
                    key={index}
                    className={`bg-gray-700 backdrop-filter backdrop-blur-lg bg-opacity-30 border-gray-800/80 flex flex-row items-center justify-between pr-2 py-1 ${
                      index === 0 ? "" : "border-t-[0.5px]"
                    } ${
                      index !== declinedRequests.length - 1 ? "border-b-[0.5px]" : ""
                    }`}
                  >
                    <div className="flex flex-row items-center min-w-0">
                      <div className="flex flex-row items-center mx-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-white/80 rounded-full"
                          custom={i}
                          variants={dotVariants}
                          animate="animate"
                        />
                      ))}
                      </div>
                      <div className="flex flex-col max-w-[88%]">
                        <div className="flex flex-row items-center">
                          <p className="font-bold mr-1.5 text-sm">Song:</p>
                          <p className="font-semibold text-xs truncate">{request.song}</p>
                        </div>
                        <div className="flex flex-row items-center text-xs text-gray-300 relative">
                          <p className="font-bold mr-1.5">Likes:</p>
                          <p className="font-semibold">{request.likes}</p>
                          <AnimatePresence>
                            {likeErrors[request.id] && (
                              <motion.p
                                className="text-gray-800 text-xs font-semibold absolute left-24 top-0 whitespace-nowrap"
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
                    </div>
                      <Image src={likeIcon} width={22} height={22} alt="Like" className="cursor-pointer mr-1.5" onClick={() => handleLike(request.id, dancefloorId)} />
                  </div>
                ))
              ) : (
                <div className='p-4'>  
                  <p className='italic text-xs font-semibold text-gray-300 text-center'>No active requests.</p>
                </div>
              )}
            </div>
            <div>
              <p className='text-xs font-bold pl-2 bg-gray-900 py-1'>Completed Requests</p>
              {completedRequests.length > 0 ? (
                completedRequests.map((request, index) => (
                  <div 
                    key={index}
                    className={`bg-gray-700 backdrop-filter backdrop-blur-lg bg-opacity-30 border-gray-800/80 flex flex-row items-center justify-between pr-2 py-1 ${
                      index === 0 ? "" : "border-t-[0.5px]"} ${index !== completedRequests.length - 1 ? "border-b-[0.5px]" : ""}`}>
                    <div className="flex flex-row items-center min-w-0">
                      <svg
                        className="text-success/80 h-6 w-6 mx-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    <div className="flex flex-col max-w-[88%] font-medium">
                      <div className="flex flex-row items-center">
                        <p className="text-sm italic line-through truncate"> Song: {request.song}</p>
                      </div>
                      <div className="flex flex-row items-center text-gray-300 relative">
                        <p className="text-xs italic line-through"> Likes: {request.likes}</p>
                        <AnimatePresence>
                          {likeErrors[request.id] && (
                              <motion.p
                                  className="text-gray-800 text-xs font-semibold absolute left-24 top-0 whitespace-nowrap"
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
                    </div>
                      <Image src={likeIcon} width={22} height={22} alt="Like" className="cursor-pointer mr-1.5" onClick={() => handleLike(request.id, dancefloorId)}/>
                  </div>
                ))
              ) : (
                <div className='p-4'>  
                  <p className='italic text-xs font-semibold text-gray-300 text-center'>No completed requests.</p>
                </div>
              )}
            </div>
            <div>
            <p className='text-xs font-bold pl-2 bg-gray-900 py-1'>Declined Requests</p>
              {declinedRequests.length > 0 ? (
                declinedRequests.map((request, index) => (
                  <div key={index} className={`bg-gray-700 backdrop-filter backdrop-blur-lg bg-opacity-30 border-gray-800/80 flex flex-row items-center justify-between pr-2 py-1 ${
                    (declinedRequests.length <= 3 || index !== declinedRequests.length - 1) && "border-b-[0.25px]"}`}>
                    <div className="flex flex-row items-center min-w-0">
                      <svg    
                        className="text-error/70 h-6 w-6 mx-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 18L18 6M18 18L6 6" />
                      </svg>
                    <div className="flex flex-col max-w-[88%] font-medium">
                      <div className="flex flex-row items-center">
                        <p className="text-sm italic line-through truncate"> Song: {request.song}</p>
                      </div>
                      <div className="flex flex-row items-center text-gray-300 relative">
                        <p className="text-xs italic line-through"> Likes: {request.likes}</p>
                        <AnimatePresence>
                          {likeErrors[request.id] && (
                              <motion.p
                                className="text-gray-800 text-xs font-semibold absolute left-24 top-0 whitespace-nowrap"
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
                    </div>
                      <Image src={likeIcon} width={22} height={22} alt="Like" className="cursor-pointer mr-1.5" onClick={() => handleLike(request.id, dancefloorId)} />
                  </div>
                ))
              ) : (
                <div className='p-4'>  
                  <p className='italic text-xs font-semibold text-gray-300 text-center'>No declined requests.</p>
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
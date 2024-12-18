import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { playIcon, declineIcon, likeIconAlt } from '@/icons';

interface Props {
    id: string;
    dancefloorId: string;
    song: string;
    likes: number | 0;
    handleLike: (requestId: string, dancefloorId: string) => void;
    likeErrors: { [key: string]: string | null };
    updateStatus: (requestId: string, status: 'queued' | 'playing' | 'completed' | 'declined') => Promise<void>;
}

const ActiveRequest: React.FC<Props> = ({
    id,
    dancefloorId,
    song,
    likes,
    handleLike,
    likeErrors,
    updateStatus
}) => {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);

    const handleMouseEnter = (button: string) => {
        setHoveredButton(button);
        setTimeout(() => setHoveredButton(null), 1500);
    };

    const getHoverMessage = () => {
        switch (hoveredButton) {
            case 'play':
                return 'Set as Now Playing';
            case 'decline':
                return 'Decline';
            case 'like':
                return 'Like';
            default:
                return '';
        }
    };

    const displayMessage = likeErrors[id] || getHoverMessage();

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
    
    <div className="flex flex-row items-center justify-between bg-gray-700/50 border-b-[1.5px] border-black/30 py-2 relative">
        <div className='flex flex-row items-center min-w-0'>
            <div className="flex flex-row items-center mx-3.5">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-3 h-3 bg-white/80 rounded-full"
                        custom={i}
                        variants={dotVariants}
                        animate="animate"
                    />
                ))}
            </div>
            <div className="flex flex-col space-y-1 py-1 min-w-0 font-semibold">
                <div className="flex items-center min-w-0">
                    <p className="text-lg truncate overflow-hidden text-ellipsis min-w-0">
                        <strong>Song:</strong> {song}
                    </p>
                </div>
                <p className="text-md text-gray-300">Likes: {likes}</p>
            </div>
        </div>
    
        <div className="flex flex-row items-center gap-x-12 mr-16 ml-2 opacity-90">
            <AnimatePresence>
                {displayMessage && (
                    <motion.p
                        className={`font-bold text-lg text-white/80 ${likeErrors[id] && 'italic text-gray-200'}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{
                            type: 'tween',
                            duration: 0.5,
                            ease: 'easeInOut',
                        }}
                    >
                        {displayMessage}
                    </motion.p>
                )}
            </AnimatePresence>
    
            <div style={{ width: 30, height: 30 }}>
                <button
                    className="overflow-visible"
                    onClick={() => updateStatus(id, 'playing')}
                    onMouseEnter={() => handleMouseEnter('play')}
                    aria-label='Set as Now Playing'
                >
                    <Image
                        src={playIcon}
                        height={50}
                        width={50}
                        alt="Play Icon"
                        className='invert'
                    />
                </button>
            </div>
            <div style={{ width: 30, height: 30 }}>
                <button
                    className="overflow-visible"
                    onClick={() => updateStatus(id, 'declined')}
                    onMouseEnter={() => handleMouseEnter('decline')}
                    aria-label='Decline Request'
                >
                    <Image
                        src={declineIcon}
                        height={50}
                        width={50}
                        alt="Decline Icon"
                        className='invert'
                    />
                </button>
            </div>
            <div style={{ width: 30, height: 30 }}>
                <button
                    className="overflow-visible"
                    onClick={() => handleLike(id, dancefloorId)}
                    onMouseEnter={() => handleMouseEnter('like')}
                    aria-label='Like Request'
                >
                    <Image
                        src={likeIconAlt}
                        height={50}
                        width={50}
                        alt="Like Icon"
                        className='invert'
                    />
                </button>
            </div>
        </div>
     </div>
     
    );
};

export default ActiveRequest;
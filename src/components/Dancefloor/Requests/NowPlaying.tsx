import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { requeueIcon, completeIcon, likeIconAlt } from '@/icons';

interface Props {
    id: string;
    dancefloorId: string;
    song: string;
    likes: number | 0;
    handleLike: (requestId: string, dancefloorId: string) => void;
    likeErrors: { [key: string]: string | null };
    updateStatus: (requestId: string, status: 'queued' | 'playing' | 'completed' | 'declined') => Promise<void>;
}

const NowPlaying: React.FC<Props> = ({
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
            case 'requeue':
                return 'Requeue';
            case 'like':
                return 'Like';
            case 'complete':
                return 'Mark as Complete';
            default:
                return '';
        }
    };

    const displayMessage = likeErrors[id] || getHoverMessage();

    const barVariants = {
        animate: (i: number) => ({
          scaleY: [1, 1.5, 1],
          originY: 1,
          transition: {
            repeat: Infinity,
            duration: 0.6 + i * 0.1,
            ease: "easeInOut",
          },
        }),
      };

    return (
        <div className="flex flex-row items-center justify-between bg-gray-700 backdrop-filter backdrop-blur-lg bg-opacity-30 py-8 relative">
            <div className='flex flex-row items-center min-w-0'>
                <div className='mx-4'>
                    <svg
                        className="h-32 w-32"
                        viewBox="0 0 36 32"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        {Array.from({ length: 10 }).map((_, i) => (
                            <motion.rect
                            key={i}
                            x={2 + i * 3}
                            y="16"
                            width="2"
                            height="10"
                            rx="1"
                            variants={barVariants}
                            custom={i}
                            initial="animate"
                            animate="animate"
                            />
                        ))}
                    </svg>
                </div>
                <div className="flex flex-col space-y-1 py-1 min-w-0 font-semibold">
                    <div className="flex items-center min-w-0">
                        <p className="text-3xl truncate overflow-hidden text-ellipsis min-w-0">
                            <strong>Song:</strong> {song}
                        </p>
                    </div>
                    <p className="text-xl text-gray-300">Likes: {likes}</p>
                </div>
            </div>
            <div className="flex flex-row items-center gap-x-12 mr-16">
                <AnimatePresence>
                    {displayMessage && (
                        <motion.p
                            className={`font-bold text-white/80 text-lg ${likeErrors[id] && 'italic text-gray-200'}`}
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
                        aria-label='Requeue Request'
                        className="overflow-visible"
                        onClick={() => updateStatus(id, 'queued')}
                        onMouseEnter={() => handleMouseEnter('requeue')}
                    >
                        <Image
                            src={requeueIcon}
                            height={50}
                            width={50}
                            className='invert opacity-90'
                            alt="Requeue Icon"
                        />
                    </button>
                </div>
                <div style={{ width: 30, height: 30 }}>
                    <button
                        aria-label='Mark As Completed'
                        className="overflow-visible" 
                        onClick={() => updateStatus(id, 'completed')}
                        onMouseEnter={() => handleMouseEnter('complete')}
                    >
                        <Image
                            src={completeIcon}
                            height={50}
                            width={50}
                            className='invert opacity-90'
                            alt="Complete Icon"
                        />
                    </button>
                </div>
                <div style={{ width: 30, height: 30 }}>
                    <button
                        aria-label='Like Request'
                        className="overflow-visible"
                        onClick={() => handleLike(id, dancefloorId)}
                        onMouseEnter={() => handleMouseEnter('like')}
                    >
                        <Image
                            src={likeIconAlt}
                            height={50}
                            width={50}
                            className='invert opacity-90'
                            alt="Like Icon"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NowPlaying;
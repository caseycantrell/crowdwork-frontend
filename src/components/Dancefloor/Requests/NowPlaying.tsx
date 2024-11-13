import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

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

    return (
        <div className="animated-rainbow fast-rainbow border border-black px-4 py-12 relative">
            <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-2 min-w-0">
                    <div className="flex items-baseline min-w-0">
                        <p className="font-bold text-3xl mr-1 whitespace-nowrap">Current Track:</p>
                        <p className="font-semibold text-2xl text-gray-200 truncate overflow-hidden text-ellipsis min-w-0">
                            {song}
                        </p>
                    </div>
                    <div className="flex items-center text-xl font-semibold">
                        Likes: {likes}
                    </div>
                </div>
                <div className="flex flex-row items-center gap-x-12 mr-12">
                    <AnimatePresence>
                        {displayMessage && (
                            <motion.p
                                className={`font-bold text-lg ${likeErrors[id] && 'italic text-gray-800'}`}
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
                                src={'/icons/requeue2.png'}
                                height={50}
                                width={50}
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
                                src={'/icons/complete.png'}
                                height={50}
                                width={50}
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
                                src={'/icons/like2.png'}
                                height={50}
                                width={50}
                                alt="Like Icon"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NowPlaying;
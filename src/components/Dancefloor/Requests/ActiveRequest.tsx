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

    return (
        <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 border border-black px-4 py-2 relative">
            <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-2 min-w-0">
                    <div className="flex items-center min-w-0">
                        <p className="font-bold text-2xl mr-1 whitespace-nowrap">Song:</p>
                        <p className="font-semibold text-xl text-gray-200 truncate overflow-hidden text-ellipsis min-w-0">
                            {song}
                        </p>
                    </div>
                    <div className="flex items-center">
                        Likes: {likes}
                    </div>
                </div>
                <div className="flex flex-row items-center gap-x-12 mr-12 ml-2">
                    <AnimatePresence>
                        {displayMessage && (
                            <motion.p
                                className={`font-semibold text-lg ${likeErrors[id] && 'italic text-gray-800'}`}
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
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveRequest;
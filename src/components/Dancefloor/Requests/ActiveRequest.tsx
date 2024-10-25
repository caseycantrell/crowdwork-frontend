import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../UI/Button';

interface Props {
    id: string;
    song: string;
    likes: number | 0;
    handleLike: (requestId: string) => void;
    likeErrors: { [key: string]: string | null };
    updateStatus: (requestId: string, status: 'queued' | 'playing' | 'completed' | 'declined') => Promise<void>;
}

const ActiveRequest: React.FC<Props> = ({
    id,
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
            <div className="flex flex-row items-center justify-between">
                <div>
                    <div className="flex flex-row items-center">
                        <p className="font-bold text-2xl mr-1">Song:</p>
                        <p className="font-semibold text-xl ml-1 text-gray-200">{song}</p>
                    </div>
                    <div className='flex flex-row items-center'> 
                        Likes: {likes}
                    </div>
                </div>

                <div className="flex flex-row items-center gap-x-12 mr-12">
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
                        <Button
                            padding=""
                            bgColor=""
                            className="overflow-visible"
                            onClick={() => updateStatus(id, 'playing')}
                            onMouseEnter={() => handleMouseEnter('play')}
                        >
                            <Image
                                src={'/icons/play.png'}
                                height={50}
                                width={50}
                                alt="Play Icon"
                            />
                        </Button>
                    </div>
                    <div style={{ width: 30, height: 30 }}>
                        <Button
                            padding=""
                            bgColor=""
                            className="overflow-visible"
                            onClick={() => updateStatus(id, 'declined')}
                            onMouseEnter={() => handleMouseEnter('decline')}
                        >
                            <Image
                                src={'/icons/decline.png'}
                                height={50}
                                width={50}
                                alt="Decline Icon"
                            />
                        </Button>
                    </div>
                    <div style={{ width: 30, height: 30 }}>
                        <Button
                            padding=""
                            bgColor=""
                            className="overflow-visible"
                            onClick={() => handleLike(id)}
                            onMouseEnter={() => handleMouseEnter('like')}
                        >
                            <Image
                                src={'/icons/like2.png'}
                                height={50}
                                width={50}
                                alt="Like Icon"
                            />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveRequest;
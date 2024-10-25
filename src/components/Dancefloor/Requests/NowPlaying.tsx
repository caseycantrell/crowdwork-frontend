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

const NowPlaying: React.FC<Props> = ({
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

    // Determine the text to display based on error or hover state
    const displayMessage = likeErrors[id] || getHoverMessage();

    return (
        <div className="animated-rainbow fast-rainbow border border-black px-4 py-6 relative">
            <div className="flex flex-row items-center justify-between">
                <div className='space-y-2'>
                    <div className="flex flex-row items-center">
                        <p className="font-bold text-2xl mr-1">Current Track:</p>
                        <p className="text-xl font-semibold ml-1">{song}</p>
                    </div>
                    <div>Likes: {likes}</div>
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
                        <Button
                            padding=""
                            bgColor=""
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
                        </Button>
                    </div>
                    <div style={{ width: 30, height: 30 }}>
                        <Button
                            padding=""
                            bgColor=""
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

export default NowPlaying;

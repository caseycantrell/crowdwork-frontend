import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../UI/Button';

interface Props {
    id: string;
    song: string;
    votes: number | 0;
    handleDecline: (requestId: string) => void;
    handlePlay: (requestId: string) => void;
    handleVote: (requestId: string) => void;
    voteErrors: { [key: string]: string | null };
}

const ActiveRequest: React.FC<Props> = ({
    id,
    song,
    votes,
    handleDecline,
    handlePlay,
    handleVote,
    voteErrors,
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
            case 'vote':
                return 'Vote';
            default:
                return '';
        }
    };

    return (
        <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 border border-black px-4 py-3 relative">
            <div className="flex flex-row items-center justify-between">
                <div>
                    <div className="flex flex-row items-center text-xs">
                        <p className="mr-0.5">Request</p>
                        <p className="ml-1">{id}</p>
                    </div>
                    <div className="flex flex-row items-center">
                        <p className="font-bold text-2xl mr-1">Song:</p>
                        <p className="text-xl ml-1">{song}</p>
                    </div>
                    <div>Votes: {votes}</div>
                </div>

                <div className="flex flex-row items-center gap-x-4 mr-64">
                    <AnimatePresence>
                    {hoveredButton && (
                        <motion.p
                            className="text-white font-semibold mr-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{
                                type: 'tween',
                                duration: 0.5,
                                ease: 'easeInOut',
                            }}
                        >
                            {getHoverMessage()}
                        </motion.p>
                    )}
                    </AnimatePresence>

                    <div style={{ width: 30, height: 30 }}>
                        <Button
                            padding=""
                            bgColor=""
                            className="overflow-visible"
                            onClick={() => handlePlay(id)}
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
                            onClick={() => handleDecline(id)}
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
                            onClick={() => handleVote(id)}
                            onMouseEnter={() => handleMouseEnter('vote')}
                        >
                            <Image
                                src={'/icons/vote.png'}
                                height={50}
                                width={50}
                                alt="Vote Icon"
                            />
                        </Button>
                    </div>
                </div>
            </div>

            {voteErrors[id] && <p style={{ color: 'red' }}>{voteErrors[id]}</p>}
        </div>
    );
};

export default ActiveRequest;
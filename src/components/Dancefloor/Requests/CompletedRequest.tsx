import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { requeueIcon } from '@/icons';

interface Props {
    id: string;
    song: string;
    likes: number | 0;
    updateStatus: (requestId: string, status: 'queued' | 'playing' | 'completed' | 'declined') => Promise<void>;
}

const CompletedRequest: React.FC<Props> = ({
    id,
    song,
    likes,
    updateStatus,
}) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        setTimeout(() => setIsHovered(false), 1500);
    };

    return (
        <div className="flex flex-row items-center justify-between bg-gray-700 backdrop-filter backdrop-blur-lg bg-opacity-30 border border-black py-2 relative">
            <div className='flex flex-row items-center min-w-0'>
                <div className='mx-4'>
                    <svg
                        className="text-success/80 h-8 w-8 mb-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="flex flex-col space-y-1 py-1 min-w-0 text-gray-400 font-semibold italic line-through">
                    <div className="flex items-center min-w-0">
                        <p className="text-lg truncate overflow-hidden text-ellipsis min-w-0">
                            <strong>Song:</strong> {song}
                        </p>
                    </div>
                    <p className="text-md"> Likes: {likes}</p>
                </div>
            </div>
            <div className="flex flex-row items-center gap-x-12 mr-16 ml-2">
                <AnimatePresence>
                    {isHovered && (
                        <motion.p
                            className="text-white font-bold text-lg"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{
                                type: 'tween',
                                duration: 0.5,
                                ease: 'easeInOut',
                            }}
                        >
                            Requeue
                        </motion.p>
                    )}
                </AnimatePresence>
                <div style={{ width: 30, height: 30 }}>
                    <button
                        className="overflow-visible"
                        onClick={() => updateStatus(id, "queued")}
                        onMouseEnter={handleMouseEnter}
                        aria-label='Requeue Request'
                    >
                        <Image
                            src={requeueIcon}
                            height={50}
                            width={50}
                            alt="Requeue Icon"
                            className='invert'
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompletedRequest;
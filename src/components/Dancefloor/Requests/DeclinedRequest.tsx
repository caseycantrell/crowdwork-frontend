import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../UI/Button';

interface Props {
    id: string;
    song: string;
    likes: number | 0;
    updateStatus: (requestId: string, status: 'queued' | 'playing' | 'completed' | 'declined') => Promise<void>;
}

const DeclinedRequest: React.FC<Props> = ({
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
        <div className="bg-gradient-to-r from-red-500 to-orange-500 border border-black px-4 py-2 relative">
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col space-y-2 min-w-0 italic line-through">
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
                            onClick={() => updateStatus(id, 'queued')}
                            onMouseEnter={handleMouseEnter}
                        >
                            <Image
                                src={'/icons/requeue2.png'}
                                height={40}
                                width={50}
                                alt="Requeue Icon"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeclinedRequest;
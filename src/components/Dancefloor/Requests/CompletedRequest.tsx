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
        <div className="bg-gradient-to-r from-indigo-400 to-cyan-400 border border-black px-4 py-2 relative">
            <div className="flex flex-row items-center justify-between">
                <div className='italic line-through'>
                    <div className="flex flex-row items-center">
                        <p className="font-bold text-2xl mr-1">Song:</p>
                        <p className="text-xl ml-1">{song}</p>
                    </div>
                    <div>Likes: {likes}</div>
                </div>

                <div className="flex flex-row items-center gap-x-4 mr-64">
                    <AnimatePresence>
                        {isHovered && (
                            <motion.p
                                className="text-white font-bold mr-2"
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
                        <Button
                            padding=""
                            bgColor=""
                            className="overflow-visible"
                            onClick={() => updateStatus(id, "queued")}
                            onMouseEnter={handleMouseEnter}
                        >
                            <Image
                                src={'/icons/requeue.png'}
                                height={50}
                                width={50}
                                alt="Requeue Icon"
                            />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompletedRequest;
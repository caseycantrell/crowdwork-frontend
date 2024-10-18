import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    id: string;
    song: string;
    votes: number | 0;
    handleRequeue: (requestId: string) => void;
    voteErrors: { [key: string]: string | null };
}

const CompletedRequest: React.FC<Props> = ({
    id,
    song,
    votes,
    handleRequeue,
    voteErrors,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        setTimeout(() => setIsHovered(false), 1500);
    };

    return (
        <div className="bg-gradient-to-r from-indigo-400 to-cyan-400 border border-black p-4 relative">
            <div className="flex flex-row items-center justify-between">
                <div className='italic line-through'>
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
                        {isHovered && (
                            <motion.p
                                className="text-gray-300 font-bold mr-2"
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
                            onClick={() => handleRequeue(id)}
                            onMouseEnter={handleMouseEnter}
                        >
                            <Image
                                src={'/icons/requeue.png'}
                                height={50}
                                width={50}
                                alt="Requeue Icon"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {voteErrors[id] && <p style={{ color: 'red' }}>{voteErrors[id]}</p>}
        </div>
    );
};

export default CompletedRequest;

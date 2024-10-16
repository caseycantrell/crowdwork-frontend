import React from 'react'
import Image from 'next/image';
import { motion } from 'framer-motion'

interface Props {
    id: string;
    song: string;
    votes: number | 0;
    handleDecline: (requestId: string) => void;
    handlePlay: (requestId: string) => void;
    handleVote: (requestId: string) => void;
    voteErrors: { [key: string]: string | null };
  }

const ActiveRequest: React.FC<Props> = ({ id, song, votes, handleDecline, handlePlay, handleVote, voteErrors }) => {
  return (
    <motion.div className='bg-gradient-to-r from-fuchsia-600 to-purple-600 border border-black px-4 py-2'>
        <div className='flex flex-row items-center justify-between'>
            <div>
                <div className='flex flex-row items-center text-xs'>
                    <p className='mr-0.5'>Request</p>        
                    <p className='ml-1'>{id}</p>        
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold text-2xl mr-1'>Song:</p>        
                    <p className='text-xl ml-1'>{song}</p>        
                </div>
                <div>Votes: {votes}</div>
            </div>
            <div className='flex flex-row items-center mr-64 gap-x-8'>
                <div style={{ width: 30, height: 30 }}>
                    <button className='overflow-visible' onClick={() => handlePlay(id)}><Image src={'/icons/play.png'} height={50} width={50} alt="Play Icon"/></button>
                </div>
                <div style={{ width: 30, height: 30 }}>
                    <button className='overflow-visible' onClick={() => handleDecline(id)}><Image src={'/icons/decline.png'} height={50} width={50} alt="Decline Icon"/></button>
                </div>
                <div style={{ width: 30, height: 30 }}>
                    <button className='overflow-visible' onClick={() => handleVote(id)}><Image src={'/icons/vote.png'} height={50} width={50} alt="Vote Icon"/></button>
                </div>
            </div>
        </div>
        {voteErrors[id] && <p style={{ color: 'red' }}>{voteErrors[id]}</p>}
    </motion.div>
  )
};

export default ActiveRequest;
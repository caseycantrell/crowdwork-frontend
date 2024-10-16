import React from 'react'
import Image from 'next/image';

interface Props {
    id: string;
    song: string;
    votes: number | 0;
    handleRequeue: (requestId: string) => void;
    handleVote: (requestId: string) => void;
    voteErrors: { [key: string]: string | null };
  }

const DeclinedRequest: React.FC<Props> = ({ id, song, votes, handleRequeue, handleVote, voteErrors }) => {
  return (
    <div className='bg-gradient-to-r from-red-500 to-orange-500 border border-black px-4 py-2'>
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
                <button className='overflow-visible' onClick={() => handleRequeue(id)}><Image src={'/icons/requeue.png'} height={40} width={50} alt="Requeue Icon"/></button>
            </div>
            <div style={{ width: 30, height: 30 }}>
                <button className='overflow-visible' onClick={() => handleVote(id)}><Image src={'/icons/vote.png'} height={50} width={50} alt="Vote Icon"/></button>
            </div>
        </div>
    </div>
        {voteErrors[id] && <p style={{ color: 'red' }}>{voteErrors[id]}</p>}
    </div>
  )
};

export default DeclinedRequest;
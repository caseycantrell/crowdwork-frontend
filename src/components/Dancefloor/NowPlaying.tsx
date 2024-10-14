import React from 'react'

interface Props {
    id: string;
    song: string;
    votes: number | 0;
    handleRequeue: (requestId: string) => void;
    handleComplete: (requestId: string) => void;
  }

const NowPlaying: React.FC<Props> = ({ id, song, votes, handleRequeue, handleComplete }) => {
  return (
    <div className='bg-orange-400 p-2'>
        <p className='font-bold text-2xl'>NOW PLAYING</p>
        <div className='flex flex-row items-center'>
            <p className='font-bold text-lg mr-1'>Id:</p>        
            <p className='text-md ml-1'>{id}</p>        
        </div>
        <div className='flex flex-row items-center'>
            <p className='font-bold text-lg mr-1'>Song:</p>        
            <p className='text-md ml-1'>{song}</p>        
        </div>
        <div>Votes: {votes}</div>
        <button onClick={() => handleRequeue(id)} className='bg-yellow-500 rounded-md p-2 font-bold mx-1'>Requeue</button>
        <button onClick={() => handleComplete(id)} className='bg-green-500 rounded-md p-2 font-bold mx-1'>Complete</button>
    </div>
  )
}

export default NowPlaying;
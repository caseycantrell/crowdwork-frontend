// import React from 'react'

// interface Props {
//     id: string;
//     song: string;
//     likes: number | 0;
//     handleRequeue: (requestId: string) => void;
//     handleDecline: (requestId: string) => void;
//     handlePlay: (requestId: string) => void;
//     handleLike: (requestId: string) => void;
//     likeErrors: { [key: string]: string | null };
//   }

// const Request: React.FC<Props> = ({ id, song, likes, handleRequeue, handleDecline, handlePlay, handleLike, likeErrors }) => {
//   return (
//     <div className='bg-blue-700 p-2'>
//         <p>Song Request</p>
//         <div className='flex flex-row items-center'>
//             <p className='font-bold text-lg mr-1'>Id:</p>        
//             <p className='text-md ml-1'>{id}</p>        
//         </div>
//         <div className='flex flex-row items-center'>
//             <p className='font-bold text-lg mr-1'>Song:</p>        
//             <p className='text-md ml-1'>{song}</p>        
//         </div>
//         <div>Likes: {likes}</div>
//         <button onClick={() => handlePlay(id)} className='bg-blue-400 rounded-md py-2 px-4 font-bold mr-1'>Play</button>
//         <button onClick={() => handleRequeue(id)} className='bg-yellow-500 rounded-md p-2 font-bold mx-1'>Requeue</button>
//         <button onClick={() => handleDecline(id)} className='bg-red-500 rounded-md py-2 px-3 font-bold mx-1'>Decline</button>
//         <button onClick={() => handleLike(id)} className='bg-purple-500 rounded-md py-2 px-3 font-bold ml-1'>Like</button>
//         {likeErrors[id] && <p style={{ color: 'red' }}>{likeErrors[id]}</p>}
//     </div>
//   )
// }

// export default Request;
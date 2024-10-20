import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../../../components/UI/Button'

const DancefloorDetails: React.FC = () => {
  const router = useRouter();
  const { dancefloorId } = router.query;

  const [dancefloor, setDancefloor] = useState<any>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (typeof dancefloorId === 'string' && backendUrl) {
      fetch(`${backendUrl}/api/dancefloor/${dancefloorId}`, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((data) => setDancefloor(data))
        .catch((error) => console.error('Error fetching dancefloor details:', error));
    }
  }, [dancefloorId, backendUrl]);

  if (!dancefloor) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 p-6">
      <div className="w-full max-w-5xl bg-gray-700 shadow-lg rounded-lg p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <p className="text-2xl font-bold text-white">Dancefloor ID: {dancefloorId}</p>
          <Link href={`/dj/${dancefloor.dj_id}`}>
            <Button 
              bgColor='bg-gradient-to-r from-indigo-400 to-cyan-400'
              padding='px-5 py-3'
            >
              Back to DJ Page
            </Button>
          </Link>
        </div>

        <div className="p-6 bg-gray-600 rounded-lg text-white">
          <p className="text-2xl font-semibold mb-4">Dancefloor Info</p>
            <div className='flex flex-row items-center'>
              <p className='font-bold'>Status:</p> 
              <p className='font-medium ml-1'>{dancefloor.status}</p>
            </div>
          <div className="flex flex-col">
            <div className='flex flex-row items-center'>
              <p className='font-bold'>Created At:</p> 
              <p className='font-medium ml-1'>{new Date(dancefloor.created_at).toLocaleString()}</p>
            </div>
            <div className='flex flex-row items-center'>
              <p className='font-bold'>Ended At:</p> 
              <p className='font-medium ml-1'>{new Date(dancefloor.ended_at).toLocaleString()}</p>
            </div>
            <div className='flex flex-row items-center'>
              <p className='font-bold'>Total Requests:</p> 
              <p className='font-medium ml-1'>{dancefloor.requests_count}</p>
            </div>
            <div className='flex flex-row items-center'>
              <p className='font-bold'>Total Messages:</p> 
              <p className='font-medium ml-1'>{dancefloor.messages_count}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="py-6 pl-6 pr-3 bg-gray-600 rounded-lg">
            <p className="text-2xl font-semibold mb-4">Song Requests</p>
            <div className="max-h-[24rem] overflow-y-auto space-y-2 pb-8 pr-3 scrollbar-thin">
              {dancefloor.songRequests && dancefloor.songRequests.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {dancefloor.songRequests.map((request: any) => (
                    <li key={request.id} className="p-3 bg-gray-500 shadow rounded">
                      {request.song} (Votes: {request.votes})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No song requests for this dancefloor.</p>
              )}
            </div>
          </div>
          <div className="py-6 pl-6 pr-3 bg-gray-600 rounded-lg">
            <p className="text-2xl font-semibold mb-4">Messages</p>
            <div className="max-h-[24rem] overflow-y-auto space-y-2 pb-8 pr-3 scrollbar-thin">
              {dancefloor.messages && dancefloor.messages.length > 0 ? (
                <ul className="space-y-2">
                  {dancefloor.messages.map((msg: any) => (
                    <li key={msg.id} className="p-3 bg-gray-500 shadow rounded">
                      {msg.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No messages for this dancefloor.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DancefloorDetails;
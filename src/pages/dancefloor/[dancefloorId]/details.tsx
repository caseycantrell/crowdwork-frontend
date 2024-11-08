import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../../../components/UI/Button'
import Modal from '../../../components/UI/Modal'
import { formatDate } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

interface DJ {
  id: string;
  name: string;
}

interface SongRequest {
  id: string;
  song: string;
  artist: string;
  likes: number;
  created_at: string;
}

interface Message {
  id: string;
  created_at: string;
  message: string;
}

interface Dancefloor {
  id: string;
  dj_id: string;
  created_at: string;
  ended_at: string;
  status: string;
  name: string | null;
  requests_count: number;
  messages_count: number;
  messages: Message[];
  songRequests: SongRequest[];
  dj: DJ;
}

const DancefloorDetails: React.FC = () => {
  const router = useRouter();
  const { dancefloorId } = router.query;
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ statusMessage, setStatusMessage ] = useState<string | null>(null);
  const [ isStatusMessageError, setIsStatusMessageError ] = useState<boolean>(false);
  const [ dancefloor, setDancefloor ] = useState<Dancefloor | null>(null);
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

  const handleConfirmReactivateDancefloor = async () => {
    setIsStatusMessageError(false);
    if (backendUrl && dancefloorId) {
      try {
        const res = await fetch(`${backendUrl}/api/dancefloor/${dancefloorId}/reactivate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          setStatusMessage('Dancefloor reactivated successfully.');
          setTimeout(() => {
            router.reload();
          }, 2000);
        } else {
          setStatusMessage('Failed to reactivate dancefloor.');
        }
      } catch {
        setIsStatusMessageError(true);
        setStatusMessage('An error occurred while reactivating the dancefloor.');
      }
    }
  };

  if (!dancefloor) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className='gradient-background'></div>
      <div className="w-full max-w-6xl bg-gray-600 backdrop-filter backdrop-blur-lg bg-opacity-30 shadow-lg rounded-lg p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-4">
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
        <div className="p-6 bg-gray-700 backdrop-filter backdrop-blur-lg bg-opacity-30 flex flex-row items-center justify-between rounded-lg text-white mb-8 mt-4">
          <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <p className="text-2xl font-semibold mb-4">Dancefloor Info</p>
            </div>
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

          <div className='mr-16'>
            <Button 
              onClick={() => setIsModalOpen(true)} 
              bgColor="bg-green-500" 
              padding="px-16 py-5"
              className='text-lg'
            >
              Reactivate Dancefloor
            </Button>
          </div>
        </div>
        {/* confirmation modal */}
         <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-4 relative space-y-4 pb-5">
            <p className="text-2xl font-bold">Reactivate Dancefloor?</p>
           <div className='pb-2'>
            <p className="font-semibold">Are you sure you want to reactivate this dancefloor?</p>
            <p className="font-semibold">This will override any currently active dancefloor.</p>
           </div>
            <Button
              onClick={handleConfirmReactivateDancefloor}
              className="w-full mt-2 text-lg"
              padding='py-4'
            >
              Confirm Reactivate
            </Button>
            <AnimatePresence>
              {statusMessage && 
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ type: 'tween', duration: 0.5, ease: 'easeInOut' }}
                  className={`${isStatusMessageError ? 'text-red-500 ' : 'text-green-500 '} text-center font-semibold text-sm absolute -bottom-3 left-0 right-0 `}>
                {statusMessage}
                </motion.p>
              }
            </AnimatePresence>
          </div>
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="py-6 pl-6 pr-3 bg-gray-700 backdrop-filter backdrop-blur-lg bg-opacity-30 rounded-lg">
            <p className="text-2xl font-semibold mb-4">Song Requests</p>
            <div className="max-h-[24rem] overflow-y-auto space-y-2 pr-3 scrollbar-thin">
              {dancefloor.songRequests && dancefloor.songRequests.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {dancefloor.songRequests.map((request: SongRequest) => (
                    <li key={request.id} className="py-3 px-2 bg-gray-800 backdrop-filter backdrop-blur-lg bg-opacity-30 shadow rounded flex flex-row items-center">
                      <p className='text-xs text-gray-400 mr-2 text-nowrap'>{formatDate(request.created_at, "h:mm a")} </p>
                      <p className='flex-1 truncate overflow-hidden text-ellipsis whitespace-nowrap'>{request.song} </p>
                      <p className='text-xs ml-2 text-gray-400 text-nowrap'>(Likes: {request.likes})</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic">No song requests for this dancefloor.</p>
              )}
            </div>
          </div>
          <div className="py-6 pl-6 pr-3 bg-gray-700 backdrop-filter backdrop-blur-lg bg-opacity-30 rounded-lg">
            <p className="text-2xl font-semibold mb-4">Messages</p>
            <div className="max-h-[24rem] overflow-y-auto space-y-2 pr-3 scrollbar-thin">
              {dancefloor.messages && dancefloor.messages.length > 0 ? (
                <ul className="space-y-2">
                  {dancefloor.messages.map((msg: Message) => (
                    <li key={msg.id} className="py-3 px-2 bg-gray-800 backdrop-filter backdrop-blur-lg bg-opacity-30 shadow rounded flex flex-row items-center">
                      <p className='text-xs text-gray-400 mr-2 text-nowrap'>{formatDate(msg.created_at, "h:mm a")} </p>
                      <p>{msg.message}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic">No messages for this dancefloor.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DancefloorDetails;
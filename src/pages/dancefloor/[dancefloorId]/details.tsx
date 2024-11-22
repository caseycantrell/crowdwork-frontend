import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Modal from '../../../components/UI/Modal'
import Button from '../../../components/UI/Button'
import Input from '../../../components/UI/Input';
import Notification from '../../../components/UI/Notification';
import Image from 'next/image';
import { formatDate } from 'date-fns';
import LogoutButton from '../../../components/LogoutButton';
import { useSession, signOut } from 'next-auth/react';
import { editIcon } from '@/icons';

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
  dj_id: string | null;
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
  const { data: session } = useSession();
  const { dancefloorId } = router.query;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [notification, setNotification] = useState({ message: '', isVisible: false, isError: false });
  const [ isReactivateModalOpen, setIsReactivateModalOpen ] = useState(false);
  const [ isDeleteModalOpen, setIsDeleteModalOpen ] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [ dancefloor, setDancefloor ] = useState<Dancefloor | null>(null);

  const showNotification = (message: string, isError = false) => {
    setNotification({ message, isVisible: true, isError });
    setTimeout(() => setNotification((prev) => ({ ...prev, isVisible: false })), 3500);
  };

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
    if (backendUrl && dancefloorId) {
      try {
        const res = await fetch(`${backendUrl}/api/dancefloor/${dancefloorId}/reactivate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          showNotification('Dancefloor reactivated successfully.', false);
          setTimeout(() => {
            router.reload();
          }, 2000);
        } else {
          showNotification('Failed to reactivate dancefloor.', true);
        }
      } catch {
        showNotification('An error occurred while reactivating the dancefloor.', true);
      }
    }
  };

  const handleConfirmDeleteDancefloor = async () => {
    if (backendUrl && dancefloorId) {
      try {
        const res = await fetch(`${backendUrl}/api/dancefloor/${dancefloorId}`, {
          method: 'DELETE',
        });
  
        if (res.ok) {
          showNotification('Dancefloor deleted successfully.', false);
          setTimeout(() => {
            router.push(`/dj/${dancefloor?.dj_id}`);
          }, 2000);
        } else {
          showNotification('Failed to delete dancefloor.', true);
        }
      } catch {
        showNotification('An error occurred while deleting the dancefloor.', true);
      }
    }
  };

  const handleSaveName = async () => {
    if (newName.length > 56) {
      showNotification('Name must be less than 56 characters.', true);
      return;
    }
  
    if (backendUrl && dancefloorId) {
      try {
        const res = await fetch(`${backendUrl}/api/dancefloor/rename`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dancefloorId,
            name: newName.trim() === '' ? null : newName.trim(), // Send null for blank input
          }),
        });
  
        if (res.ok) {
          const data = await res.json();
          setDancefloor((prev) => prev ? { ...prev, name: data.name } : null);
          showNotification('Dancefloor renamed successfully.');
          setIsEditingName(false);
        } else {
          showNotification('Failed to rename dancefloor.', true);
        }
      } catch {
        showNotification('An error occurred while renaming the dancefloor.', true);
      }
    }
  };
  

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setNewName('');
  };

  const handleLogout = async () => {
    showNotification("Logged out successfully.", false);
  
    setTimeout(async () => {
      try {
        await signOut({ redirect: false });
        router.push("/");
      } catch {
        showNotification("An error occurred during logout. Please try again.", true);
      }
    }, 3500);
  };

  if (!dancefloor) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="gradient-background-variation backdrop-blur"></div>
      {session && 
        <div className="absolute top-8 right-14">
          <LogoutButton handleLogout={handleLogout} />
        </div>
      }
        <Notification
          showNotification={notification.isVisible}
          isError={notification.isError}
          notificationMessage={notification.message}
          onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
        />
        <div className="w-full max-w-6xl bg-gray-600 bg-opacity-30 shadow-lg rounded-lg p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-4">
            <div className="flex flex-row items-center gap-2 w-full whitespace-nowrap mr-8">
              <p className="text-2xl font-bold text-white">
                Dancefloor{dancefloor.name ? '' : ' ID'}:
              </p>
              {!isEditingName ? (
                <>
                  <p className="text-2xl font-bold text-white">{dancefloor.name || dancefloorId}</p>
                  <div
                    className="flex flex-row items-center cursor-pointer opacity-80"
                    onClick={() => {
                      setIsEditingName(true);
                      setNewName(dancefloor.name || '');
                    }}
                  >
                    <Image src={editIcon} width={18} height={18} alt="Edit Icon" className="invert" />
                    <p className="font-bold text-xs ml-0.5 mt-0.5">Rename</p>
                  </div>
                </>
              ) : (
                <>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    maxLength={56}
                    placeholder="Enter new name"
                    className="ml-2 w-full"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveName} bgColor="bg-success/70">
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} bgColor="bg-error/70">
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
            <Link href={`/dj/${dancefloor.dj_id}`}>
              <Button padding='px-4 py-3' className='whitespace-nowrap'>
                Back to DJ Page
              </Button>
            </Link>
          </div>
          <div className="p-6 bg-gray-700 bg-opacity-30 flex flex-row items-center justify-between rounded-lg text-white mb-8 mt-4">
            <div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <p className="text-2xl font-bold mb-4">Dancefloor Info</p>
              </div>
              <div className="flex flex-row items-center">
                <p className="font-bold">Status:</p>
                <p className={`font-semibold ml-1 ${dancefloor.status === 'active' ? 'text-success' : 'text-gray-400'}`}>
                  {dancefloor.status ? dancefloor.status.charAt(0).toUpperCase() + dancefloor.status.slice(1) : ''}
                </p>
                {dancefloor.status === 'active' && (
                  <div className="mt-0.5 w-1.5 h-1.5 bg-success rounded-full animate-ping ml-2"></div>
                )}
                {dancefloor.status === 'completed' && (
                  <svg
                    className="text-success/60 h-7 w-7 mb-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                <div className='flex flex-row items-center'>
                  <p className='font-bold'>Started:</p> 
                  <p className='font-medium ml-1'>{new Date(dancefloor.created_at).toLocaleString()}</p>
                </div>
                <div className='flex flex-row items-center'>
                  <p className='font-bold'>Ended:</p> 
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
            <div className='flex flex-row items-center mr-8'>
              <div className="mr-12">
                {dancefloor.status === "active" ? (
                  <Link href={`/dancefloor/${dancefloor.id}`}>
                    <Button
                      bgColor="bg-success/80"
                      padding="w-64 py-4"
                      className="text-lg"
                    >
                      Go to Dancefloor
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => setIsReactivateModalOpen(true)}
                    bgColor="bg-purple-500/70"
                    padding="w-64 py-4"
                    className="text-lg"
                  >
                    Reactivate Dancefloor
                  </Button>
                )}
              </div>
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                bgColor="bg-error/70"
                padding="w-64 py-4"
                className="text-lg"
              >
                Delete Dancefloor
              </Button>
            </div>
          </div>

          {/* reactivate confirmation modal */}
          <Modal isOpen={isReactivateModalOpen} onClose={() => setIsReactivateModalOpen(false)}>
            <div className="relative space-y-4">
              <p className="text-3xl font-bold">Reactivate Dancefloor?</p>
            <div className='pb-2'>
              <p className="font-semibold">Are you sure you want to reactivate this dancefloor?</p>
              <p className="font-semibold">This will override any currently active dancefloor.</p>
            </div>
              <Button
                onClick={handleConfirmReactivateDancefloor}
                bgColor='bg-success/80'
                className="w-full mt-2 text-lg"
                padding='py-4'
              >
                Confirm Reactivation
              </Button>
            </div>
          </Modal>
          
          {/* delete confirmation modal */}
          <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
            <div className="relative space-y-4">
              <p className="text-3xl font-bold">Delete Dancefloor?</p>
              <div className='pb-2'>
                <p className="font-semibold">Are you sure you want to delete this dancefloor?</p>
                <p className="font-semibold">This action cannot be undone.</p>
              </div>
              <Button
                onClick={handleConfirmDeleteDancefloor}
                bgColor='bg-error/80'
                className="w-full mt-2 text-lg"
                padding='py-4'
              >
                Confirm Deletion
              </Button>
            </div>
          </Modal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="py-6 pl-6 pr-3 bg-gray-700 bg-opacity-30 rounded-lg">
              <p className="text-2xl font-semibold mb-4">Song Requests</p>
              <div className="max-h-[24rem] overflow-y-auto space-y-2 pr-3 scrollbar-thin">
                {dancefloor.songRequests && dancefloor.songRequests.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2">
                    {dancefloor.songRequests.map((request: SongRequest) => (
                      <li key={request.id} className="py-3 px-2 bg-gray-800 bg-opacity-30 shadow rounded flex flex-row items-center">
                        <p className='text-xs text-gray-400 mr-2 text-nowrap'>{formatDate(request.created_at, "h:mm a")} </p>
                        <p className='flex-1 truncate overflow-hidden text-ellipsis whitespace-nowrap font-semibold'>{request.song} </p>
                        <p className='text-xs ml-2 text-gray-400 text-nowrap'>(Likes: {request.likes})</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic">No song requests for this dancefloor.</p>
                )}
              </div>
            </div>
            <div className="py-6 pl-6 pr-3 bg-gray-700 bg-opacity-30 rounded-lg">
              <p className="text-2xl font-semibold mb-4">Messages</p>
              <div className="max-h-[24rem] overflow-y-auto space-y-2 pr-3 scrollbar-thin">
                {dancefloor.messages && dancefloor.messages.length > 0 ? (
                  <ul className="space-y-2">
                    {dancefloor.messages.map((msg: Message) => (
                      <li key={msg.id} className="py-3 px-2 bg-gray-800 bg-opacity-30 shadow rounded flex flex-row items-center">
                        <p className='text-xs text-gray-400 mr-2 text-nowrap'>{formatDate(msg.created_at, "h:mm a")} </p>
                        <p className='font-semibold'>{msg.message}</p>
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
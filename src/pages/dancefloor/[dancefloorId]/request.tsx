import { useRouter } from 'next/router';
import { useState } from 'react';
import { getSocket } from '@/utils/socket';
import Button from '@/components/UI/Button';

const SongRequestPage: React.FC = () => {
  const router = useRouter();
  const { dancefloorId } = router.query;
  const [songRequest, setSongRequest] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const socket = getSocket();

  const handleSendSongRequest = () => {
    if (!songRequest.trim()) {
      setError('Please enter a song title.');
      return;
    }

    socket.emit('songRequest', { dancefloorId, song: songRequest });
    setSongRequest('');
    setError(null);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false); 
      router.back();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col justify-center items-center relative">
      <Button className="absolute top-8 left-8" onClick={() => router.back()}>
        Back
      </Button>
      <h1 className="text-white text-2xl font-bold mb-4">Request a Song</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">Song request sent!</p>}

      <div className="w-full max-w-sm px-4">
        <input
          type="text"
          value={songRequest}
          onChange={(e) => setSongRequest(e.target.value)}
          placeholder="Enter song title..."
          className="w-full p-4 rounded-md text-black"
        />
        <button
          onClick={handleSendSongRequest}
          className="w-full bg-gradient-to-r from-emerald-400 to-cyan-500 text-white py-4 mt-4 rounded-md"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
};

export default SongRequestPage;

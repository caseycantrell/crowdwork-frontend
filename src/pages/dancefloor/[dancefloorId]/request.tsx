import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async-creatable';
import { getSocket } from '@/utils/socket';
import Button from '@/components/UI/Button';

interface SongOption {
  value: string;
  label: string;
  isCustom?: boolean;
}

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#1F2937',
    color: 'white',
    borderRadius: '0.375rem',
    border: '1px solid #4ADE80',
    padding: '0.25rem',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
  input: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#1F2937',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#4ADE80' : '#1F2937',
    color: state.isFocused ? 'black' : 'white',
    padding: 10,
  }),
};

const SongRequestPage: React.FC = () => {
  const router = useRouter();
  const { dancefloorId } = router.query;
  const socket = getSocket();

  const [selectedSong, setSelectedSong] = useState<SongOption | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (newValue: SongOption | null) => {
    setSelectedSong(newValue);
  };

  const loadOptions = async (inputValue: string) => {
    if (!inputValue) return [];
  
    try {
      const response = await fetch(`/api/spotify-search?query=${encodeURIComponent(inputValue)}`);
      const options = await response.json();
  
      if (!response.ok) {
        throw new Error(options.error || 'Failed to fetch songs');
      }
  
      return options;
    } catch (error) {
      console.error('Error fetching songs:', error);
      return [];
    }
  };

  const handleSendSongRequest = () => {
    if (!selectedSong) {
      setError('Please select a song.');
      return;
    }

    socket.emit('songRequest', { dancefloorId, song: selectedSong.label });
    setSelectedSong(null);
    setError(null);

    setTimeout(() => {
      router.back();
    }, 2000);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col justify-center items-center relative">
      <Button className="absolute top-8 left-8" onClick={() => router.back()}>
        Back
      </Button>
      <h1 className="text-white text-2xl font-bold mb-4">Request a Song</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="w-full max-w-sm px-4">
        <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            onChange={handleChange}
            placeholder="Search for a song..."
            styles={customStyles}
            isClearable
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
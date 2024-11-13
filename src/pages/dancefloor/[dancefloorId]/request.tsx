import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async-creatable';
import { StylesConfig, GroupBase } from 'react-select';
import { getSocket } from '@/utils/socket';
import Button from '@/components/UI/Button';
import { motion } from 'framer-motion';

interface SongOption {
  value: string;
  label: string;
  isCustom?: boolean;
}

const customStyles: StylesConfig<SongOption, false, GroupBase<SongOption>> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#1F2937',
    color: 'white',
    borderRadius: '0.375rem',
    border: '1px solid #0ce471',
    padding: '0.25rem',
    boxShadow: state.isFocused ? '0 0 0 1px #4ADE80' : undefined,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white',
  }),
  input: (provided) => ({
    ...provided,
    color: 'white',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#1F2937',
  }),
  option: (provided, state) => ({
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
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  let timeoutId: NodeJS.Timeout;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (newValue: SongOption | null) => {
    setSelectedSong(newValue);
  };

  const loadOptions = async (inputValue: string): Promise<SongOption[]> => {
    if (!inputValue) return [];

    try {
      const response = await fetch(`/api/spotify-search?query=${encodeURIComponent(inputValue)}`);
      const options: SongOption[] = await response.json();

      if (!response.ok) {
        throw new Error(options[0]?.label || 'Failed to fetch songs');
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
    setSubmitted(true); // show success content

    timeoutId = setTimeout(() => {
      router.back();
    }, 3500);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center">
      {submitted ? (
        <div className="flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-main text-3xl mb-4"
          >
          Success!
          </motion.p>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-white mb-4"
        >
          Your song request has been sent.
        </motion.p>

        {/* checkmark */}
        <motion.svg
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="text-main h-20 w-20 mb-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
        <motion.path
          d="M5 13l4 4L19 7"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{
            opacity: { duration: 0.1, delay: 0.5 },
            pathLength: {
              duration: 0.7,
              delay: 0.5,
              ease: [0.65, 0, 0.35, 1.2],
            },
          }}
        />
        </motion.svg>
        </div>
      ) : (
        <>
          <button className="absolute top-8 left-8 font-bold" onClick={() => router.back()}>
            Cancel
          </button>
          <p className="text-white text-2xl font-bold mb-4">Request a Song</p>
          <div className="w-full max-w-sm px-4">
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions}
              onChange={handleChange}
              placeholder={error ? error : "Search for a song..."}
              styles={customStyles}
              isClearable
            />
            <Button
              onClick={handleSendSongRequest}
              className="w-full bg-gradient-to-r from-emerald-400 to-cyan-500 text-white py-4 mt-4 rounded-md"
            >
              Submit Request
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SongRequestPage;
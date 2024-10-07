import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import Link from 'next/link';

// Define the interface for the fetched data
interface DancefloorStatus {
  id: string;
  is_active: boolean;
}

const DjIdPage: React.FC = () => {
  const router = useRouter();
  const { djId } = router.query;

  // State to manage the status message
  const [status, setStatus] = useState<string>('Loading...');
  const [dancefloorId, setDancefloorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    let isMounted = true;

    // need to ensure djId is a string before making the fetch request
    if (typeof djId === 'string' && backendUrl) {
      fetch(`${backendUrl}/api/dj/${djId}`)
        .then((res) => res.json())
        .then((data: DancefloorStatus) => {
          if (isMounted) {
            if (!data.is_active) {
              setStatus('No active dancefloor at the moment.');
              setDancefloorId(null);
            } else {
              setDancefloorId(data.id);
              setStatus('Active dancefloor is live.');
            }
          }
        })
        .catch((error) => {
          if (isMounted) {
            console.error('Error fetching DJ data:', error);
            setStatus('Error fetching data.');
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [djId, backendUrl]);


  const startDancefloor = () => {
    if (typeof djId === 'string' && backendUrl) {
      setIsLoading(true);
      fetch(`${backendUrl}/api/start-dancefloor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ djId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setDancefloorId(data.dancefloorId);
          setStatus('Dancefloor started successfully!');
          router.push({
            pathname: `/dancefloor/${data.dancefloorId}`,
            query: { djId: djId }
          });
        })
        .catch(() => {
          setStatus('Error starting dancefloor.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };


  const stopDancefloor = () => {
    if (typeof djId === 'string' && backendUrl) {
      setIsLoading(true);
      fetch(`${backendUrl}/api/stop-dancefloor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ djId }),
      })
        .then(() => {
          setDancefloorId(null);
          setStatus('Dancefloor stopped.');
        })
        .catch(() => {
          setStatus('Error stopping dancefloor.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div>
      <h1>DJ Page</h1>
      <p>{status}</p>

      {dancefloorId ? (
        <>
          <button onClick={stopDancefloor} disabled={isLoading}>
            {isLoading ? 'Stopping...' : 'Stop Dancefloor'}
          </button>
          {/* Link to the live dancefloor if one exists */}
          <Link 
          href={{
            pathname: `/dancefloor/${dancefloorId}`, 
            query: { djId: djId }
          }} 
          style={{ marginLeft: '10px' }}>
          Go to Active Dancefloor
        </Link>
        </>
      ) : (
        <button onClick={startDancefloor} disabled={isLoading}>
          {isLoading ? 'Starting...' : 'Start Dancefloor'}
        </button>
      )}
      <div>
        <LogoutButton />
      </div>
    </div>
  );
};

export default DjIdPage;

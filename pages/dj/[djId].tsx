import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

// Define the interface for the fetched data
interface DancefloorStatus {
  id: string;
  is_active: boolean;
}

const DjIdPage: React.FC = () => {
  const router = useRouter();
  const { djId } = router.query; // djId might be undefined or a string | string[]

  // State to manage the status message
  const [status, setStatus] = useState<string>('Loading...');

  useEffect(() => {
    let isMounted = true;  // Flag to check if component is still mounted

    // Ensure djId is a string before making the fetch request
    if (typeof djId === 'string') {
      fetch(`/api/dj/${djId}`)
        .then((res) => res.json())
        .then((data: DancefloorStatus) => {
          if (isMounted) {  // Only update state if component is mounted
            if (data.is_active) {
              router.push(`/dancefloor/${data.id}`);
            } else {
              setStatus('No active dancefloor.');
            }
          }
        })
        .catch(() => {
          if (isMounted) {
            setStatus('Error fetching data.');
          }
        });
    }

    return () => {
      isMounted = false;  // Cleanup function to prevent state updates after unmount
    };
  }, [djId, router]);

  return (
    <div>
      <h1>DJ Page</h1>
      <p>{status}</p>
    </div>
  );
};

export default DjIdPage;
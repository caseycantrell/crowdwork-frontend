import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const DancefloorDetails = () => {
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
            .then((data) => {
              setDancefloor(data);
            })
            .catch((error) => {
              console.error('Error fetching dancefloor details:', error);
            });
        }
      }, [dancefloorId, backendUrl]);

    if (!dancefloor) return <p>Loading...</p>;

    return (
        <div>
            <Link href={`/dj/${dancefloor.dj_id}`}>
                <button>Back DJ Page</button>
            </Link>
            <h1>Details for Dancefloor {dancefloorId}</h1>
            <p>Status: {dancefloor.status}</p>
            <p>Created At: {new Date(dancefloor.created_at).toLocaleString()}</p>
            
            {/* Display song requests */}
            <h2>Song Requests</h2>
            {dancefloor.songRequests && dancefloor.songRequests.length > 0 ? (
                <ul>
                    {dancefloor.songRequests.map((request: any) => (
                        <li key={request.id}>
                            {request.song} (Votes: {request.votes}) - Status: {request.status}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No song requests for this dancefloor.</p>
            )}

            {/* Display messages */}
            <h2>Messages</h2>
            {dancefloor.messages && dancefloor.messages.length > 0 ? (
                <ul>
                    {dancefloor.messages.map((msg: any) => (
                        <li key={msg.id}>{msg.message}</li>
                    ))}
                </ul>
            ) : (
                <p>No messages for this dancefloor.</p>
            )}
        </div>
    );
};

export default DancefloorDetails;

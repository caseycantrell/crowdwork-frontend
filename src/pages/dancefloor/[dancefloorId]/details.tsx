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
        .then((data) => setDancefloor(data))
        .catch((error) => console.error('Error fetching dancefloor details:', error));
    }
  }, [dancefloorId, backendUrl]);

  if (!dancefloor) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 p-6">
      <div className="w-full max-w-5xl bg-gray-700 shadow-lg rounded-lg p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-white">Dancefloor ID: {dancefloorId}</h1>
          <Link href={`/dj/${dancefloor.dj_id}`}>
            <button className="px-5 py-3 bg-gradient-to-r from-indigo-400 to-cyan-400 text-white font-semibold rounded-md">
              Back to DJ Page
            </button>
          </Link>
        </div>

        {/* Info Section */}
        <div className="p-6 bg-gray-600 rounded-lg text-white">
          <h2 className="text-2xl font-semibold mb-4">Dancefloor Info</h2>
          <p>
            <strong>Status:</strong> {dancefloor.status}
          </p>
          <p className="flex flex-col">
            <div>
            <strong>Created At:</strong> {new Date(dancefloor.created_at).toLocaleString()}
            </div>
            <div>
            <strong>Ended At:</strong> {new Date(dancefloor.ended_at).toLocaleString()}
            </div>
            <div>
            <strong>Total Requests:</strong> {dancefloor.total_requests}
            </div>
            <div>
            <strong>Total Messages:</strong> {dancefloor.messages_count}
            </div>
          </p>
        </div>

        {/* Messages and Song Requests Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Song Requests Section */}
          <div className="py-6 pl-6 pr-3 bg-gray-600 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Song Requests</h2>
            <div className="max-h-[24rem] overflow-y-auto space-y-2 pb-8 pr-3 scrollbar-thin">
              {dancefloor.songRequests && dancefloor.songRequests.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {dancefloor.songRequests.map((request: any) => (
                    <li key={request.id} className="p-2 bg-gray-500 shadow rounded">
                      {request.song} (Votes: {request.votes})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No song requests for this dancefloor.</p>
              )}
            </div>
          </div>
          {/* Messages Section */}
          <div className="py-6 pl-6 pr-3 bg-gray-600 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Messages</h2>
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

import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import LogoutButton from '../../components/LogoutButton';
import Link from 'next/link';

const DjIdPage: React.FC = () => {
  const router = useRouter();
  const { djId } = router.query;

  const [status, setStatus] = useState<string>('Loading...');
  const [dancefloorId, setDancefloorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [djName, setDjName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [instagramHandle, setInstagramHandle] = useState<string>('');
  const [twitterHandle, setTwitterHandle] = useState<string>('');
  const [venmoHandle, setVenmoHandle] = useState<string>('');
  const [cashappHandle, setCashappHandle] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [pastDancefloors, setPastDancefloors] = useState<any[]>([]);
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    let isMounted = true;
  
    if (typeof djId === 'string' && backendUrl) {
      fetch(`${backendUrl}/api/dj/${djId}`, {
        method: 'GET',
        credentials: 'include', 
      })
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) {
            setDjName(data.name);
            setBio(data.bio);
            setWebsite(data.website);
            setInstagramHandle(data.instagramHandle);
            setTwitterHandle(data.twitterHandle);
            setVenmoHandle(data.venmoHandle);
            setCashappHandle(data.cashappHandle);
  
            if (!data.isActive) {
              setStatus('No active dancefloor at the moment.');
              setDancefloorId(null);
            } else {
              setDancefloorId(data.dancefloorId);
              setStatus('Active dancefloor is live.');
  
              if (!data.isDjLoggedIn) {
                router.push({
                  pathname: `/dancefloor/${data.dancefloorId}`,
                  query: { djId: djId },
                });
              }
            }
            setQrCodeUrl(data.qrCode);
          }
        })
        .then(() => {
          // Fetch past dancefloors
          return fetch(`${backendUrl}/api/dj/${djId}/past-dancefloors`, {
            method: 'GET',
            credentials: 'include',
          });
        })
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) {
            setPastDancefloors(data); // Set past dancefloors
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
            query: { djId: djId },
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

  const handleEditInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backendUrl}/api/dj/${djId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio,
          website,
          instagramHandle,
          twitterHandle,
          venmoHandle,
          cashappHandle,
        }),
      });

      if (res.ok) {
        setStatus('DJ info updated successfully');
        setIsEditing(false);  // Exit editing mode after saving
      } else {
        setStatus('Error updating DJ info');
      }
    } catch (error) {
      console.error('Error updating DJ info:', error);
      setStatus('Error updating DJ info');
    }
  };

  return (
    <div>
      <h1>DJ Page for {djName}</h1>
      <p>{status}</p>

      {/* Display the QR code if available */}
      {qrCodeUrl && (
        <div>
          <h3>Your QR Code</h3>
          <img src={qrCodeUrl} alt="DJ QR Code" style={{ width: '200px', height: '200px' }} />
        </div>
      )}

      {dancefloorId ? (
        <>
          <button onClick={stopDancefloor} disabled={isLoading}>
            {isLoading ? 'Stopping...' : 'Stop Dancefloor'}
          </button>
          <Link
            href={{
              pathname: `/dancefloor/${dancefloorId}`,
              query: { djId: djId },
            }}
            style={{ marginLeft: '10px' }}
          >
            Go to Active Dancefloor
          </Link>
        </>
      ) : (
        <button onClick={startDancefloor} disabled={isLoading}>
          {isLoading ? 'Starting...' : 'Start Dancefloor'}
        </button>
      )}

      {/* Display additional DJ info and allow editing */}
      <div>
        <h3>Bio</h3>
        {isEditing ? (
          <textarea value={bio || ''} onChange={(e) => setBio(e.target.value)} />
        ) : (
          <p>{bio}</p>
        )}

        <h3>Website</h3>
        {isEditing ? (
          <input
            type="url"
            value={website || ''}
            onChange={(e) => setWebsite(e.target.value)}
          />
        ) : (
          <a href={website} target="_blank" rel="noopener noreferrer">
            {website}
          </a>
        )}

        <h3>Social Media</h3>
        {isEditing ? (
          <>
            <label>Instagram:</label>
            <input
              type="text"
              value={instagramHandle || ''}
              onChange={(e) => setInstagramHandle(e.target.value)}
            />
            <label>Twitter:</label>
            <input
              type="text"
              value={twitterHandle || ''}
              onChange={(e) => setTwitterHandle(e.target.value)}
            />
            <label>Venmo:</label>
            <input
              type="text"
              value={venmoHandle || ''}
              onChange={(e) => setVenmoHandle(e.target.value)}
            />
            <label>CashApp:</label>
            <input
              type="text"
              value={cashappHandle || ''}
              onChange={(e) => setCashappHandle(e.target.value)}
            />
          </>
        ) : (
          <>
            <p>Instagram: {instagramHandle}</p>
            <p>Twitter: {twitterHandle}</p>
            <p>Venmo: {venmoHandle}</p>
            <p>CashApp: {cashappHandle}</p>
          </>
        )}
      </div>

      <div>
        {isEditing ? (
          <button onClick={handleEditInfo} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Info'}
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit Info</button>
        )}
      </div>
      <h2>Past Dancefloors</h2>
<ul>
  {pastDancefloors.length > 0 ? (
    pastDancefloors.map((dancefloor) => (
      <li key={dancefloor.id}>
        <Link href={`/dancefloor/${dancefloor.id}/details`}>Dancefloor on {dancefloor.end_time}</Link>
      </li>
    ))
  ) : (
    <p>No past dancefloors found.</p>
  )}
</ul>
      <div>
        <LogoutButton />
      </div>
    </div>
  );
};

export default DjIdPage;

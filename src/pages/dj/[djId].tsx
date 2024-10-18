import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import LogoutButton from '../../components/LogoutButton';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion'

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
          // fetch past dancefloors
          return fetch(`${backendUrl}/api/dj/${djId}/past-dancefloors`, {
            method: 'GET',
            credentials: 'include',
          });
        })
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) {
            setPastDancefloors(data);
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

  const domainRegex = /^(https?:\/\/)?(www\.)?([\w-]+\.)+[\w-]{2,}\/?$/;

  const handleEditInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    let formattedWebsite = website.trim();
  
    // add protocol if it's missing
    if (!formattedWebsite.startsWith('http://') && !formattedWebsite.startsWith('https://')) {
      formattedWebsite = `http://${formattedWebsite}`;
    }
  
    // validate the URL without the protocol for regex matching
    const withoutProtocol = formattedWebsite.replace(/(^\w+:|^)\/\//, '');
    if (!domainRegex.test(withoutProtocol)) {
      setStatus('Please enter a valid website (e.g., www.example.com)');
      return;
    }
  
    // remove unnecessary trailing slashes
    try {
      const url = new URL(formattedWebsite);
      formattedWebsite = url.origin + url.pathname; // avoid double slashes
    } catch (err) {
      setStatus('Please enter a valid website (e.g., www.example.com)');
      return;
    }
    try {
      const res = await fetch(`${backendUrl}/api/dj/${djId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio,
          website: formattedWebsite,
          instagramHandle,
          twitterHandle,
          venmoHandle,
          cashappHandle,
        }),
      });
  
      if (res.ok) {
        setStatus('DJ info updated successfully');
        setIsEditing(false);
      } else {
        setStatus('Error updating DJ info');
      }
    } catch (error) {
      console.error('Error updating DJ info:', error);
      setStatus('Error updating DJ info');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-lg p-8 space-y-8 md:flex md:space-x-8">

        {/* TODO: replace this with profile pic */}
        <div className="flex flex-col items-center md:w-1/3">
          <h1 className="text-4xl font-semibold text-center mb-4">{djName || 'DJ Profile'}</h1>
          <p className="text-center text-gray-500 mb-6">{status}</p>
          {qrCodeUrl && (
            <img
              src={qrCodeUrl}
              alt="DJ QR Code"
              className="w-60 h-60 object-contain rounded-lg mb-4"
            />
          )}
        </div>

        {/* Editable Info and Controls */}
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-2xl font-medium">Bio</h3>
            {isEditing ? (
              <textarea
                value={bio || ""}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p>{bio || 'No bio available'}</p>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-medium">Website</h3>
            {isEditing ? (
              <input
                type="text"
                value={website || ""}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {website || 'No website available'}
              </a>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-medium">Social Media</h3>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={instagramHandle || ""}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="Instagram"
                  className="w-full p-2 border border-gray-300 rounded-md mb-2"
                />
                <input
                  type="text"
                  value={twitterHandle || ""}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  placeholder="Twitter"
                  className="w-full p-2 border border-gray-300 rounded-md mb-2"
                />
              </>
            ) : (
              <>
                <p>Instagram: {instagramHandle}</p>
                <p>Twitter: {twitterHandle}</p>
              </>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-medium">Payment Handles</h3>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={venmoHandle || ""}
                  onChange={(e) => setVenmoHandle(e.target.value)}
                  placeholder="Venmo"
                  className="w-full p-2 border border-gray-300 rounded-md mb-2"
                />
                <input
                  type="text"
                  value={cashappHandle || ""}
                  onChange={(e) => setCashappHandle(e.target.value)}
                  placeholder="CashApp"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </>
            ) : (
              <>
                <p>Venmo: {venmoHandle}</p>
                <p>CashApp: {cashappHandle}</p>
              </>
            )}
          </div>


          <div className="flex space-x-4">
            {isEditing ? (
              <motion.button
                onClick={handleEditInfo}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                whileTap={{ scale: 0.95 }}
              >
                Save Info
              </motion.button>
            ) : (
              <motion.button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                whileTap={{ scale: 0.95 }}
              >
                Edit Info
              </motion.button>
            )}
          </div>


          <div className="flex space-x-4">
            {dancefloorId ? (
              <>
                <button
                  onClick={stopDancefloor}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Stopping...' : 'Stop Dancefloor'}
                </button>
                <Link
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-center"
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
              <button
                onClick={startDancefloor}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Starting...' : 'Start Dancefloor'}
              </button>
            )}
          </div>

          <h2 className="text-2xl font-medium">Past Dancefloors</h2>
          <ul className="list-disc list-inside space-y-2">
            {pastDancefloors.length > 0 ? (
              pastDancefloors.map((dancefloor) => (
                <li key={dancefloor.id}>
                  <Link
                    href={`/dancefloor/${dancefloor.id}/details`}
                    className="text-blue-500 underline"
                  >
                    Dancefloor on {dancefloor.end_time}
                  </Link>
                </li>
              ))
            ) : (
              <p>No past dancefloors found.</p>
            )}
          </ul>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default DjIdPage;

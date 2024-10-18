import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import LogoutButton from '../../components/LogoutButton';
import Link from 'next/link';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

const DjIdPage: React.FC = () => {
  const router = useRouter();
  const { djId } = router.query;

  const [status, setStatus] = useState<string>('Loading...');
  const [isStatusVisible, setIsStatusVisible] = useState<boolean>(false);
  const [isStatusError, setIsStatusError] = useState<boolean>(false);
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
  const [isEditingProfilePic, setIsEditingProfilePic] = useState<boolean>(false);
  const [pastDancefloors, setPastDancefloors] = useState<any[]>([]);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (status) {
      setIsStatusVisible(true);
      const timer = setTimeout(() => {
        setIsStatusVisible(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status]);


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
              setIsStatusError(true);
              setStatus('No active dancefloor at the moment.');
              setDancefloorId(null);
            } else {
              setDancefloorId(data.dancefloorId);
              setIsStatusError(false);
              setStatus('Active dancefloor is live.');

              if (!data.isDjLoggedIn) {
                router.push({
                  pathname: `/dancefloor/${data.dancefloorId}`,
                  query: { djId: djId },
                });
              }
            }
            setQrCodeUrl(data.qrCode);
            setProfilePic(data.profilePicUrl || null);
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
            setPastDancefloors(data);
          }
        })
        .catch((error) => {
          if (isMounted) {
            console.error('Error fetching DJ data:', error);
            setIsStatusError(true);
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
          setIsStatusError(false);
          setStatus('Dancefloor started successfully.');
          router.push({
            pathname: `/dancefloor/${data.dancefloorId}`,
            query: { djId: djId },
          });
        })
        .catch(() => {
          setIsStatusError(true);
          setStatus('Error starting dancefloor.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };


  const domainRegex = /^(https?:\/\/)?(www\.)?([\w-]+\.)+[\w-]{2,}\/?$/;

  const handleEditInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus('');
    setIsStatusVisible(false);
    setIsStatusError(false);

    let formattedWebsite = website.trim();

    // Add protocol if it's missing
    if (!formattedWebsite.startsWith('http://') && !formattedWebsite.startsWith('https://')) {
      formattedWebsite = `http://${formattedWebsite}`;
    }

    // Validate the URL without the protocol for regex matching
    const withoutProtocol = formattedWebsite.replace(/(^\w+:|^)\/\//, '');
    if (!domainRegex.test(withoutProtocol)) {
      setIsStatusError(true);
      setStatus('Please enter a valid website (e.g., www.example.com).');
      setIsStatusVisible(true);
      return;
    }

    // Remove unnecessary trailing slashes
    try {
      const url = new URL(formattedWebsite);
      formattedWebsite = url.origin + url.pathname; // Avoid double slashes
    } catch (err) {
      setIsStatusError(true);
      setStatus('Please enter a valid website (e.g., www.example.com).');
      setIsStatusVisible(true);
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
        setIsStatusError(false);
        setStatus('DJ info updated successfully.');
        setIsStatusVisible(true);
        setIsEditing(false);
      } else {
        setIsStatusError(true);
        setStatus('Error updating DJ info.');
        setIsStatusVisible(true);
      }
    } catch (error) {
      console.error('Error updating DJ info:', error);
      setIsStatusError(true);
      setStatus('Error updating DJ info.');
      setIsStatusVisible(true);
    }
  };


  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
  
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
    const url = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
  
    if (!preset || !url) {
      console.error('Cloudinary configuration is missing');
      return;
    }
  
    formData.append('file', file);
    formData.append('upload_preset', preset); // required for unsigned uploads
  
    setUploading(true);
  
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
  
      const data = await res.json();
      if (res.ok) {
        setProfilePic(data.secure_url);
        setIsStatusError(false);
        setStatus('Profile picture uploaded successfully.');
        setIsStatusVisible(true);
      } else {
        setIsStatusError(true);
        setStatus('Upload failed.');
        setIsStatusVisible(true);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setIsStatusError(true);
      setStatus('Failed to upload profile picture.');
    } finally {
      setUploading(false);
    }
  };
  

  const saveProfilePic = async () => {
    if (!profilePic || !djId) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dj/${djId}/profile-pic`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_pic_url: profilePic }),
      });

      if (res.ok) {
        setStatus('Profile picture updated successfully.');
        setIsStatusVisible(true);
        setIsEditingProfilePic(false); // Reset to view mode
      } else {
        setStatus('Failed to save profile picture.');
        setIsStatusVisible(true);
      }
    } catch (error) {
      console.error('Error saving profile picture:', error);
      setStatus('Error saving profile picture.');
      setIsStatusVisible(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center px-6 py-8 relative">
      <div className="absolute top-0 right-2 md:top-7 md:right-12">
        <LogoutButton />
      </div>

      <div className="w-full max-w-6xl bg-gray-700 shadow-xl rounded-lg p-8 space-y-8 md:flex md:space-x-8 relative">
        <div className="flex flex-col items-center md:w-1/3">
          <p className="text-4xl font-semibold text-center mb-8">{djName || 'DJ Profile'}</p>


          <img
            src={profilePic || '/images/profile_placeholder.jpg'} 
            alt="Profile Picture"
            className="w-40 h-40 rounded-full object-cover mb-4"
          />

          {!isEditingProfilePic ? (
            <button
              onClick={() => setIsEditingProfilePic(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded font-semibold"
            >
              Update Profile Pic
            </button>
          ) : (
            <>
              {/* hidden file input for styling outside of browser/OS default */}
              <input 
                type="file" 
                id="file-upload" 
                onChange={handleProfilePicUpload} 
                className="hidden" 
              />
              <label
                htmlFor="file-upload"
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-2 px-4 rounded mb-4 cursor-pointer"
              >
                Choose File
              </label>
              <button
                onClick={saveProfilePic}
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-2 px-4 rounded"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Save Profile Picture'}
              </button>
              <button
                onClick={() => setIsEditingProfilePic(false)} // Cancel button
                className="bg-red-500 text-white py-2 px-4 rounded mt-2"
              >
                Cancel
              </button>
            </>
          )}

          {qrCodeUrl && (
            <img
              src={qrCodeUrl}
              alt="DJ QR Code"
              className="w-40 h-40 object-contain mt-4"
            />
          )}

          <AnimatePresence>
            {isStatusVisible && (
              <motion.p
                className={`font-bold absolute top-6 right-7 ${isStatusError ? 'text-red-400' : 'text-main'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ type: 'tween', duration: 0.5, ease: 'easeInOut' }}
              >
                {status}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <p className="text-2xl font-bold">Bio</p>
            {isEditing ? (
              <textarea
                value={bio || ''}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 text-gray-600 font-semibold border border-gray-300 rounded-md"
              />
            ) : (
              <p className='font-semibold text-gray-400'>{bio || 'No bio available'}</p>
            )}
          </div>

          <div>
            <p className="text-2xl font-bold">Website</p>
            {isEditing ? (
              <input
                type="text"
                value={website || ''}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full p-2 text-gray-600 font-semibold border border-gray-300 rounded-md"
              />
            ) : (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-main font-semibold"
              >
                {website || 'No website available'}
              </a>
            )}
          </div>

          <div>
            <p className="text-2xl font-bold">Social Media</p>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={instagramHandle || ''}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="Instagram"
                  className="w-full p-2 text-gray-600 font-semibold border border-gray-300 rounded-md mb-2"
                />
                <input
                  type="text"
                  value={twitterHandle || ''}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  placeholder="Twitter"
                  className="w-full p-2 text-gray-600 font-semibold border border-gray-300 rounded-md mb-2"
                />
              </>
            ) : (
              <div className='font-semibold text-gray-400'>
                <p>Instagram: {instagramHandle}</p>
                <p>Twitter: {twitterHandle}</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-2xl font-bold">Payment Handles</p>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={venmoHandle || ''}
                  onChange={(e) => setVenmoHandle(e.target.value)}
                  placeholder="Venmo"
                  className="w-full p-2 text-gray-600 font-semibold border border-gray-300 rounded-md mb-2"
                />
                <input
                  type="text"
                  value={cashappHandle || ''}
                  onChange={(e) => setCashappHandle(e.target.value)}
                  placeholder="CashApp"
                  className="w-full p-2 text-gray-600 font-semibold border border-gray-300 rounded-md"
                />
              </>
            ) : (
              <div className='font-semibold text-gray-400'>
                <p>Venmo: {venmoHandle}</p>
                <p>CashApp: {cashappHandle}</p>
              </div>
            )}
          </div>

          <div className="flex text-white font-bold text-xl">
            {isEditing ? (
              <button
                onClick={handleEditInfo}
                className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-4 rounded-lg"
              >
                Save Info
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-lg"
              >
                Edit Info
              </button>
            )}
          </div>

          <div className="flex text-xl text-white font-bold">
            {dancefloorId ? (
              <Link
                href={{
                  pathname: `/dancefloor/${dancefloorId}`,
                  query: { djId },
                }}
                className="w-full"
              >
                <button
                  className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-4 px-4 rounded-lg"
                  disabled={isLoading}
                >
                  Go to Active Dancefloor
                </button>
              </Link>
            ) : (
              <button
                onClick={startDancefloor}
                className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 py-4 px-4 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Starting...' : 'Start Dancefloor'}
              </button>
            )}
          </div>

          <p className="text-2xl font-bold pt-4">Past Dancefloors</p>
          <ul className="list-disc list-inside space-y-2 h-96 pb-16 overflow-y-scroll">
            {pastDancefloors.length > 0 ? (
              pastDancefloors.map((dancefloor) => (
                <li key={dancefloor.id}>
                  <Link
                    href={`/dancefloor/${dancefloor.id}/details`}
                    className="text-main font-bold text-xl"
                  >
                    Dancefloor {dancefloor.id}
                  </Link>
                  <div className='ml-0 md:ml-64'>
                    <p className='italic'> - started {format(new Date(dancefloor.created_at), 'MMMM d, yyyy, h:mm a')}</p>
                    <p className='italic'> - ended {format(new Date(dancefloor.ended_at), 'MMMM d, yyyy, h:mm a')}</p>
                  </div>
                </li>
              ))
            ) : (
              <p>No past dancefloors found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DjIdPage;
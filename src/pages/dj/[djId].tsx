import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import LogoutButton from '../../components/LogoutButton';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../../components/UI/Button'
import { useSession } from 'next-auth/react';

interface Dancefloor {
  id: string;
  dj_id: string;
  created_at: string;
  ended_at: string;
  status: string;
  requests_count: number;
  messages_count: number;
}

const DjIdPage: React.FC = () => {
  const router = useRouter();
  const { djId, redirect } = router.query;
  const { data: session, status } = useSession();
  const [statusMessage, setStatusMessage] = useState<string>('Loading...');
  const [isStatusMessageVisible, setIsStatusMessageVisible] = useState<boolean>(false);
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
  const [pastDancefloors, setPastDancefloors] = useState<Dancefloor[]>([]);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (statusMessage) {
      setIsStatusMessageVisible(true);
      const timer = setTimeout(() => {
        setIsStatusMessageVisible(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [statusMessage]);


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
              setStatusMessage('No active dancefloor at the moment.');
              setDancefloorId(null);
            } else {
              setDancefloorId(data.dancefloorId);
              setIsStatusError(false);
              setStatusMessage('Active dancefloor is live.');
              if (redirect === 'dancefloor') {
                router.push(`/dancefloor/${data.dancefloorId}`);
              }
            }
            setQrCodeUrl(data.qrCode);
            setProfilePic(data.profilePicUrl || null);
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
            setIsStatusError(true);
            setStatusMessage('Error fetching data.');
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [djId, backendUrl, router]);


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
          setStatusMessage('Dancefloor started successfully.');
          router.push(`/dancefloor/${data.dancefloorId}`);
        })
        .catch(() => {
          setIsStatusError(true);
          setStatusMessage('Error starting dancefloor.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };


  const domainRegex = /^(https?:\/\/)?(www\.)?([\w-]+\.)+[\w-]{2,}\/?$/;

  const handleEditInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatusMessage('');
    setIsStatusMessageVisible(false);
    setIsStatusError(false);

    let formattedWebsite = website.trim();

    // add protocol if it's missing
    if (!formattedWebsite.startsWith('http://') && !formattedWebsite.startsWith('https://')) {
      formattedWebsite = `http://${formattedWebsite}`;
    }

    // validate the URL w/o the protocol for regex matching
    const withoutProtocol = formattedWebsite.replace(/(^\w+:|^)\/\//, '');
    if (!domainRegex.test(withoutProtocol)) {
      setIsStatusError(true);
      setStatusMessage('Please enter a valid website (e.g., www.example.com).');
      setIsStatusMessageVisible(true);
      return;
    }

    // remove unnecessary trailing slashes
    try {
      const url = new URL(formattedWebsite);
      formattedWebsite = url.origin + url.pathname; // avoid double slashes
    } catch {
      setIsStatusError(true);
      setStatusMessage('Please enter a valid website (e.g., www.example.com).');
      setIsStatusMessageVisible(true);
      return;
    }
    try {
      const res = await fetch(`${backendUrl}/api/dj/${djId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio,
          name: djName,
          website: formattedWebsite,
          instagramHandle,
          twitterHandle,
          venmoHandle,
          cashappHandle,
        }),
      });

      if (res.ok) {
        setIsStatusError(false);
        setStatusMessage('DJ info updated successfully.');
        setIsStatusMessageVisible(true);
        setIsEditing(false);
      } else {
        setIsStatusError(true);
        setStatusMessage('Error updating DJ info.');
        setIsStatusMessageVisible(true);
      }
    } catch (error) {
      console.error('Error updating DJ info:', error);
      setIsStatusError(true);
      setStatusMessage('Error updating DJ info.');
      setIsStatusMessageVisible(true);
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
        setStatusMessage('Profile picture uploaded successfully.');
        setIsStatusMessageVisible(true);
      } else {
        setIsStatusError(true);
        setStatusMessage('Upload failed.');
        setIsStatusMessageVisible(true);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setIsStatusError(true);
      setStatusMessage('Failed to upload profile picture.');
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
        setStatusMessage('Profile picture updated successfully.');
        setIsStatusMessageVisible(true);
        setIsEditingProfilePic(false);
      } else {
        setStatusMessage('Failed to save profile picture.');
        setIsStatusMessageVisible(true);
      }
    } catch (error) {
      console.error('Error saving profile picture:', error);
      setStatusMessage('Error saving profile picture.');
      setIsStatusMessageVisible(true);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center px-6 py-8 relative">
      
      
      <div className="hidden xl:block absolute top-0 right-2 md:top-10 md:right-14">
        <LogoutButton />
      </div>

      {session && 
        <div className='bg-gray-700 mb-4 p-6 rounded-md w-full max-w-6xl flex flex-col items-center space-y-3'>
          <p className='text-3xl font-bold'>Welcome to Crowdwork!</p>
          <p className='text-lg font-semibold'>
            Crowdwork is designed to be a platform where users can interact with DJs by 
            sending song requests and messages in real-time.
          </p>
          <div className='flex flex-row items-baseline'>
            <p className='text-md font-bold whitespace-nowrap mr-2'>DJ View:</p>
            <p className='text-sm font-semibold'>Upon signing up, you will be given a QR code. You can start a dancefloor where you can recieve and view incoming song requests and messages 
            from your guests, using your QR code. You also have a profile area where you can manage profile information, which can serve as a digital business card even if there are no dancefloors active.</p>
          </div>
          <div className='flex flex-row items-baseline'>
            <p className='text-md font-bold whitespace-nowrap mr-2'>User View:</p>
            <p className='text-sm font-semibold'>Mobile users have a streamlined interface for sending song requests and messages. They can engage with the 
            DJ&apos;s playlist and make custom song requests or use results from Spotify.</p>
          </div>
        </div>
      }

      <div className="w-full max-w-6xl bg-gray-700 shadow-xl rounded-lg p-8 space-y-8 md:flex md:space-x-8 relative">
        <div className="flex flex-col items-center md:w-1/3">
          <p className="text-4xl font-semibold text-center mb-8">{djName || 'DJ Profile'}</p>

          <Image
            src={profilePic || '/images/profile_placeholder.jpg'} 
            alt="Profile Picture"
            width={200}
            height={200}
            className="w-60 h-60 rounded-sm object-cover mb-4"
          />

          {!isEditingProfilePic ? (
            <Button
              onClick={() => setIsEditingProfilePic(true)}
              className="w-60"
              bgColor="bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              Update Profile Pic
            </Button>
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
                className="flex justify-center bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-semibold py-2 px-4 rounded mb-4 cursor-pointer w-60"
              >
                Choose File
              </label>
              <Button
                onClick={saveProfilePic}
                disabled={uploading}
                className='w-60'
              >
                {uploading ? 'Uploading...' : 'Save Profile Picture'}
              </Button>
              <Button
                onClick={() => setIsEditingProfilePic(false)}
                bgColor="bg-red-500"
                className="mt-4 w-60"
              >
                Cancel
              </Button>
            </>
          )}

          {qrCodeUrl && (
            <div className='flex flex-col items-center mt-16'>
              <p className='font-semibold text-lg mb-2'>Your QR code</p>
              <Image
                src={qrCodeUrl}
                alt="DJ QR Code"
                width={200}
                height={200}
                className="w-60 h-60 object-contain"
              />
            </div>
          )}

          <AnimatePresence>
            {isStatusMessageVisible && (
              <motion.p
                className={`font-bold absolute top-6 right-7 ${isStatusError ? 'text-red-400' : 'text-main'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ type: 'tween', duration: 0.5, ease: 'easeInOut' }}
              >
                {statusMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 space-y-6">
        <div>
            {isEditing && 
            <>
             <p className="text-2xl font-bold">Name</p>
              <textarea
                value={djName || ''}
                onChange={(e) => setDjName(e.target.value)}
                className="w-full p-2 text-gray-600 font-semibold border border-gray-300 rounded-md"
              />
            </>
           }
          </div>

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
              <div className='font-semibold'>
                <div className='flex flex-row items-baseline'>
                  <p className='text-gray-400'>Instagram:</p>
                  {instagramHandle ? (
                      <a 
                      href={`https://www.instagram.com/${instagramHandle.replace(/^@/, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="ml-2 text-main"
                    >
                      {twitterHandle}
                    </a>
                    ) : (
                      <p className='text-gray-400 text-xs italic ml-2'>No IG info.</p>
                    )}
                </div>
                <div className='flex flex-row items-baseline'>
                  <p className='text-gray-400'>Twitter: </p>
                    {twitterHandle ? (
                      <a 
                      href={`https://x.com/${twitterHandle.replace(/^@/, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="ml-2 text-main"
                    >
                      {twitterHandle}
                    </a>
                    ) : (
                      <p className='text-gray-400 text-xs italic ml-2'>No Twitter info.</p>
                    )}
                </div>
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
              <div className='font-semibold'>
                <div className='flex flex-row items-baseline'>
                  <p className='text-gray-400'>Venmo:</p>
                  {venmoHandle ? (
                    <a 
                      href={`https://account.venmo.com/u/${venmoHandle.replace(/^@/, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="ml-2 text-main"
                    >
                      {venmoHandle}
                    </a>
                    ) : (
                      <p className='text-gray-400 text-xs italic ml-2'>No Venmo info.</p>
                    )}
                </div>
               <div className='flex flex-row items-baseline'>
                <p className='text-gray-400'>CashApp:</p>
                {cashappHandle ? (
                  <a 
                    href={`https://cash.app/${cashappHandle.replace(/^\$/, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-2 text-main"
                  >
                    {cashappHandle}
                  </a>
                  ) : (
                    <p className='text-gray-400 text-xs italic ml-2'>No CashApp info.</p>
                  )}
               </div>
              </div>
            )}
          </div>

          <div className="flex text-white font-bold text-xl">
            {isEditing ? (
              <Button
                onClick={handleEditInfo}
                padding="p-4"
                bgColor="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"
                className="w-full"
              >
                Save Info
              </Button>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                padding="p-4"
                bgColor="bg-gradient-to-r from-blue-500 to-cyan-500"
                className="w-full"
              >
                Edit Info
              </Button>
            )}
          </div>

          <div className="flex text-xl text-white font-bold">
            {dancefloorId ? (
              <Link
                href={`/dancefloor/${dancefloorId}`}
                className="w-full"
              >
                <Button
                  disabled={isLoading}
                  padding="p-4"
                  bgColor="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
                  className="w-full"
                >
                  Go to Active Dancefloor
                </Button>
              </Link>
            ) : (
              <Button
                onClick={startDancefloor}
                className="w-full"
                padding="p-4"
                bgColor="bg-gradient-to-r from-emerald-400 to-cyan-400"
                disabled={isLoading}
              >
                {isLoading ? "Starting..." : "Start Dancefloor"}
              </Button>
            )}
          </div>

          <p className="text-2xl font-bold">Past Dancefloors</p>
          <ul className="space-y-2 h-96 pb-16 overflow-y-scroll scrollbar-thin">
            {pastDancefloors.length > 0 ? (
              pastDancefloors.map((dancefloor) => (
                <li key={dancefloor.id}>
                  <Link
                    href={`/dancefloor/${dancefloor.id}/details`}
                    className="text-main font-bold text-xl"
                  >
                    Dancefloor {dancefloor.id}
                  </Link>
                  <div className='ml-0 md:ml-0'>
                    <p className='italic'>- Started: {format(new Date(dancefloor.created_at), 'MMMM d, yyyy, h:mm a')}</p>
                    <p className='italic'>- Ended: {format(new Date(dancefloor.ended_at), 'MMMM d, yyyy, h:mm a')}</p>
                    <p className='italic'>- Requests: {dancefloor.requests_count}</p>
                    <p className='italic'>- Messages: {dancefloor.messages_count}</p>
                  </div>
                </li>
              ))
            ) : (
              <p className='text-gray-500 italic ml-6'>No past dancefloors found yet...</p>
            )}
          </ul>
          <div className='block xl:hidden'>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DjIdPage;
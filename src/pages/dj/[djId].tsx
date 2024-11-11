import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import LogoutButton from '../../components/LogoutButton';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Modal from '../../components/UI/Modal';
import { useSession, signOut } from 'next-auth/react';
import Notification from '../../components/UI/Notification';

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
  const { data: session } = useSession();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { djId, redirect } = router.query;
  const [notification, setNotification] = useState({ message: '', isVisible: false, isError: false });
  const [ dancefloorId, setDancefloorId ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ qrCodeUrl, setQrCodeUrl ] = useState<string | null>(null);
  const [ djName, setDjName ] = useState<string>('');
  const [ bio, setBio ] = useState<string>('');
  const [ website, setWebsite ] = useState<string>('');
  const [ instagramHandle, setInstagramHandle ] = useState<string>('');
  const [ twitterHandle, setTwitterHandle ] = useState<string>('');
  const [ venmoHandle, setVenmoHandle ] = useState<string>('');
  const [ cashappHandle, setCashappHandle ] = useState<string>('');
  const [ isEditing, setIsEditing ] = useState<boolean>(false);
  const [ isEditingProfilePic, setIsEditingProfilePic ] = useState<boolean>(false);
  const [ pastDancefloors, setPastDancefloors ] = useState<Dancefloor[]>([]);
  const [ profilePic, setProfilePic ] = useState<string | null>(null);
  const [ uploading, setUploading ] = useState<boolean>(false);

  // modal with acct deletion states
  const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);
  const [ isQRModalOpen, setIsQRModalOpen ] = useState<boolean>(false);
  const [ deleteEmail, setDeleteEmail ] = useState<string>('');
  const [ deletePassword, setDeletePassword ] = useState<string>('');
  const [ isDeleting, setIsDeleting ] = useState<boolean>(false);


  const showNotification = (message: string, isError = false) => {
    setNotification({ message, isVisible: true, isError });
    setTimeout(() => setNotification((prev) => ({ ...prev, isVisible: false })), 3000);
  };
  
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
              setDancefloorId(null);
            } else {
              setDancefloorId(data.dancefloorId);
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
            showNotification("Error fetching data.", true);
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
          showNotification("Dancefloor started successfully.", false);
        })
        .catch(() => {
          showNotification("Error starting dancefloor.", true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const strictDomainRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,3}$/;

  const handleEditInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    let formattedWebsite = typeof website === 'string' ? website.trim() : '';
    if (formattedWebsite && !formattedWebsite.startsWith('http://') && !formattedWebsite.startsWith('https://')) {
        formattedWebsite = `http://${formattedWebsite}`;
    }

    const withoutProtocol = formattedWebsite.replace(/(^\w+:|^)\/\//, '');
    if (formattedWebsite && !strictDomainRegex.test(withoutProtocol)) {
        showNotification("Please enter a valid website (e.g., www.example.com).", true);
        return;
    }

    try {
        const res = await fetch(`${backendUrl}/api/dj/${djId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bio: bio || '',
                name: djName || '',
                website: formattedWebsite || '',
                instagramHandle: instagramHandle || '',
                twitterHandle: twitterHandle || '',
                venmoHandle: venmoHandle || '',
                cashappHandle: cashappHandle || '',
            }),
        });

        if (res.ok) {
            showNotification("DJ info updated successfully.", false);
            setIsEditing(false);
        } else {
            showNotification("Error updating DJ info.", true);
        }
    } catch (error) {
        console.error('Error updating DJ info:', error);
        showNotification("Error updating DJ info.", true);
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
        showNotification("Profile picture uploaded successfully.", false);
      } else {
        showNotification("Upload failed.", true);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      showNotification("Failed to upload profile picture.", true);
    } finally {
      setUploading(false);
    }
  };

  const saveProfilePic = async () => {
    if (!profilePic || !djId) return;

    try {
      const res = await fetch(`${backendUrl}/api/dj/${djId}/profile-pic`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_pic_url: profilePic }),
      });

      if (res.ok) {
        showNotification("Profile picture updated successfully.", false);
        setIsEditingProfilePic(false);
      } else {
        showNotification("Failed to save profile picture.", true);
      }
    } catch (error) {
      console.error('Error saving profile picture:', error);
      showNotification("Error saving profile picture.", true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeQRModal = () => {
    setIsQRModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (!deleteEmail || !deletePassword) {
        showNotification("Email and password are both required.", true);
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/api/dj/${djId}/delete-account`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: deleteEmail,
                password: deletePassword,
            }),
        });

        const responseData = await response.json();

        if (response.ok) {
          showNotification(responseData.message || 'Account deleted successfully.', false);
          setTimeout(async () => {
              await signOut({ redirect: false });
              router.push('/login');
          }, 2000);
        } else {
            showNotification(responseData.error || 'Failed to delete account.', true);
        }
    } catch {
        showNotification('Failed to delete account due to a network error.', true);
    } finally {
        setIsDeleting(false);
    }
};

const handleLogout = async () => {
  showNotification("Logged out successfully.", false);

  setTimeout(async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch {
      showNotification("An error occurred during logout. Please try again.", true);
    }
  }, 2000);
};


  return (
    <div className="min-h-screen flex xl:items-center justify-center px-2 xl:px-6 py-2 xl:py-8 relative">
      <Notification
        showNotification={notification.isVisible}
        isError={notification.isError}
        notificationMessage={notification.message}
        onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
      />
      <div className='gradient-background'></div>
      {session && 
        <div className="absolute top-8 right-14">
          <LogoutButton handleLogout={handleLogout} />
        </div>
      }
      <div className="w-full max-w-6xl bg-gray-700 backdrop-filter backdrop-blur-lg bg-opacity-30 shadow-xl rounded-lg p-4 xl:p-8 space-y-4 xl:space-y-8 md:flex md:space-x-8 relative">
        <div className="flex flex-col items-center md:w-1/3">
          {session && <p className="text-4xl font-semibold text-center mb-0 xl:mb-8">{djName || 'Your DJ Profile'}</p>}

          <Image
            src={profilePic || '/images/profile_placeholder.jpg'}
            alt="Profile Picture"
            width={200}
            height={200}
            className="w-40 h-40 xl:w-60 xl:h-60 rounded-lg border-2 border-gray-700 object-cover mb-0 xl:mb-4"
            priority
          />

          {session && !isEditingProfilePic ? (
            <Button
              onClick={() => setIsEditingProfilePic(true)}
              className="w-60"
              fontWeight='font-semibold'
              bgColor="bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              Update Profile Pic
            </Button>
          ) : session && isEditingProfilePic ? (
            <>
              <Input 
                type="file" 
                id="file-upload" 
                onChange={handleProfilePicUpload} 
                className="hidden" 
              />
              <label
                htmlFor="file-upload"
                className="flex button-effect justify-center bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-semibold py-2 px-4 rounded-md mb-4 cursor-pointer w-60"
              >
                Choose File
              </label>
              <Button
                onClick={saveProfilePic}
                disabled={uploading}
                fontWeight='font-semibold'
                className="w-60"
              >
                {uploading ? 'Uploading...' : 'Save Profile Picture'}
              </Button>
              <Button
                onClick={() => setIsEditingProfilePic(false)}
                bgColor="bg-red-500"
                fontWeight='font-semibold'
                className="mt-4 w-60"
              >
                Cancel
              </Button>
            </>
          ) : null}

          {session && qrCodeUrl && (
            <div className="flex flex-col items-center mt-16 absolute bottom-80">
              <p className="font-semibold text-lg mb-2">Your QR code</p>
              <Image
                src={qrCodeUrl}
                alt="DJ QR Code"
                width={200}
                height={200}
                className="w-60 h-60 object-contain cursor-pointer"
                onClick={() => setIsQRModalOpen(true)} 
                priority
              />
              <p className='font-semibold mt-2 text-sm'>Click to enlarge/save.</p>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4 xl:space-y-6">
          <div>
            <p className="text-xl xl:text-2xl font-bold">Name</p>
            {session && isEditing ? (
              <Input
                value={djName}
                placeholder='Enter DJ name...'
                className='placeholder:text-sm'
                onChange={(e) => setDjName(e.target.value)}
              />
            ) : (
              <p className={`font-semibold text-gray-400 ${!djName && 'italic ml-1 text-sm'}`}>{djName || 'No DJ Name entered.'}</p>
            )}
          </div>

          <div>
            <p className="text-xl xl:text-2xl font-bold">Bio</p>
            {session && isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder='Enter bio (500 character maximum)...'
                maxLength={500}
                className="w-full min-h-10 break-words h-36 rounded-md backdrop-blur bg-gray-700/40 text-white p-2 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-main placeholder-gray-500 placeholder:text-sm"
              />
            ) : (
              <p className={`font-semibold break-all ${bio ? 'text-gray-400' : 'text-gray-400 italic ml-1 text-sm'}`}>
                {bio || 'No bio entered.'}
              </p>
            )}
          </div>


          <div>
            <p className="text-xl xl:text-2xl font-bold">Website</p>
            {session && isEditing ? (
              <Input
                type="text"
                value={website}
                placeholder='Enter valid website...'
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full placeholder:text-sm"
              />
            ) : website ? (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link font-semibold"
              >
                {website}
              </a>
            ) : (
              <p className="text-gray-400 text-sm italic ml-1 font-semibold">No website entered.</p>
            )}
          </div>
          <div>
            <p className="text-xl xl:text-2xl font-bold">Social Media</p>
            <div className="font-semibold">
              <div className="flex flex-row items-baseline">
                <p className="text-gray-400">Instagram:</p>
                {session && isEditing ? (
                  <Input
                    type="text"
                    value={instagramHandle}
                    className='ml-2 mb-2 placeholder:text-sm'
                    placeholder={`Instagram handle (include @ symbol)...`}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                  />
                ) : instagramHandle ? (
                  <a 
                    href={`https://www.instagram.com/${instagramHandle.replace(/^@/, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-2 text-link"
                  >
                    {instagramHandle}
                  </a>
                ) : (
                  <p className="text-gray-400 text-xs italic ml-2">No IG info.</p>
                )}
              </div>
              <div className="flex flex-row items-baseline">
                <p className="text-gray-400">Twitter:</p>
                {session && isEditing ? (
                  <Input
                    type="text"
                    value={twitterHandle}
                    className='ml-2 placeholder:text-sm'
                    placeholder={`Twitter handle (include @ symbol)...`}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                  />
                ) : twitterHandle ? (
                  <a 
                    href={`https://x.com/${twitterHandle.replace(/^@/, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-2 text-link"
                  >
                    {twitterHandle}
                  </a>
                ) : (
                  <p className="text-gray-400 text-xs italic ml-2">No Twitter info.</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xl xl:text-2xl font-bold">Payment Handles</p>
            <div className="font-semibold">
              <div className="flex flex-row items-baseline">
                <p className="text-gray-400">Venmo:</p>
                {session && isEditing ? (
                  <Input
                    type="text"
                    value={venmoHandle}
                    className='ml-2 mb-2 placeholder:text-sm'
                    placeholder={`Venmo handle (include @ symbol)...`}
                    onChange={(e) => setVenmoHandle(e.target.value)}
                  />
                ) : venmoHandle ? (
                  <a 
                    href={`https://account.venmo.com/u/${venmoHandle.replace(/^@/, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-2 text-link"
                  >
                    {venmoHandle}
                  </a>
                ) : (
                  <p className="text-gray-400 text-xs italic ml-2">No Venmo info.</p>
                )}
              </div>
              <div className="flex flex-row items-baseline">
                <p className="text-gray-400">CashApp:</p>
                {session && isEditing ? (
                  <Input
                    type="text"
                    value={cashappHandle}
                    className='ml-2 placeholder:text-sm'
                    placeholder={`CashApp Cashtag (include $ symbol)...`}
                    onChange={(e) => setCashappHandle(e.target.value)}
                  />
                ) : cashappHandle ? (
                  <a 
                    href={`https://cash.app/${cashappHandle.replace(/^\$/, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-2 text-link"
                  >
                    {cashappHandle}
                  </a>
                ) : (
                  <p className="text-gray-400 text-xs italic ml-2">No CashApp info.</p>
                )}
              </div>
            </div>
          </div>

          {session && (
            <div className="flex text-white font-bold text-xl w-full">
              {isEditing ? (
                <div className="w-full grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => setIsEditing(false)}
                    padding="p-4"
                    bgColor="bg-gradient-to-r from-red-500/90 to-orange-600/90"
                  >
                    Cancel Edit
                  </Button>
                  <Button
                    onClick={handleEditInfo}
                    padding="p-4"
                    bgColor="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"
                  >
                    Save Info
                  </Button>
                </div>
              ) : (
                <div className="w-full grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => setIsEditing(true)}
                    padding="p-4"
                    bgColor="bg-gradient-to-r from-blue-500 to-cyan-500"
                  >
                    Edit Info
                  </Button>
                  <Button onClick={() => setIsModalOpen(true)} padding="p-4" bgColor="bg-gradient-to-r from-red-500/90 to-orange-600/90">
                    Delete Account
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="flex text-xl text-white font-bold">
            {dancefloorId ? (
              <Link href={`/dancefloor/${dancefloorId}`} className="w-full">
                <Button
                  disabled={isLoading}
                  padding="p-4"
                  bgColor="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
                  className="w-full"
                >
                  Go to Active Dancefloor
                </Button>
              </Link>
            ) : session ? (
              <Button
                onClick={startDancefloor}
                className="w-full"
                padding="p-4"
                bgColor="bg-gradient-to-r from-emerald-400 to-cyan-400"
                disabled={isLoading}
              >
                {isLoading ? "Starting..." : "Start Dancefloor"}
              </Button>
            ) : null}
          </div>

          {session && (
            <>
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
                      <div className="ml-0 md:ml-0">
                        <p className="italic">- Started: {format(new Date(dancefloor.created_at), 'MMMM d, yyyy, h:mm a')}</p>
                        <p className="italic">- Ended: {format(new Date(dancefloor.ended_at), 'MMMM d, yyyy, h:mm a')}</p>
                        <p className="italic">- Requests: {dancefloor.requests_count}</p>
                        <p className="italic">- Messages: {dancefloor.messages_count}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 italic ml-6">No past dancefloors found yet...</p>
                )}
              </ul>
            </>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="relative space-y-4">
          <div className='flex flex-col items-start'>
            <p className="text-3xl font-bold">You sure?</p>
            <p className="font-semibold text-sm">Please enter your email and password to confirm.</p>
          </div>
          <Input
            type="email"
            placeholder="Email"
            value={deleteEmail}
            onChange={(e) => setDeleteEmail(e.target.value)}
            className="p-4"
          />
          <Input
            type="password"
            placeholder="Password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="p-4"
          />
          <Button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            bgColor="bg-gradient-to-r from-red-500/90 to-orange-600/90"
            padding='py-4'
            fontWeight='font-semibold'
            className="w-full"
          >
            Confirm Delete
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isQRModalOpen} onClose={closeQRModal}>
        <div className="w-full p-4">
        {qrCodeUrl && (
          <div className='w-full'>
            <img
              src={qrCodeUrl}
              alt="DJ QR Code"
              className="object-contain mb-4"
              style={{ width: '500px', height: '500px' }}
            />
            <Button padding='py-3' className='w-full'>
              <a
                href={qrCodeUrl}
                download="DJ-QR-Code.png"
              >
                Save QR Code
              </a>
            </Button>
          </div>
        )}
        </div>
      </Modal>
    </div>
  );
};

export default DjIdPage;
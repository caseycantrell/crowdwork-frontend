import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Button from '../UI/Button'

interface DJInfo {
  id: string;
  name: string;
  bio: string;
  website: string;
  instagram_handle: string;
  twitter_handle: string;
  venmo_handle: string;
  cashapp_handle: string;
  qr_code: string;
  profile_pic_url: string;
}

const DJInfoComponent: React.FC<{
  djInfo: DJInfo | null;
  djInfoError: string | null;
  handleStopDancefloor: () => void;
  songRequest: string;
  setSongRequest: (value: string) => void;
  handleSendSongRequest: () => void;
  isChatVisible: boolean;
  setIsChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  djInfo,
  djInfoError,
  handleStopDancefloor,
  isChatVisible,
  setIsChatVisible,
}) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const handleMouseEnter = (button: string) => {
    setHoveredButton(button);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  return (
    <div className="col-span-1 lg:col-span-3 bg-gray-700 p-4">
      {djInfo ? (
        <div className="flex flex-row items-center justify-between h-full">
          <div className="flex flex-row items-center">
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 overflow-hidden rounded-lg">
              <Image
                src={djInfo.profile_pic_url || '/images/profile_placeholder.jpg'}
                width={160}
                height={160}
                alt="Profile Pic"
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="mt-2">
              <Link href={`/dj/${djInfo.id}`}>
                <Button className="w-40">Go to DJ Page</Button>
              </Link>
            </div>
          </div>
            <div className="flex flex-col justify-center ml-6 font-medium gap-y-1">
              <p className="text-3xl font-bold">
                {djInfo.name ? djInfo.name : "No name for this DJ yet."}
              </p>
              {djInfo.website && (
                <a
                  href={djInfo.website || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="font-semibold">{djInfo.website}</p>
                </a>
              )}
              {djInfo.instagram_handle && 
                <div>
                  <a href={`https://www.instagram.com/${djInfo.instagram_handle.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center"> 
                    <Image src={'/icons/instagram.png'} className="invert" width={26} height={26} alt='Instagram' />
                    <p className="font-semibold ml-2 text-lg">{djInfo.instagram_handle}</p>
                  </a>
                </div>
              }
              {djInfo.twitter_handle && 
                <div>
                  <a href={`https://x.com/${djInfo.twitter_handle.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center"> 
                    <Image src={'/icons/twitter.png'} className="invert rounded-md" width={26} height={26} alt='Twitter' />
                    <p className="font-semibold ml-2 text-lg">{djInfo.twitter_handle}</p>
                  </a>
                </div>
              }
              {djInfo.venmo_handle && 
                <div>
                  <a href={`https://account.venmo.com/u/${djInfo.venmo_handle.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center"> 
                    <Image src={'/icons/venmo.png'} className="invert rounded-md" width={26} height={26} alt='Venmo' />
                    <p className="font-semibold ml-2 text-lg">{djInfo.venmo_handle}</p>
                  </a>
                </div>
              }
              {djInfo.cashapp_handle && 
                <div>
                  <a href={`https://cash.app/${djInfo.cashapp_handle.replace(/^\$/, '')}`} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center"> 
                    <Image src={'/icons/cashapp.png'} width={26} height={26} alt='CashApp' />
                    <p className="font-semibold ml-2.5 text-lg">{djInfo.cashapp_handle}</p>
                  </a>
                </div>
              }
            </div>
          </div>

        <div className="flex flex-row items-center">
            <div className="flex flex-col items-center justify-center gap-y-8">
                <div className="relative flex items-center">
                    <AnimatePresence>
                    {hoveredButton === "stop" && (
                        <motion.p
                            className="absolute -left-36 text-white font-bold"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ type: "tween", duration: 0.5 }}
                            >
                            Stop Dancefloor
                        </motion.p>
                    )}
                    </AnimatePresence>
                    <Button
                      bgColor="" 
                      padding=""
                      className=""
                      onClick={handleStopDancefloor}
                      onMouseEnter={() => handleMouseEnter("stop")}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Image
                        src={"/icons/stop.png"}
                        height={60}
                        width={60}
                        alt="Stop Dancefloor"
                        className="invert"
                      />
                    </Button>
                </div>
                <div className="relative flex items-center">
                    <AnimatePresence>
                    {hoveredButton === "chat" && (
                        <motion.p
                            className="absolute -left-28 text-white font-bold"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ type: "tween", duration: 0.5 }}
                            >
                            {isChatVisible ? "Hide Chat" : "Open Chat"}
                        </motion.p>
                    )}
                    </AnimatePresence>
                    <Button
                      bgColor=""
                      padding=""
                      className=""
                      onClick={() => setIsChatVisible(!isChatVisible)}
                      onMouseEnter={() => handleMouseEnter("chat")}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Image
                        src={"/icons/chat.png"}
                        height={60}
                        width={60}
                        alt="Open Chat"
                        className="invert"
                      />
                    </Button>
                </div>
            </div>
            <img
              src={djInfo.qr_code}
              alt="QR Code"
              className="w-52 h-52 ml-8"
            />
          </div>
        </div>
      ) : djInfoError ? (
        <p style={{ color: "red" }}>{djInfoError}</p>
      ) : (
        <p>Loading DJ information...</p>
      )}

      <style>{`
        .invert {
          filter: invert(4);
        }
      `}</style>
    </div>
  );
};

export default DJInfoComponent;
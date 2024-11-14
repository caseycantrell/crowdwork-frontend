import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Button from '../UI/Button'
import { DJInfo } from "@/types/types";
import { instagramIcon, twitterIcon, venmoIcon, cashappIcon, stopIconAlt, chatIcon } from "@/icons";

const DJInfoComponent: React.FC<{
  djInfo: DJInfo | null;
  djInfoError: string | null;
  isChatVisible: boolean;
  setIsChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsStopDancefloorModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsQRModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  djInfo,
  djInfoError,
  isChatVisible,
  setIsChatVisible,
  setIsStopDancefloorModalOpen,
  setIsQRModalOpen
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
                <Button className="w-40" bgColor="bg-gradient-to-r from-emerald-400 to-cyan-500 ">Go to DJ Page</Button>
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
                    <Image src={instagramIcon} aria-label="Instagram" className="invert" width={26} height={26} alt='Instagram' />
                    <p className="font-semibold ml-2 text-lg">{djInfo.instagram_handle}</p>
                  </a>
                </div>
              }
              {djInfo.twitter_handle && 
                <div>
                  <a href={`https://x.com/${djInfo.twitter_handle.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center"> 
                    <Image src={twitterIcon} aria-label="Twitter" className="invert rounded-md" width={26} height={26} alt='Twitter' />
                    <p className="font-semibold ml-2 text-lg">{djInfo.twitter_handle}</p>
                  </a>
                </div>
              }
              {djInfo.venmo_handle && 
                <div>
                  <a href={`https://account.venmo.com/u/${djInfo.venmo_handle.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center"> 
                    <Image src={venmoIcon} aria-label="Venmo" className="invert rounded-md" width={26} height={26} alt='Venmo' />
                    <p className="font-semibold ml-2 text-lg">{djInfo.venmo_handle}</p>
                  </a>
                </div>
              }
              {djInfo.cashapp_handle && 
                <div>
                  <a href={`https://cash.app/${djInfo.cashapp_handle.replace(/^\$/, '')}`} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center"> 
                    <Image src={cashappIcon} aria-label="CashApp" width={26} height={26} alt='CashApp' />
                    <p className="font-semibold ml-2.5 text-lg">{djInfo.cashapp_handle}</p>
                  </a>
                </div>
              }
            </div>
          </div>

        <div className="flex flex-row items-center">
            <div className="flex flex-col items-center justify-center gap-y-8">
                <div className="relative flex flex-row items-center">
                    <AnimatePresence>
                    {hoveredButton === "stop" && (
                        <motion.p
                            className="absolute -left-40 text-white font-bold"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ type: "tween", duration: 0.5 }}
                            >
                            Stop Dancefloor
                        </motion.p>
                    )}
                    </AnimatePresence>
                    <button
                      aria-label="Stop Dancefloor"
                      onClick={() => setIsStopDancefloorModalOpen(true)}
                      onMouseEnter={() => handleMouseEnter("stop")}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Image
                        src={stopIconAlt}
                        height={60}
                        width={60}
                        alt="Stop Dancefloor"
                        className="invert mr-1"
                      />
                    </button>
                </div>
                <div className="relative flex flex-row items-center">
                  <AnimatePresence>
                    {hoveredButton === "chat" && (
                        <motion.p
                            className="absolute ml-2 -left-32 text-white font-bold"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ type: "tween", duration: 0.5 }}
                            >
                            {isChatVisible ? "Hide Chat" : "Open Chat"}
                        </motion.p>
                    )}
                  </AnimatePresence>
                  <button
                    aria-label="Open Chat"
                    onClick={() => setIsChatVisible(!isChatVisible)}
                    onMouseEnter={() => handleMouseEnter("chat")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Image
                      src={chatIcon}
                      height={60}
                      width={60}
                      alt="Open Chat"
                      className="invert"
                    />
                  </button>
                </div>
            </div>
            {djInfo?.qr_code && (
              <Image
                onClick={() => setIsQRModalOpen(true)}
                src={djInfo.qr_code}
                width={150}
                height={150}
                alt="QR Code"
                className="w-52 h-52 ml-8 cursor-pointer"
              />
            )}
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
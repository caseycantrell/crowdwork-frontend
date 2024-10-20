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
  songRequest,
  setSongRequest,
  handleSendSongRequest,
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
            <div className="w-36 h-36 overflow-hidden rounded-lg">
              <Image
                src={djInfo.profile_pic_url || '/images/profile_placeholder.jpg'}
                width={160}
                height={160}
                alt="Profile Pic"
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="mt-4">
              <Link href={`/dj/${djInfo.id}`}>
                <Button>Go to DJ Page</Button>
              </Link>
            </div>
          </div>
            <div className="flex flex-col justify-center ml-6 font-medium">
              <p className="text-3xl font-bold">
                {djInfo.name ? djInfo.name : "No name for this DJ yet."}
              </p>
              {djInfo.website && (
                <a
                  href={djInfo.website || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {djInfo.website}
                </a>
              )}
              {djInfo.instagram_handle && <p>IG: {djInfo.instagram_handle}</p>}
              {djInfo.twitter_handle && <p>Twitter: {djInfo.twitter_handle}</p>}
              {djInfo.venmo_handle && <p>Venmo: {djInfo.venmo_handle}</p>}
              {djInfo.cashapp_handle && <p>CashApp: {djInfo.cashapp_handle}</p>}
              <p>Bio: {djInfo.bio || "No bio for this DJ yet."}</p>
            </div>
          </div>



          {/* SONG REQUEST PLACEHOLDER */}
          <div className="flex flex-col">
            {"**ignore me i am a placeholder**"}
            <input
              type="text"
              value={songRequest}
              onChange={(e) => setSongRequest(e.target.value)}
              placeholder="Enter your song request here brotha"
              className="h-10 rounded-md px-2 font-bold text-gray-500"
            />
            <Button
              onClick={handleSendSongRequest}
              bgColor="bg-gradient-to-r from-cyan-500 to-blue-500"
              fontWeight="font-bold"
              className="mt-2"
            >
              Send Song Request
            </Button>
          </div>
          {/* END SONG REQUEST PLACEHOLDER */}



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
              alt="Profile Pic"
              className="w-48 h-48 ml-8"
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
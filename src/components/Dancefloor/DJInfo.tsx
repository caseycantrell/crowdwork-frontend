import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface DJInfo {
  name: string;
  bio: string;
  website: string;
  instagramHandle: string;
  twitterHandle: string;
  venmoHandle: string;
  cashappHandle: string;
  qrCode: string;
}

const DJInfoComponent: React.FC<{
  djInfo: DJInfo | null;
  djError: string | null;
  djId: string | undefined;
  handleStopDancefloor: () => void;
  songRequest: string;
  setSongRequest: (value: string) => void;
  handleSendSongRequest: () => void;
  isChatVisible: boolean;
  setIsChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  djId,
  djInfo,
  djError,
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
              <img
                src={djInfo.qrCode}
                alt="DJ QR Code"
                className="w-36 h-36"
              />
              <div className="mt-4">
                <Link
                  href={`/dj/${djId}`}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md px-5 py-3 font-semibold"
                >
                  Go to DJ Page
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-center ml-6">
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
              {djInfo.instagramHandle && <p>IG: {djInfo.instagramHandle}</p>}
              {djInfo.twitterHandle && <p>Twitter: {djInfo.twitterHandle}</p>}
              {djInfo.venmoHandle && <p>Venmo: {djInfo.venmoHandle}</p>}
              {djInfo.cashappHandle && <p>CashApp: {djInfo.cashappHandle}</p>}
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
            <button
              onClick={handleSendSongRequest}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-2 font-bold mx-3"
            >
              Send Song Request
            </button>
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
                    <button
                        className="overflow-visible"
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
                    </button>
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
                    <button
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
                    </button>
                </div>
            </div>
            <img
              src={djInfo.qrCode}
              alt="Profile Pic"
              className="w-48 h-48 ml-8"
            />
          </div>
        </div>
      ) : djError ? (
        <p style={{ color: "red" }}>{djError}</p>
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
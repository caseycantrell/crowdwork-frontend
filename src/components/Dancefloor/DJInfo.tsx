import Link from "next/link";

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
}> = ({
  djId,
  djInfo,
  djError,
}) => {

  const djInfoWebsiteUrl =
    djInfo && (djInfo.website?.startsWith("http://") || djInfo.website?.startsWith("https://"))
      ? djInfo.website
      : djInfo
      ? `http://${djInfo.website}`
      : "";

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
              <p className="text-3xl font-bold">{djInfo.name ?  djInfo.name : "No name for this DJ yet."}</p>
              {djInfo.website && (
                <p>
                  {/* Website:{" "} */}
                  <a
                    href={djInfoWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {djInfo.website}
                  </a>
                </p>
              )}
              {djInfo.instagramHandle && (
                <p>IG: {djInfo.instagramHandle}</p>
              )}
              {djInfo.twitterHandle && <p>Twitter: {djInfo.twitterHandle}</p>}
              {djInfo.venmoHandle && <p>Venmo: {djInfo.venmoHandle}</p>}
              {djInfo.cashappHandle && <p>CashApp: {djInfo.cashappHandle}</p>}
              <p>Bio: {djInfo.bio || "No bio for this DJ yet."}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <img
              src={djInfo.qrCode}
              alt="Profile Pic"
              className="w-48 h-48"
            />
          </div>
        </div>
      ) : djError ? (
        <p style={{ color: "red" }}>{djError}</p>
      ) : (
        <p>Loading DJ information...</p>
      )}
    </div>
  );
};

export default DJInfoComponent;
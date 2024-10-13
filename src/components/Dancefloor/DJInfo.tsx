import Link from "next/link";

interface DJInfo {
  name: string;
  bio: string;
  website: string;
  instagramHandle: string;
  twitterHandle: string;
  venmoHandle: string;
  cashappHandle: string;
}

const DJInfoComponent: React.FC<{
  djInfo: DJInfo | null;
  djError: string | null;
  djId: string | undefined;
}> = ({ djInfo, djError, djId }) => {
  const djInfoWebsiteUrl =
    djInfo && (djInfo.website.startsWith("http://") || djInfo.website.startsWith("https://"))
      ? djInfo.website
      : djInfo
      ? `http://${djInfo.website}`
      : "";

  return (
    <div className="col-span-1 lg:col-span-3 bg-blue-400">
      <p className="text-2xl font-bold">DJ Information</p>
      {djInfo ? (
        <div>
          <p>Name: {djInfo.name}</p>
          <p>Bio: {djInfo.bio}</p>
          <p>
            Website:{" "}
            <a href={djInfoWebsiteUrl} target="_blank" rel="noopener noreferrer">
              {djInfo.website}
            </a>
          </p>
          <p>Instagram: {djInfo.instagramHandle}</p>
          <p>Twitter: {djInfo.twitterHandle}</p>
          <p>Venmo: {djInfo.venmoHandle}</p>
          <p>CashApp: {djInfo.cashappHandle}</p>
        </div>
      ) : djError ? (
        <p style={{ color: "red" }}>{djError}</p>
      ) : (
        <p>Loading DJ information...</p>
      )}
      {djId && (
        <Link href={`/dj/${djId}`} style={{ marginLeft: "10px" }}>
          Go to DJ Page
        </Link>
      )}
    </div>
  );
};

export default DJInfoComponent;
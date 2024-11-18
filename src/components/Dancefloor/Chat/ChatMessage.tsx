import { formatDistanceToNow } from 'date-fns';

const ChatMessage: React.FC<{ djId: string | null, message: string; createdAt: string }> = ({ djId, message, createdAt }) => {
  return (
    <div className="flex items-center justify-end my-3">
      {djId && (
        <div className="text-xs text-gray-300 font-semibold mr-2 flex-shrink-0 self-center">
          you
        </div>
      )}

      <div
        className={`relative text-white rounded-t-xl rounded-l-xl px-2.5 py-1.5 shadow-sm text-right ${
          djId
            ? "bg-gradient-to-r from-emerald-400/80 to-cyan-400/80"
            : "bg-gray-600/50"
        }`}
      >
        <p className="text-sm font-semibold xl:text-lg break-words" style={{ overflowWrap: 'anywhere', margin: 0 }}>
          {message}
        </p>
        <p className={`text-xs italic mt-0 ${djId ? 'text-gray-600' : 'text-gray-400'}`}>
          {"- "}
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;

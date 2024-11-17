import { formatDistanceToNow } from 'date-fns';

const ChatMessage: React.FC<{ djId: string | null, message: string; createdAt: string }> = ({ djId, message, createdAt }) => {
  return (
    <div className="flex items-center justify-end my-3">
      {djId && (
        <div className="text-xs text-gray-500 mr-2 flex-shrink-0 self-center">
          you
        </div>
      )}

      <div
        className={`relative text-white rounded-t-xl rounded-l-xl px-2.5 py-1.5 shadow-md text-right ${
          djId
            ? "bg-gradient-to-r from-blue-400 to-cyan-500"
            : "bg-gradient-to-r from-emerald-400 to-cyan-400"
        }`}
      >
        <p className="text-sm font-semibold xl:text-lg break-words" style={{ overflowWrap: 'anywhere', margin: 0 }}>
          {message}
        </p>
        <p className="text-xs italic text-gray-600 mt-0">
          {"- "}
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;

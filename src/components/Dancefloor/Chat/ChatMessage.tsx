import { formatDistanceToNow } from 'date-fns';

const ChatMessage: React.FC<{ message: string; createdAt: string }> = ({ message, createdAt }) => {
  return (
    <div className="flex justify-end my-3">
      <div className="relative bg-gradient-to-r from-emerald-400 to-cyan-400 text-white rounded-t-xl rounded-l-xl px-2.5 py-1.5 shadow-md  text-right ">
        <p className="text-sm xl:text-lg break-words" style={{ overflowWrap: 'anywhere', margin: 0 }}>
          {message}
        </p>
        <p className="text-xs italic text-gray-600 mt-0">
          {"- "}{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;

import { useEffect, useRef } from "react";
import Button from "../../UI/Button";
import { formatDistanceToNow } from 'date-fns';

interface Message {
  message: string;
  created_at: string;
}

const ChatMobile: React.FC<{
  message: string;
  setMessage: (value: string) => void;
  handleSendMessage: () => void;
  messages: Message[];
  messageError: string | null;
  setMessageError: React.Dispatch<React.SetStateAction<string | null>>;
  messagesError: string | null;
}> = ({
  message,
  setMessage,
  handleSendMessage,
  messages,
  messageError,
  setMessageError,
  messagesError,
}) => {

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.trim()) {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gray-900 flex flex-col h-56">
      <div className="flex flex-row items-center justify-between">
        <p className="text-xl font-bold ml-2 py-0.5">Dancefloor Chat</p>
      </div>

      <div className="flex-1 bg-gray-800 overflow-y-auto scrollbar-thin">
        {messagesError ? (
          <p style={{ color: "red" }}>{messagesError}</p>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="border-t border-gray-900 flex flex-row justify-end p-1">
             <div className="flex flex-col items-end mx-1.5">
                <p className="text-sm text-gray-300">{msg.message}</p>
                <p className="text-xs italic text-gray-500">{"- "}{formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}</p>
             </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-3 italic text-center text-xs">No messages yet.</p>
        )}

        {/* invisible div to track end of messages */}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-none flex flex-row items-center px-2 py-2 sticky bottom-0 bg-gray-900 relative">
        {messageError && (
          <div className="flex flex-row w-full justify-center items-center absolute bg-gradient-to-r from-red-500 to-orange-500 h-12 -top-12 left-0 right-0 text-white text-lg font-semibold">
            {messageError}
          </div>
        )}
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (e.target.value.length > 300) {
              setMessageError(
                "Message exceeds maximum length of 300 characters."
              );
            } else {
              setMessageError("");
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter chat message..."
          className="w-full mr-2 rounded-md h-10 p-2 text-gray-800 font-semibold focus:outline-none"
        />
        <Button
          onClick={handleSendMessage}
          textSize="text-lg"
          bgColor="bg-gradient-to-r from-cyan-500 to-blue-500"
          className="h-10 w-24"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatMobile;
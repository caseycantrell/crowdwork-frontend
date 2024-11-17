import { useEffect, useRef } from "react";
import Button from "../../UI/Button";
import Input from "../../UI/Input";
import { formatDistanceToNow } from 'date-fns';

interface Message {
  dj_id: string | null;
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

  // scroll to bottom of chat when new messages arrive
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
    <div className={`bg-gray-900/90 flex flex-col h-[12.25rem]`}>
      <div className="flex flex-row items-center justify-between">
        <p className="font-bold text-xs pl-2 py-1 bg-gray-900/90 w-full">Dancefloor Chat</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {messagesError ? (
          <p style={{ color: "red" }}>{messagesError}</p>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-row items-center justify-end p-0.5 ${
                index !== 0 ? 'border-t border-gray-900' : ''
              } ${index === messages.length - 1 ? 'border-b border-gray-900' : ''}`}
            >

              {msg.dj_id && (
                <div className="text-success/50 font-semibold text-xs mr-auto pl-2 flex-shrink-0">
                  host
                </div>
              )}

              <div className="flex flex-col items-end mx-1.5">
                <p className="text-[0.8rem] text-gray-300">{msg.message}</p>
                <p className="text-[0.65rem] italic text-gray-500">
                  {"- "}
                  {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-300 font-semibold mt-3 italic text-center text-xs">
            No messages yet.
          </p>
        )}

        {/* invisible div to track end of messages */}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-none flex flex-row items-center px-2 py-2 sticky bottom-0 bg-gray-900/90 relative">
        {messageError && (
          <div className="flex flex-row w-full justify-center items-center absolute bg-gradient-to-r from-red-500 to-orange-500 h-12 -top-12 left-0 right-0 text-white text-lg font-semibold">
            {messageError}
          </div>
        )}
        <Input
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
          className="mr-2"
        />
        <Button
          onClick={handleSendMessage}
          className="flex justify-center"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatMobile;
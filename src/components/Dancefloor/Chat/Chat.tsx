import { useState } from "react";
import ChatMessage from "./ChatMessage";

interface Message {
  message: string;
}

const Chat: React.FC<{
  message: string;
  setMessage: (value: string) => void;
  handleSendMessage: () => void;
  messages: Message[];
  messagesError: string | null;
  isLoadingMessages: boolean;
  setIsChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  message,
  setMessage,
  handleSendMessage,
  messages,
  messagesError,
  isLoadingMessages,
  setIsChatVisible
}) => {
  const [messageError, setMessageError] = useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message.trim()) {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-black flex flex-col h-full">
      <div className="flex flex-row items-center justify-between m-3">
        <p className="text-xl 2xl:text-4xl font-bold text-white">Dancefloor Chat</p>
        <button
          onClick={() => setIsChatVisible(false)}
          className="bg-purple-500 text-white font-semibold py-2 px-4 rounded"
        >
          Hide Chat
        </button>
      </div>
      
      <div className="flex-1 bg-gray-200 rounded-md mx-2 p-2 overflow-y-auto">
        {isLoadingMessages ? (
          <p>Loading messages...</p>
        ) : messagesError ? (
          <p style={{ color: 'red' }}>{messagesError}</p>
        ) : (
          messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index}>
                <ChatMessage message={msg.message} />
              </div>
            ))
          ) : (
            <p className="text-gray-400">No messages yet</p>
          )
        )}
      </div>

      <div className="flex-none flex flex-row items-center m-1 px-2 py-5 sticky bottom-0 bg-black">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (e.target.value.length > 300) {
              setMessageError('Message exceeds maximum length of 300 characters.');
            } else {
              setMessageError(null);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter your message"
          className="w-full mr-2 rounded-md h-14 p-2 text-gray-700 text-lg"
        />
        <button
          onClick={handleSendMessage}
          className="bg-green-500 font-bold rounded-lg h-14 w-48"
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default Chat;

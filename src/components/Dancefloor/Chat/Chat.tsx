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
}> = ({
  message,
  setMessage,
  handleSendMessage,
  messages,
  messagesError,
  isLoadingMessages
}) => {
  const [messageError, setMessageError] = useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message.trim()) {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-black row-span-1 lg:row-span-5 col-span-1 flex flex-col h-full">
      <p className="text-4xl font-bold ml-2 mt-2 text-white">Dancefloor Chat</p>
      {messageError && <p style={{ color: 'red' }}>{messageError}</p>}
      <div className="flex-1 bg-gray-200 rounded-md mt-3 mx-2 p-2 overflow-y-auto">
        {isLoadingMessages ? (
          <p>Loading messages...</p>
        ) : messagesError ? (
          <p style={{ color: 'red' }}>{messagesError}</p>
        ) : (
          messages.length > 0 ? (
            messages.map((msg, index) => <div key={index}><ChatMessage message={msg.message} /></div>)
          ) : (
            <p className="text-gray-400">No messages yet</p>
          )
        )}
      </div>
      <div className="flex-none flex flex-row items-center m-1 p-2 sticky bottom-0">
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
          className="w-full mr-2 rounded-md h-12 p-2 text-gray-700 text-lg"
        />
        <button
          onClick={handleSendMessage}
          className="bg-green-500 font-bold rounded-lg h-12 w-48"
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default Chat;

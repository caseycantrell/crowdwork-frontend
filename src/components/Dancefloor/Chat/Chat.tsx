import ChatMessage from "./ChatMessage";

interface Message {
  message: string;
  created_at: string;
}

const Chat: React.FC<{
  message: string;
  setMessage: (value: string) => void;
  handleSendMessage: () => void;
  messages: Message[];
  messageError: string | null;
  setMessageError: React.Dispatch<React.SetStateAction<string | null>>;
  messagesError: string | null;
  isLoadingMessages: boolean;
  setIsChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  message,
  setMessage,
  handleSendMessage,
  messages,
  messageError,
  setMessageError,
  messagesError,
  isLoadingMessages,
  setIsChatVisible
}) => {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message.trim()) {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gray-900 flex flex-col h-full">
      <div className="flex flex-row items-center justify-between m-3">
        <p className="text-xl 2xl:text-2xl font-bold text-white">Dancefloor Chat</p>
        <button
          onClick={() => setIsChatVisible(false)}
          className="bg-purple-500 text-white font-semibold py-2 px-4 rounded"
        >
          Hide Chat
        </button>
      </div>
      
      <div className="flex-1 bg-gray-800 rounded-md mx-2 p-2 overflow-y-auto">
        {isLoadingMessages ? (
          <p>Loading messages...</p>
        ) : messagesError ? (
          <p style={{ color: 'red' }}>{messagesError}</p>
        ) : (
          messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index}>
                <ChatMessage message={msg.message} createdAt={msg.created_at} />
              </div>
            ))
          ) : (
            <p className="text-gray-400">No messages yet</p>
          )
        )}
      </div>

      <div className="flex-none flex flex-row items-center m-1 px-2 py-5 sticky bottom-0 bg-black relative">
        {messageError && <div className="flex flex-row w-full justify-center items-center absolute bg-purple-500 h-12 -top-12 left-0 right-0 text-white text-lg">{messageError}</div>}
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (e.target.value.length > 300) {
              setMessageError('Message exceeds maximum length of 300 characters.');
            } else {
              setMessageError('');
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

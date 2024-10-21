import ChatMessage from "../Chat/ChatMessage";
import Button from '../../UI/Button';

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message.trim()) {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gray-800 flex flex-col h-80">
      <div className="flex flex-row items-center justify-between">
        <p className="text-xl font-bold ml-2 py-0.5">Dancefloor Chat</p>
      </div>
      
      <div className="flex-1 bg-gray-800 rounded-md overflow-y-auto scrollbar-thin">
        {messagesError ? (
          <p style={{ color: 'red' }}>{messagesError}</p>
        ) : (
          messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index}>
                <ChatMessage message={msg.message} createdAt={msg.created_at} />
              </div>
            ))
          ) : (
            <p className="font-semibold text-gray-400 m-2">No messages yet...</p>
          )
        )}
      </div>

      <div className="flex-none flex flex-row items-center m-0 px-2 py-2 sticky bottom-0 bg-black relative">
        {messageError && <div className="flex flex-row w-full justify-center items-center absolute bg-gradient-to-r from-red-500 to-orange-500 h-12 -top-12 left-0 right-0 text-white text-lg font-semibold">{messageError}</div>}
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
          placeholder="Enter your message..."
          className="w-full mr-2 rounded-md h-12 p-2 text-gray-800 font-semibold focus:outline-none"
        />
        <Button
          onClick={handleSendMessage}
          textSize="text-lg"
          bgColor="bg-gradient-to-r from-cyan-500 to-blue-500"
          className="h-12 w-24"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatMobile;
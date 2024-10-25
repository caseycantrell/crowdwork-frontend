import ChatMessage from "./ChatMessage";
import Button from '../../UI/Button';

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
    <div className="bg-gray-900 flex flex-col h-full">
      <div className="flex flex-row items-center justify-between m-2">
        <p className="text-xl 2xl:text-2xl font-bold text-white">Dancefloor Chat</p>
      </div>
      
      <div className="flex-1 bg-gray-800 rounded-md mx-2 p-2 overflow-y-auto scrollbar-thin">
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
            <p className="font-semibold text-gray-400 m-2 italic">No messages yet...</p>
          )
        )}
      </div>

      <div className="flex-none flex flex-row items-center m-0 px-2 py-5 sticky bottom-0 bg-black relative">
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
          placeholder="Enter your message"
          className="w-full mr-2 rounded-md h-12 p-2 text-gray-800 text-xl font-semibold focus:outline-none"
        />
        <Button
          onClick={handleSendMessage}
          bgColor="bg-gradient-to-r from-cyan-500 to-blue-500"
          textSize="text-xl"
          className="h-12 w-32"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
import { useState } from "react";

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

  return (
    <div className="row-span-1 lg:row-span-4 col-span-1 bg-yellow-400 overflow-y-auto">
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
        placeholder="Enter your message"
      />
      <button onClick={handleSendMessage}>Send Message</button>
      {messageError && <p style={{ color: 'red' }}>{messageError}</p>}

      <div className="break-words overflow-hidden">
        {isLoadingMessages ? (
          <p>Loading messages...</p>
        ) : messagesError ? (
          <p style={{ color: 'red' }}>{messagesError}</p>
        ) : (
          messages.map((msg, index) => <p key={index}>{msg.message}</p>)
        )}
      </div>
    </div>
  );
};

export default Chat;
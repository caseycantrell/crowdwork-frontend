import React from 'react';

interface Props {
  message: string;
}

const ChatMessage: React.FC<Props> = ({ message }) => {
  return (
    <div className="flex justify-end my-4">
      <div className="relative bg-blue-500 text-white rounded-2xl p-3 break-words shadow-md">
        <p className="text-lg">{message}</p>
        {/* tail for the bubble */}
        <div className="absolute -bottom-0 -right-1.5 w-0 h-0 border-t-[20px] border-t-transparent border-l-[20px] border-l-blue-500 border-b-[0px]"></div>
      </div>
    </div>
  );
};

export default ChatMessage;
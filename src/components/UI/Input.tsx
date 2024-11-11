import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'file';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onKeyDown,
  className = '',
  id,
}) => {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={`w-full rounded-md backdrop-blur bg-gray-700/40 text-white p-2 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-main placeholder:text-gray-500 ${className}`}
    />
  );
};

export default Input;
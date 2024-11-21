import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'file';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  maxLength?: number;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onKeyDown,
  className = '',
  id,
  maxLength
}) => {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      maxLength={maxLength}
      className={`w-full rounded-md bg-gray-700/40 text-white p-2 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-success/70 placeholder:text-gray-400 ${className}`}
    />
  );
};

export default Input;
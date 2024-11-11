interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  bgColor?: string;
  textColor?: string;
  disabledColor?: string;
  padding?: string;
  fontWeight?: string;
  textSize?: string;
  disableHoverEffect?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  onMouseEnter,
  onMouseLeave,
  children,
  className = "",
  type = "button",
  disabled = false,
  bgColor = "bg-gradient-to-r from-indigo-400 to-cyan-400",
  textColor = "text-white",
  disabledColor = "disabled:bg-gradient-to-r from-gray-500 to-gray-400",
  padding = "px-4 py-2",
  fontWeight = "font-semibold",
  textSize = "text-md",
  disableHoverEffect = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${textColor} ${textSize} ${bgColor} ${disabled ? disabledColor : ""} ${padding} ${fontWeight} ${
        disableHoverEffect ? "no-hover" : "button-effect"
      } rounded-md ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

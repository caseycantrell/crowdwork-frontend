import Button from '../components/UI/Button';

interface LogoutButtonProps {
  handleLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ handleLogout }) => {
  return (
    <Button
      onClick={handleLogout}
      fontWeight='font-bold'
      textSize='text-xl'
      padding=''
      bgColor=''
      disableHoverEffect={true}
      className='text-right w-full bg-transparent bg-none bg-opacity-0 text-link border-none'>
      Logout
    </Button>
  );
};

export default LogoutButton;
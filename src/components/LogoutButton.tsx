import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../components/UI/Button';

const LogoutButton: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include', // include cookies for session handling
    });

    const data = await response.json();
    
    if (response.ok) {
      setMessage(data.message);
      
      // redirect to login page after logout
      router.push('/login');
    } else {
      setMessage('Logout failed');
    }
  };

  return (
    <div className='relative w-full xl:w-fit rounded-'>
      <div className='flex flex-col items-center xl:items-end'>
        <Button
          onClick={handleLogout}
          fontWeight='font-bold'
          textSize='text-xl'
          padding='p-4'
          bgColor='bg-gradient-to-r from-red-500 to-orange-500 xl:bg-transparent'
          className='text-center xl:text-right w-full 
          bg-gradient-to-r from-red-500 to-orange-500
          xl:bg-transparent xl:bg-none xl:bg-opacity-0'
        >
          Logout
        </Button>
        <div className="text-xs font-semibold mt-1 mr-3">
          {message}
        </div>
      </div>
    </div>
  );
};

export default LogoutButton;
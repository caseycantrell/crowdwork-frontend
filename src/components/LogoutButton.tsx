import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '../components/UI/Button';
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from 'framer-motion';

const LogoutButton: React.FC = () => {
  const [ message, setMessage ] = useState<string>('');
  const [ showMessage, setShowMessage ] = useState<boolean>(false)
  const [ isError, setIsError ] = useState<boolean>(false)
  const router = useRouter();

  const handleLogout = async () => {

    // clear the client-side session
    await signOut({ redirect: false });

    // call backend to ensure session is cleared there too
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      setIsError(false);
      setMessage('Logged out successfully.');
      setShowMessage(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setIsError(true);
      setMessage('Logout failed, please try again.');
      setShowMessage(true);
    }
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <div className='flex flex-col items-end'>
      <Button
        onClick={handleLogout}
        fontWeight='font-bold'
        textSize='text-xl'
        padding=''
        bgColor=''
        className='text-right w-full bg-transparent bg-none bg-opacity-0'>
        Logout
      </Button>
    <AnimatePresence>
    {showMessage && (
        <motion.div  
          className={`mt-4 flex w-full whitespace-nowrap font-bold ${isError ? 'text-red-400' : 'text-green-400'}`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          onAnimationComplete={() => {
            if (!showMessage) setMessage('');
          }}
        >
          <p>{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
};

export default LogoutButton;
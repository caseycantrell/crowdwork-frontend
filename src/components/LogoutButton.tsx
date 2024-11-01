import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '../components/UI/Button';
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from 'framer-motion';

const LogoutButton: React.FC = () => {
  const router = useRouter();
  const [ message, setMessage ] = useState<string>('');
  const [ showMessage, setShowMessage ] = useState<boolean>(false)
  const [ isError, setIsError ] = useState<boolean>(false)

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      setIsError(false);
      setMessage("Logged out successfully.");
      setShowMessage(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setIsError(true);
      setMessage("An error occurred during logout. Please try again.");
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
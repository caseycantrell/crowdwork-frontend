import { FC, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

interface NotificationProps {
  notificationMessage: string;
  isError?: boolean;
  showNotification: boolean;
  onClose: () => void;
}

const Notification: FC<NotificationProps> = ({ notificationMessage, isError = false, showNotification, onClose }) => {
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showNotification, onClose]);


  // TODO: just testing this to see if it solves a bug on production
  useEffect(() => {
    const preloadImage = (src: string) => {
      const img = new window.Image();
      img.src = src;
    };

    preloadImage('/icons/error.png');
    preloadImage('/icons/success.png');
  }, []);

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          className={`backdrop-blur max-w-[600px] p-8 shadow-lg shadow-gray-800/30 rounded-md absolute top-12 xl:top-20 2xl:top-16 text-center font-semibold z-50`}
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          onAnimationComplete={() => {
            if (!showNotification) onClose();
          }}
        >
        <div className='flex flex-row items-center justify-center'>
            <p className='text-xl font-bold mr-2'>
                {isError ? "WOMP WOMP." : "Noice."}
            </p>
            <Image src={isError ? '/icons/error.png' : '/icons/success.png'} width={25} height={25} alt={isError ? 'Error' : 'Success'} className='flex items-center mb-0.5 ml-1' priority />
        </div>
        <p className={`mt-2 font-bold ${isError ? 'text-red-500/80' : 'text-green-500/80'}`}>{notificationMessage}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;

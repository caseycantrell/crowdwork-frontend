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

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          className={`backdrop-blur max-w-[600px] p-8 shadow-xl rounded-md absolute top-12 2xl:top-24 text-center font-semibold z-50`}
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
            <Image src={isError ? '/icons/error.png' : '/icons/success.png'} width={25} height={25} alt="Error" className='flex items-center mb-0.5 ml-1' priority />
        </div>
        <p className={`mt-2 font-bold ${isError ? 'text-red-500/80' : 'text-green-500/80'}`}>{notificationMessage}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;

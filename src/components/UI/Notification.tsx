import { FC, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
            <p className='text-xl font-bold mr-2'>{isError ? "WOMP WOMP." : "Noice."}</p>
            {isError ?  
              <motion.svg
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="text-error/90 h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* first line of the X */}
                <motion.path
                  d="M6 18L18 6"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{
                    opacity: { duration: 0.1, delay: 0.5 },
                    pathLength: {
                      duration: 0.5,
                      delay: 0.5, 
                      ease: [0.65, 0, 0.35, 1.2],
                    },
                  }}
                />
                {/* second line of the X */}
                <motion.path
                  d="M18 18L6 6"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{
                    opacity: { duration: 0.1, delay: 1 }, 
                    pathLength: {
                      duration: 0.5,
                      delay: 1,
                      ease: [0.65, 0, 0.35, 1.2],
                    },
                  }}
                />
              </motion.svg>
            : 
              <motion.svg
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="text-success/80 h-10 w-10 mb-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
              <motion.path
                d="M5 13l4 4L19 7"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{
                  opacity: { duration: 0.1, delay: 0.5 },
                  pathLength: {
                    duration: 0.7,
                    delay: 0.5,
                    ease: [0.65, 0, 0.35, 1.2],
                  },
                }}
              />
              </motion.svg>
             }
        </div>
        <p className={`mt-2 font-bold ${isError ? 'text-error/90' : 'text-success/80'}`}>{notificationMessage}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;

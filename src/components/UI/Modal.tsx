// Modal.tsx
import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { closeIcon } from '@/icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-40 backdrop-blur-md"
          onClick={onClose} // close when clicking outside
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="relative bg-gray-800 backdrop-filter backdrop-blur-lg bg-opacity-30 rounded-md p-6 shadow-lg shadow-gray-700/40"
            onClick={(e) => e.stopPropagation()} // prevents closing when clicked inside
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
          >
            <button
              className="absolute top-1 right-1 cursor-pointer p-2"
              aria-label="Close Modal"
            >
              <Image src={closeIcon} width={25} height={25} alt='Close' className='invert' onClick={onClose} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
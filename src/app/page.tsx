"use client"

import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const Home: React.FC = () => {
  const [ isDownArrowVisible, setIsDownArrowVisible ] = useState(true);
  const [ isUpArrowVisible, setIsUpArrowVisible ] = useState(false);
  const controls = useAnimation();
  const bottomSectionRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const bodyHeight = document.body.offsetHeight;
    
    if (scrollTop > 50) {
      setIsDownArrowVisible(false);
    } else {
      setIsDownArrowVisible(true);
      controls.set({ opacity: 0, y: 50 });
      controls.start({ opacity: 1, y: 0 });
    }

    if (scrollTop + windowHeight >= bodyHeight - 50) {
      setIsUpArrowVisible(true);
    } else {
      setIsUpArrowVisible(false);
    }
  };

  const scrollToBottom = () => {
    bottomSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="gradient-background fixed inset-0 z-0"></div>
      <div className="relative z-10 flex flex-col items-center min-h-screen">
        <div className="flex flex-row items-center text-xl absolute top-12 right-16">
          <Link href='/login' className='font-bold'>Login</Link>
          <Link href='/signup' className='ml-10 font-bold'>Sign Up</Link>
        </div>
        
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className='relative'>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 1.5 }}
            className='font-extrabold text-8xl relative'
          >
            CROWDWORK
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: 150 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.25, duration: 1 }}
            className='font-extrabold text-2xl absolute top-20 right-0 mt-1'
          >
            Real-time song requesting and chat for DJ&apos;s.
          </motion.p>

          </div>
          {isDownArrowVisible && (
            <motion.div
              onClick={scrollToBottom}
              className="absolute bottom-8 cursor-pointer flex flex-col items-center"
              initial={{ y: 0 }}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Image src={'/icons/down.svg'} aria-label='Scroll Page Down' width={60} height={60} alt='Arrow' className='invert opacity-80' priority />
            </motion.div>
          )}
        </div>
      </div>

      <div
        ref={bottomSectionRef}
        className="relative z-10 flex flex-wrap justify-center items-center min-h-screen"
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="m-16 w-48 h-48 bg-gray-300"
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            viewport={{ once: false }}
            transition={{ duration: 0.75, delay: i * 0.75 }}
          />
        ))}

        {isUpArrowVisible && (
          <motion.div
            onClick={scrollToTop}
            className="absolute top-8 cursor-pointer"
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Image src={'/icons/down.svg'} aria-label='Scroll Page Down' width={60} height={60} alt='Arrow' className='invert transform -scale-y-100 opacity-80' priority />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;

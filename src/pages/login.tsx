"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { signIn, useSession } from 'next-auth/react';
import '../../src/styles/gradient-bg.css'

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const interactiveRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      setMessage('Login successful, noice.');
      setIsError(false);
      setShowMessage(true);
    } else {
      setMessage(result?.error || 'Login failed');
      setIsError(true);
      setShowMessage(true);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      const timer = setTimeout(() => {
        router.push(`/dj/${session.user.id}`);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [session, router]);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  
  useEffect(() => {
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    function move() {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;

      if (interactiveRef.current) {
        interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      }
      requestAnimationFrame(move);
    }

    const handleMouseMove = (event: MouseEvent) => {
      tgX = event.clientX;
      tgY = event.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    move();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center">
      <div className="text-container">
       <div className='backdrop-blur bg-gray-600/30 border-1 border-gray-500 rounded-md shadow-xl p-8 flex flex-col items-center w-[600px] h-[455px]'>
       <p className="text-6xl font-extrabold">Login</p>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 w-full max-w-lg flex flex-col items-center mt-8"
        >
          <Input
            type="email"
            placeholder="Email"
            value={email}
            className='backdrop-blur bg-gray-700/40 text-white p-4'
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            className='backdrop-blur bg-gray-700/40 text-white p-4'
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fontWeight="font-bold" className="w-full" padding='py-4'>
            Log Me In
          </Button>
        </form>
      <div className="flex flex-row items-center justify-center mt-6 text-lg relative w-full">
        <p className="mr-3 font-semibold">Don't have an account yet?</p>
        <Link href="/signup" className="font-bold hover:text-main ease-in-out duration-300">
          Signup
        </Link>
        <AnimatePresence>
          {showMessage && (
            <motion.div
            className={`w-full absolute top-10 text-center font-light ${isError ? 'text-red-500' : 'text-green-400'}`}
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
       </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className="gradients-container">
        <div className="g1"></div>
        <div className="g2"></div>
        <div className="g3"></div>
        <div className="g4"></div>
        <div className="g5"></div>
        <div ref={interactiveRef} className="interactive"></div>
      </div>
    </div>
  );
};

export default LoginPage;

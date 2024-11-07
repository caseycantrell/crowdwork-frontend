import { useState, useEffect, MutableRefObject } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useInteractiveEffect } from '../hooks/useInteractiveEffect';
import '../../src/styles/gradient-bg.css'

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [ name, setName ] = useState<string>('');
  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ message, setMessage ] = useState<string>('');
  const [ showMessage, setShowMessage ] = useState<boolean>(false);
  const [ isError, setIsError ] = useState<boolean>(false);

  const interactiveRef: MutableRefObject<HTMLDivElement | null> = useInteractiveEffect();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsError(false);
        setMessage('Signup successful, noice! Redirecting...');
        setShowMessage(true);

        // auto log in after signup
        await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        setTimeout(() => {
          router.push(`/dj/${data.dj.id}`);
        }, 2000);
      } else {
        setIsError(true);
        setMessage(data.error || 'Signup failed. Please try again.');
        setShowMessage(true);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setIsError(true);
      setMessage('An unexpected error occurred. Please try again later.');
      setShowMessage(true);
    }
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center">
       <AnimatePresence>
            {showMessage && (
              <motion.div
                className={`backdrop-blur ${isError ? 'bg-red-500/40' : 'bg-green-500/40'} p-8 shadow-xl rounded-md absolute top-8 2xl:top-24 text-center font-semibold z-50`}
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
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
      <div className="text-container">
      <div className='backdrop-blur bg-gray-600/30 border-1 border-gray-500 rounded-md shadow-xl p-8 flex flex-col items-center w-[600px] h-[490px]'>
        <p className="text-6xl font-extrabold">Sign Up</p>
        <form onSubmit={handleSignup} className="space-y-6 w-full max-w-lg flex flex-col items-center mt-8">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            className='backdrop-blur bg-gray-700/40 text-white p-4'
            onChange={(e) => setName(e.target.value)}
          />
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
          <Button
            type="submit"
            padding='py-4'
            fontWeight="font-bold"
            className="w-full"
          >
            Sign Me Up
          </Button>
        </form>
        <div className="flex flex-row items-center justify-center mt-5 text-lg relative w-full">
          <p className="mr-3 font-semibold">Already have an account?</p>
          <Link href="/login" className="font-bold">Login</Link>
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

export default SignupPage;
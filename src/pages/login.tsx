import { useState, useEffect, MutableRefObject } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { signIn, useSession } from 'next-auth/react';
import { useInteractiveEffect } from '../hooks/useInteractiveEffect';
import '../../src/styles/gradient-bg.css'

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ message, setMessage ] = useState<string>('');
  const [ showMessage, setShowMessage ] = useState<boolean>(false);
  const [ isError, setIsError ] = useState<boolean>(false);

  const interactiveRef: MutableRefObject<HTMLDivElement | null> = useInteractiveEffect();

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

  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center">
      <AnimatePresence>
        {showMessage && (
          <motion.div
          className={`backdrop-blur ${isError ? 'bg-red-500/40' : 'bg-green-500/40'} p-8 shadow-xl rounded-md absolute top-12 2xl:top-24 text-center font-semibold z-50`}
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
        <div className='backdrop-blur bg-gray-600/30 border-1 border-gray-500 rounded-md shadow-xl p-8 flex flex-col items-center w-[600px] h-[410px]'>
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
          <div className="flex flex-row items-center justify-center mt-5 text-lg relative w-full">
            <p className="mr-3 font-semibold">Don&apos;t have an account yet?</p>
            <Link href="/signup" className="font-bold">
              Sign Up
            </Link>
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
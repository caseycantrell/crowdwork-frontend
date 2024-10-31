import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Button from '../components/UI/Button';
import LogoutButton from '@/components/LogoutButton';
import { signIn, useSession } from "next-auth/react";

const SignupPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [isMessageError, setIsMessageError] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const router = useRouter();

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
        setIsMessageError(false);
        setMessage('Signup successful, noice! Logging in...');
        setShowMessage(true);

        // auto log in after successful signup
        await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
      } else {
        setIsMessageError(true);
        setMessage(data.error || 'Signup failed. Please try again.');
        setShowMessage(true);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setIsMessageError(true);
      setMessage('An unexpected error occurred. Please try again later.');
      setShowMessage(true);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const redirectTimeout = setTimeout(() => {
        router.push(`/dj/${session.user.id}`);
      }, 2000);

      return () => clearTimeout(redirectTimeout);
    }
  }, [status, session, router]);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-center mb-8">Signup</h1>
      <form onSubmit={handleSignup} className="space-y-6 w-full max-w-lg">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 h-20 font-bold text-4xl rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-main"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 h-20 font-bold text-4xl rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-main"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 h-20 font-bold text-4xl rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-main"
        />
        <Button
          type="submit"
          fontWeight="font-bold"
          className="w-full h-20 text-4xl"
        >
          Sign Me The F**k Up
        </Button>
      </form>
      <div className='flex flex-row items-center justify-center text-xl mt-6 relative w-full'>
        <p className='mr-3'>Already have an account?</p>
        <Link href='/login' className='font-bold hover:text-main ease-in-out duration-300'>Login</Link>
        <AnimatePresence>
        {showMessage && (
            <motion.div  
              className={`flex font-bold mt-4 absolute top-6 max-w-lg ${isMessageError ? 'text-red-400 ' : 'text-green-400'}`}
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

      {/* delete me eventually, just for testing */}
      <div className='absolute top-12 right-16'>
        <LogoutButton />
      </div>

    </div>
  );
};

export default SignupPage;
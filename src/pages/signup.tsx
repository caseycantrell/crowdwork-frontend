import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import LogoutButton from '@/components/LogoutButton';

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [ name, setName ] = useState<string>('');
  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ message, setMessage ] = useState<string>('');
  const [ showMessage, setShowMessage ] = useState<boolean>(false);
  const [ isMessageError, setIsMessageError ] = useState<boolean>(false);

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
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center mb-8">Signup</h1>
      <form onSubmit={handleSignup} className="space-y-6 w-full max-w-lg">
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fontWeight="font-bold"
          className="w-full"
        >
          Sign Me Up
        </Button>
      </form>
      <div className="flex flex-row items-center justify-center text-lg mt-6 relative w-full">
        <p className="mr-3">Already have an account?</p>
        <Link href="/login" className="font-bold hover:text-main ease-in-out duration-300">Login</Link>
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
    </div>
  );
};

export default SignupPage;
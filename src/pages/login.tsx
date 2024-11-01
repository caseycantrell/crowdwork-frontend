import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Button from '../components/UI/Button';
import LogoutButton from '@/components/LogoutButton';
import { signIn, useSession } from "next-auth/react";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ message, setMessage ] = useState<string>('');
  const [ showMessage, setShowMessage ] = useState<boolean>(false);
  const [ isError, setIsError ] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      setMessage("Login successful, noice.");
      setIsError(false);
      setShowMessage(true);
    } else {
      setMessage(result?.error || "Login failed");
      setIsError(true);
      setShowMessage(true);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      const timer = setTimeout(() => {
        router.push(`/dj/${session.user.id}`);
      }, 2000);

      // clear the timeout if the component unmounts
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
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-center mb-8">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-lg">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 h-20 text-4xl font-bold rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-main"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 h-20 text-4xl font-bold rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-main"
        />
        <Button
          type="submit"
          fontWeight="font-bold"
          className="w-full h-20 text-4xl"
        >
          Log Me The F**k In
        </Button>
      </form>
      <div className='flex flex-row items-center justify-center mt-6 text-xl relative w-full'>
        <p className='mr-3'>Don&apos;t have an account yet?</p>
        <Link href='/signup' className='font-bold hover:text-main ease-in-out duration-300'>Signup</Link>
        <AnimatePresence>
        {showMessage && (
            <motion.div  
              className={`flex font-bold mt-4 absolute top-6 ${isError ? 'text-red-400' : 'text-green-400'}`}
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

export default LoginPage;
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Notification from '../components/UI/Notification';

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [ name, setName ] = useState<string>('');
  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ notificationMessage, setNotificationMessage ] = useState<string>('');
  const [ showNotification, setShowNotification ] = useState<boolean>(false);
  const [ isError, setIsError ] = useState<boolean>(false);

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
        setNotificationMessage('Signup successful, noice! Redirecting...');
        setShowNotification(true);

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
        setNotificationMessage(data.error || 'Signup failed. Please try again.');
        setShowNotification(true);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setIsError(true);
      setNotificationMessage('An unexpected error occurred. Please try again later.');
      setShowNotification(true);
    }
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center relative">
      <div className='gradient-background'></div>
      <Notification isError={isError} notificationMessage={notificationMessage} showNotification={showNotification} onClose={() => setShowNotification(false)} />
      <div className="flex flex-row items-center text-xl font-bold absolute top-12 right-16">
        <Link href='/' className=''>Home</Link>
      </div>
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
    </div>
  );
};

export default SignupPage;
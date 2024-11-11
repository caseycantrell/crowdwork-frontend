import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { signIn, useSession } from 'next-auth/react';
import Notification from '../components/UI/Notification';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ notificationMessage, setNotificationMessage ] = useState<string>('');
  const [ showNotification, setShowNotification ] = useState<boolean>(false);
  const [ isError, setIsError ] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      setNotificationMessage('Login successful.');
      setIsError(false);
      setShowNotification(true);
    } else {
      setNotificationMessage(result?.error || 'Login failed');
      setIsError(true);
      setShowNotification(true);
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
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center relative">
      <div className="gradient-background"></div>
      <Notification isError={isError} notificationMessage={notificationMessage} showNotification={showNotification}  onClose={() => setShowNotification(false)} />
      <div className="flex flex-row items-center text-xl font-bold absolute top-12 right-16">
        <Link href='/' className='font-bold'>Home</Link>
        <Link href='/signup' className='ml-10 font-bold'>Sign Up</Link>
      </div>
      <div className="">
        <div className='backdrop-blur bg-gray-600/30 border-1 border-gray-500 rounded-md shadow-xl p-8 flex flex-col items-center w-[600px]'>
          <p className="text-4xl font-extrabold">Login</p>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 w-full max-w-lg flex flex-col items-center mt-6"
          >
            <Input
              type="email"
              placeholder="Email"
              value={email}
              className='p-4 placeholder:text-md'
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              className='p-4 placeholder:text-md'
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" padding='py-4' fontWeight="font-bold" className="w-full text-xl">
              Log Me In
            </Button>
          </form>
          <div className="flex flex-row items-center justify-center mt-6 text-lg relative w-full">
            <p className="mr-3 font-semibold">Don&apos;t have an account yet?</p>
            <Link href="/signup" className="font-bold text-link">
              <p>Sign Up</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
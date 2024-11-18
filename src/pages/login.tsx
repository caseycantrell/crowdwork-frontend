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
  const [notification, setNotification] = useState({ message: '', isVisible: false, isError: false });

  const showNotification = (message: string, isError = false) => {
    setNotification({ message, isVisible: true, isError });
    setTimeout(() => setNotification((prev) => ({ ...prev, isVisible: false })), 3500);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      showNotification('Login successful.', false);
    } else {
      showNotification(result?.error || 'Login failed', true);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      const timer = setTimeout(() => {
        router.push(`/dj/${session.user.id}`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [session, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      <div className="gradient-background-variation"></div>
      <Notification
          showNotification={notification.isVisible}
          isError={notification.isError}
          notificationMessage={notification.message}
          onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
        />
      <div className="flex flex-row items-center text-xl absolute top-12 right-16">
        <Link href='/' className='font-bold'>Home</Link>
        <Link href='/signup' className='ml-10 font-bold'>Sign Up</Link>
      </div>
      <div className='backdrop-blur bg-gray-600/30 border-1 border-gray-500 rounded-md shadow-xl p-6 flex flex-col items-center w-[550px]'>
          <p className="text-4xl font-extrabold mb-6">Login</p>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 w-full max-w-lg flex flex-col items-center"
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
            <Button type="submit" padding='py-4' bgColor='bg-gradient-to-r from-emerald-400/80 to-cyan-500/80' fontWeight="font-bold" className="w-full text-xl">
              Log Me In
            </Button>
          </form>
          <div className="flex flex-row items-center justify-center text-lg relative w-full mt-5">
            <p className="mr-3 font-bold">Don&apos;t have an account yet?</p>
            <Link href="/signup" className="font-extrabold text-link">
              <p>Sign Up</p>
            </Link>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;
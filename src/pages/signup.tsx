import { useState } from 'react';
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
  const [notification, setNotification] = useState({ message: '', isVisible: false, isError: false });

  const showNotification = (message: string, isError = false) => {
    setNotification({ message, isVisible: true, isError });
    setTimeout(() => setNotification((prev) => ({ ...prev, isVisible: false })), 4000);
  };

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
        showNotification('Signup successful.', false);

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
        showNotification(data.error || 'Signup failed. Please try again.', true);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      showNotification('An unexpected error occurred. Please try again.', true);
    }
  };

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
        <Link href='/login' className='ml-10 font-bold'>Login</Link>
      </div>
      <div className='backdrop-blur bg-gray-600/30 border-1 border-gray-500 rounded-md shadow-xl p-6 flex flex-col items-center w-[550px]'>
        <p className="text-4xl font-extrabold mb-6">Sign Up</p>
        <form onSubmit={handleSignup} className="space-y-6 w-full max-w-lg flex flex-col items-center">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            className='placeholder:text-md p-4'
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            className='placeholder:text-md p-4'
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            className='placeholder:text-md p-4'
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            padding='py-4'
            fontWeight="font-bold"
            bgColor='bg-gradient-to-r from-emerald-500 to-cyan-500'
            className="w-full text-xl"
          >
            Sign Me Up
          </Button>
        </form>
        <div className="flex flex-row items-center justify-center text-lg relative w-full mt-5">
          <p className="mr-3 font-semibold">Already have an account?</p>
          <Link href="/login" className="font-bold text-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
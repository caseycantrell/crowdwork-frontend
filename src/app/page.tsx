import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div className='flex flex-col justify-center items-center min-h-screen relative'>
      <div className="gradient-background"></div>
      <div className="flex flex-row items-center text-xl absolute top-12 right-16">
        <Link href='/login' className='font-bold'>Login</Link>
        <Link href='/signup' className='ml-10 font-bold'>Sign Up</Link>
      </div>
      <div className="flex flex-col justify-center items-center">
        <p className='font-extrabold text-8xl'>CROWDWORK</p>
        <p className='font-extrabold text-2xl'>Real-time song requesting and chat for DJ&apos;s.</p>
      </div>
    </div>
  );
};

export default Home;
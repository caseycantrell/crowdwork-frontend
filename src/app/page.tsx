import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div className='flex flex-col justify-center items-center min-h-screen relative'>
      <div className='gradient-background'></div>
      <div className="flex flex-row items-center text-xl font-bold absolute top-12 right-16">
        <Link href='/login' className=''>Login</Link>
        <Link href='/signup' className='ml-10'>Sign Up</Link>
      </div>
      <div className="flex flex-col justify-center items-center">
        <p className='font-extrabold text-8xl'>CROWDWORK</p>
        <p className='font-bold text-2xl'>Real-time song requesting and chat for DJ&apos;s.</p>
      </div>
    </div>
  );
};

export default Home;
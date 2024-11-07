"use client"

import { MutableRefObject } from 'react';
import { useInteractiveEffect } from '@/hooks/useInteractiveEffect';
import Link from 'next/link';
import '../../src/styles/gradient-bg.css';

const Home: React.FC = () => {
  const interactiveRef: MutableRefObject<HTMLDivElement | null> = useInteractiveEffect();

  return (
    <div className=''>
      <div className="text-container">
        <p className='font-extrabold text-8xl'>CROWDWORK</p>
        <p className='font-bold text-2xl'>Real-time song requesting and chat for DJ's.</p>
      </div>
      <div className="gradient-bg flex flex-col min-h-screen">
        <div className='login-signup-container text-xl font-bold'>
          <Link href='/login' className=''>Login</Link>
          <Link href='/signup' className='ml-6'>Signup</Link>
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
    </div>
  );
};

export default Home;
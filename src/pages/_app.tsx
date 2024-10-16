import Layout from '../components/Layout';
import { AppProps } from 'next/app';
import '../styles/globals.css'
// import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

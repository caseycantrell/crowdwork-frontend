import Head from 'next/head';
import Layout from '../components/Layout';
import { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>Crowdwork</title>
        <meta name="description" content="Live song requesting for DJs." />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta property="og:title" content="Crowdwork" />
        <meta property="og:description" content="Live song requesting for DJs." />
        {/* TODO: fill out these open graph tags once image and url exist */}
        <meta property="og:image" content="" />
        <meta property="og:url" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  );
}

export default MyApp;
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Roboto } from '@next/font/google';

const roboto = Roboto({ weight: '400', subsets: ['latin'] });

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Event Countdown</title>
        <meta
          name="description"
          content="See how much time has left until your anticipated date"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Component {...pageProps} />
      </LocalizationProvider>
    </>
  );
}

export default App;

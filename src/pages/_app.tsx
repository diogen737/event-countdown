import '../../styles/globals.css'
import type { AppProps } from 'next/app'

import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDayjs';

function App({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <Component {...pageProps} />
    </LocalizationProvider>
  )
}

export default App

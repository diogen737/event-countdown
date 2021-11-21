import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import dayjs from 'dayjs'

import styles from '../styles/Home.module.css'


const Home: NextPage = () => {
  const [targetDate, setTargetDate] = useState(dayjs().startOf('year').add(1, 'year'));
  const [diffD, setDiffD] = useState(0);
  const [diffH, setDiffH] = useState(0);
  const [diffM, setDiffM] = useState(0);
  const [diffS, setDiffS] = useState(0);

  useEffect(() => {
    const recalculateDiff = () => {
      let diff = targetDate.diff(dayjs(), 'day', true);
      const days = Math.floor(diff);
      diff = (diff - days) * 24;
      const hours = Math.floor(diff);
      diff = (diff - hours) * 60;
      const minutes = Math.floor(diff);
      diff = (diff - minutes) * 60;
      const seconds = Math.floor(diff);

      setDiffD(days);
      setDiffH(hours);
      setDiffM(minutes);
      setDiffS(seconds);
    }

    recalculateDiff();
    const id = setInterval(() => recalculateDiff(), 300);
    return () => clearInterval(id);
  }, [targetDate])

  const numberFormatter = (input: number): string => {
    return input.toLocaleString([], { minimumIntegerDigits: 2 })
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Event Countdown</title>
        <meta name="description" content="See how much time has left until your anticipated date" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.cover}>
        <Image
          src="/wall.jpeg"
          layout="fill"
          alt="">
        </Image>
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <span className={styles.dynamic}>`Your event`</span>
          <span className={styles.static}> countdown</span>
        </h1>

        <div className={styles.countdownContainer}>
          <div className={[styles.days, styles.item].join(' ')}>
            <span className={styles.digit}>{ numberFormatter(diffD) }</span>
            <span className={styles.text}>Days</span>
          </div>
          <div className={[styles.hours, styles.item].join(' ')}>
            <span className={styles.digit}>{ numberFormatter(diffH) }</span>
            <span className={styles.text}>Hours</span>
          </div>
          <div className={[styles.minutes, styles.item].join(' ')}>
            <span className={styles.digit}>{ numberFormatter(diffM) }</span>
            <span className={styles.text}>Minutes</span>
          </div>
          <div className={[styles.seconds, styles.item].join(' ')}>
            <span className={styles.digit}>{ numberFormatter(diffS) }</span>
            <span className={styles.text}>Seconds</span>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}



export default Home

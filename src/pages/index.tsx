import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Vibur } from '@next/font/google';

import dayjs from 'dayjs';

import { EventControl } from '@/model/event-control';
import { EventColor } from '@/model/const/event-color';
import { EventBg } from '@/model/const/event-bg';
import styles from '@/styles/Home.module.css';

const vibur = Vibur({ weight: '400', subsets: ['latin'] });

const EventSelector = dynamic(() => import('../components/event-selector'), {
  ssr: false,
});

const Home: NextPage = () => {
  const [eventDate, setEventDate] = useState(
    dayjs().startOf('year').add(1, 'year')
  );
  const [eventName, setEventName] = useState('New Year');
  const [eventColor, setEventColor] = useState<EventColor>('red');
  const [eventBg, setEventBg] = useState(EventBg.new_year);
  const [timeDiff, setTimeDiff] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function getTimeDiff() {
      let diff = eventDate.diff(dayjs(), 'day', true);
      const days = Math.floor(diff);
      diff = (diff - days) * 24;
      const hours = Math.floor(diff);
      diff = (diff - hours) * 60;
      const minutes = Math.floor(diff);
      diff = (diff - minutes) * 60;
      const seconds = Math.floor(diff);

      return { days, hours, minutes, seconds };
    }

    setTimeDiff(getTimeDiff());
    const id = setInterval(() => setTimeDiff(getTimeDiff()), 300);
    return () => clearInterval(id);
  }, [eventDate]);

  useEffect(() => {
    // December, January
    setEventBg(
      [0, 11].includes(eventDate.month()) ? EventBg.new_year : EventBg.regular
    );
  }, [eventDate]);

  // Rendering logic
  const numberFormatter = (input: number): string => {
    return input.toLocaleString([], { minimumIntegerDigits: 2 });
  };

  const nxModel: EventControl = {
    eventName,
    eventDate,
    eventColor,
    setEventName,
    setEventDate,
    setEventColor,
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.cover} ${eventBg.class}`}>
        <Image
          src={eventBg.url}
          priority
          alt=""
          fill
          sizes="100vw"
          style={{
            objectFit: 'cover',
          }}
        ></Image>
      </div>

      <EventSelector nxModel={nxModel}></EventSelector>

      <main
        className={`${styles.main} ${styles[eventColor]} ${vibur.className}`}
      >
        <h1 className={styles.title}>
          <span className={styles.dynamic}>{eventName}</span>
          <span className={styles.static}> countdown</span>
        </h1>

        <div className={styles.countdownContainer}>
          <div className={`${styles.days} ${styles.item}`}>
            <span className={styles.digit}>
              {numberFormatter(timeDiff.days)}
            </span>
            <span className={styles.text}>Days</span>
          </div>
          <div className={[styles.hours, styles.item].join(' ')}>
            <span className={styles.digit}>
              {numberFormatter(timeDiff.hours)}
            </span>
            <span className={styles.text}>Hours</span>
          </div>
          <div className={[styles.minutes, styles.item].join(' ')}>
            <span className={styles.digit}>
              {numberFormatter(timeDiff.minutes)}
            </span>
            <span className={styles.text}>Minutes</span>
          </div>
          <div className={[styles.seconds, styles.item].join(' ')}>
            <span className={styles.digit}>
              {numberFormatter(timeDiff.seconds)}
            </span>
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
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              width={72}
              height={16}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </span>
        </a>
      </footer>

      <div id="modal-root"></div>
    </div>
  );
};

export default Home;

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Vibur } from '@next/font/google';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { NextPage } from 'next';
import dayjs from 'dayjs';

import { EventConfig, EventType } from '@/model/event-config';
import { LS_EVENT } from '@/model/const/keys';
import styles from '@/styles/Home.module.css';

import Loading from '@/components/loading';
const EventSelector = dynamic(() => import('@/components/event-selector'), {
  ssr: false,
});

const vibur = Vibur({ weight: '400', subsets: ['latin'] });

const Home: NextPage = () => {
  const { query, isReady } = useRouter();

  const [eventConfig, setEventConfig] = useState<EventConfig>();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    // config from query params
    const { date: dateQ, name: nameQ, type: typeQ } = query;
    // console.log({ dateQ, nameQ, typeQ });
    let dateParsed = dayjs(dateQ as string);
    if (typeof nameQ === 'string' && dateParsed.isValid()) {
      return setEventConfig(
        new EventConfig(nameQ, dateParsed, typeQ as EventType | undefined)
      );
    }
    // config from local storage
    const { date: dateLs, name: nameLs, type: typeLs } = JSON.parse(localStorage.getItem(LS_EVENT) || '{}');
    // console.log({ dateLs, nameLs, typeLs });
    dateParsed = dayjs(dateLs);
    if (typeof nameLs === 'string' && dateParsed.isValid()) {
      return setEventConfig(
        new EventConfig(nameLs, dateParsed, typeLs as EventType | undefined)
      );
    }
    // default event
    setEventConfig(
      new EventConfig('new year', dayjs().startOf('year').add(1, 'year'))
    );
  }, [isReady, query]);

  const [timeDiff, setTimeDiff] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!eventConfig) {
      return;
    }

    const getTimeDiff = () => {
      let diff = eventConfig.date.diff(dayjs(), 'day', true);
      const days = Math.floor(diff);
      diff = (diff - days) * 24;
      const hours = Math.floor(diff);
      diff = (diff - hours) * 60;
      const minutes = Math.floor(diff);
      diff = (diff - minutes) * 60;
      const seconds = Math.floor(diff);

      return { days, hours, minutes, seconds };
    };

    setTimeDiff(getTimeDiff());
    const id = setInterval(() => setTimeDiff(getTimeDiff()), 300);
    return () => clearInterval(id);
  }, [eventConfig]);

  const numberFormatter = (input: number): string => {
    return input.toLocaleString([], { minimumIntegerDigits: 2 });
  };

  if (!eventConfig) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.cover} ${eventConfig.background.class}`}>
        <Image
          src={eventConfig.background.url}
          priority
          alt=""
          fill
          sizes="100vw"
          style={{
            objectFit: 'cover',
          }}
        ></Image>
      </div>

      <EventSelector
        config={eventConfig}
        setState={setEventConfig}
      ></EventSelector>

      <main
        className={`${styles.main} ${styles[eventConfig.color]} ${
          vibur.className
        }`}
      >
        <h1 className={styles.title}>
          <span className={styles.dynamic}>{eventConfig.name}</span>
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

import { useEffect, useState } from 'react';

function formatTime(timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }).format(
    new Date(),
  );
}

/** Live HH:MM in a given IANA time zone, ticking on the minute boundary. */
export function useLocalTime(timeZone: string): string {
  const [time, setTime] = useState(() => formatTime(timeZone));

  useEffect(() => {
    let timer = 0;
    const schedule = () => {
      const msToNextMinute = 60_000 - (Date.now() % 60_000) + 50;
      timer = window.setTimeout(() => {
        setTime(formatTime(timeZone));
        schedule();
      }, msToNextMinute);
    };
    setTime(formatTime(timeZone));
    schedule();
    return () => window.clearTimeout(timer);
  }, [timeZone]);

  return time;
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { formatTime } from '../utils/mathUtils';

interface UseTimerReturn {
  elapsedTime: number;
  formattedTime: string;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  stop: () => number;
}

export function useTimer(autoStart: boolean = false): UseTimerReturn {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    if (isRunning) return;
    startTimeRef.current = Date.now() - elapsedTime * 1000;
    setIsRunning(true);
  }, [isRunning, elapsedTime]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, [isRunning]);

  const resume = useCallback(() => {
    if (isRunning) return;
    startTimeRef.current = Date.now() - elapsedTime * 1000;
    setIsRunning(true);
  }, [isRunning, elapsedTime]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setElapsedTime(0);
    setIsRunning(false);
  }, []);

  const stop = useCallback((): number => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    return elapsedTime;
  }, [elapsedTime]);

  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    isRunning,
    start,
    pause,
    resume,
    reset,
    stop,
  };
}

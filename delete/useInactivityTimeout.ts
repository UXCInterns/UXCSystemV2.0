'use client';

import { useEffect, useRef } from 'react';
import { signOut } from '../lib/auth';

export function useInactivityTimeout(timeoutMinutes: number = 1): void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const TIMEOUT_DURATION = timeoutMinutes * 60 * 1000;

  const resetTimeout = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      console.log('⏰ Inactivity timeout reached - signing out');
      signOut();
    }, TIMEOUT_DURATION);
  };

  useEffect(() => {
    const events: (keyof DocumentEventMap)[] = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    const handleActivity = (): void => {
      resetTimeout();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    resetTimeout();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [TIMEOUT_DURATION]);
}

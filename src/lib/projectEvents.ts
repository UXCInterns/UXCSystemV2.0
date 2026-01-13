// lib/projectEvents.ts
// Create a custom event system for project updates

export const PROJECT_UPDATED_EVENT = 'projectUpdated';

export const emitProjectUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROJECT_UPDATED_EVENT));
  }
};

export const onProjectUpdate = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }
  
  window.addEventListener(PROJECT_UPDATED_EVENT, callback);
  return () => window.removeEventListener(PROJECT_UPDATED_EVENT, callback);
};
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function getLocationString(): Promise<string> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve('Location unavailable');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      },
      () => {
        resolve('Location unavailable');
      }
    );
  });
}

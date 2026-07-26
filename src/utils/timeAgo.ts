import { formatDistanceToNowStrict } from 'date-fns';

export const timeAgo = (date: Date | number): string => {
  if (!date) return '';
  const now = Date.now();
  const past = typeof date === 'number' ? date : date.getTime();
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const result = formatDistanceToNowStrict(past, { addSuffix: true });
  return result;
};

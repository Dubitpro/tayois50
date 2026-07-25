import { useState, useEffect } from 'react';
import { subscribeToWishes, likeWish, GuestbookMessage } from '../services/guestbookService';

export const useGuestbook = () => {
  const [wishes, setWishes] = useState<GuestbookMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToWishes(
      (data) => {
        setWishes(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching wishes:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLike = async (id: string) => {
    try {
      await likeWish(id);
    } catch (err) {
      console.error("Error liking wish:", err);
    }
  };

  return { wishes, loading, error, handleLike };
};

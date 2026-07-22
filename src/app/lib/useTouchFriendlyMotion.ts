import { useEffect, useState } from 'react';

export function useTouchFriendlyMotion() {
  const [isTouchFriendly, setIsTouchFriendly] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 1023px)');
    const update = () => setIsTouchFriendly(query.matches);

    update();
    query.addEventListener('change', update);

    return () => query.removeEventListener('change', update);
  }, []);

  return isTouchFriendly;
}

export function getRevealInitial(isTouchFriendly: boolean, x: number) {
  return isTouchFriendly ? { opacity: 0, y: 24 } : { opacity: 0, x };
}

export function getRevealAnimate(isTouchFriendly: boolean) {
  return isTouchFriendly ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 };
}

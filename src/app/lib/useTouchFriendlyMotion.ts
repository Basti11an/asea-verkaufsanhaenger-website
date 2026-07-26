import { useEffect, useState } from 'react';

const TOUCH_FRIENDLY_MOTION_QUERY = '(hover: none), (pointer: coarse), (max-width: 1023px)';

function getTouchFriendlyMotion() {
  return typeof window !== 'undefined' && window.matchMedia(TOUCH_FRIENDLY_MOTION_QUERY).matches;
}

export function useTouchFriendlyMotion() {
  const [isTouchFriendly, setIsTouchFriendly] = useState(getTouchFriendlyMotion);

  useEffect(() => {
    const query = window.matchMedia(TOUCH_FRIENDLY_MOTION_QUERY);
    const update = () => setIsTouchFriendly(query.matches);

    update();
    query.addEventListener('change', update);

    return () => query.removeEventListener('change', update);
  }, []);

  return isTouchFriendly;
}

export function getRevealInitial(isTouchFriendly: boolean, _x: number) {
  return { opacity: 0, y: isTouchFriendly ? 14 : 22 };
}

export function getRevealAnimate(_isTouchFriendly: boolean) {
  return { opacity: 1, y: 0 };
}

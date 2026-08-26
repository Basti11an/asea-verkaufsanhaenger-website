import { useEffect, useMemo, useRef } from 'react';
import type { AdminReference } from '../../context/AdminDataContext';
import { ReferenceCard } from './ReferenceCard';

interface ReferenceCarouselProps {
  references: AdminReference[];
  className?: string;
}

const AUTOPLAY_SPEED = 36;
const RESUME_DELAY = 2000;

export function ReferenceCarousel({ references, className = '' }: ReferenceCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const ignoreProgrammaticScrollUntilRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const reducedMotionRef = useRef(false);

  const carouselItems = useMemo(() => {
    if (references.length === 0) return [];
    return [...references, ...references, ...references];
  }, [references]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || references.length === 0) return undefined;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mediaQuery.matches;

    const syncReducedMotion = () => {
      reducedMotionRef.current = mediaQuery.matches;
      if (mediaQuery.matches && frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    mediaQuery.addEventListener('change', syncReducedMotion);

    const markProgrammaticScroll = () => {
      isProgrammaticScrollRef.current = true;
      ignoreProgrammaticScrollUntilRef.current = Date.now() + 120;
    };

    const clearProgrammaticScroll = () => {
      isProgrammaticScrollRef.current = false;
    };

    const getLoopWidth = () => container.scrollWidth / 3;

    const keepInMiddleLoop = () => {
      const loopWidth = getLoopWidth();
      if (!Number.isFinite(loopWidth) || loopWidth <= 0) return;

      markProgrammaticScroll();
      if (container.scrollLeft >= loopWidth * 2) {
        container.scrollLeft -= loopWidth;
      } else if (container.scrollLeft <= 0) {
        container.scrollLeft += loopWidth;
      }
      requestAnimationFrame(clearProgrammaticScroll);
    };

    const moveToMiddleLoop = () => {
      const loopWidth = getLoopWidth();
      if (!Number.isFinite(loopWidth) || loopWidth <= 0) return;

      markProgrammaticScroll();
      container.scrollLeft = loopWidth;
      requestAnimationFrame(clearProgrammaticScroll);
    };

    const tick = (time: number) => {
      if (!containerRef.current || isPausedRef.current || reducedMotionRef.current) {
        frameRef.current = null;
        return;
      }

      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = time;
      }

      const deltaSeconds = Math.min((time - lastFrameTimeRef.current) / 1000, 0.08);
      lastFrameTimeRef.current = time;

      markProgrammaticScroll();
      container.scrollLeft += AUTOPLAY_SPEED * deltaSeconds;
      keepInMiddleLoop();

      requestAnimationFrame(clearProgrammaticScroll);

      frameRef.current = requestAnimationFrame(tick);
    };

    const startAutoplay = () => {
      if (reducedMotionRef.current || frameRef.current !== null) return;
      isPausedRef.current = false;
      lastFrameTimeRef.current = null;
      frameRef.current = requestAnimationFrame(tick);
    };

    const pauseForInteraction = () => {
      isPausedRef.current = true;

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current);
      }

      if (!reducedMotionRef.current) {
        resumeTimerRef.current = window.setTimeout(() => {
          resumeTimerRef.current = null;
          keepInMiddleLoop();
          startAutoplay();
        }, RESUME_DELAY);
      }
    };

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current || Date.now() < ignoreProgrammaticScrollUntilRef.current) return;
      keepInMiddleLoop();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;

      isDraggingRef.current = true;
      dragStartXRef.current = event.clientX;
      dragStartScrollRef.current = container.scrollLeft;
      container.classList.add('is-dragging');
      container.setPointerCapture?.(event.pointerId);
      pauseForInteraction();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDraggingRef.current) return;
      event.preventDefault();
      markProgrammaticScroll();
      container.scrollLeft = dragStartScrollRef.current - (event.clientX - dragStartXRef.current);
      keepInMiddleLoop();
      requestAnimationFrame(clearProgrammaticScroll);
    };

    const endDrag = (event: PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      container.classList.remove('is-dragging');
      if (container.hasPointerCapture?.(event.pointerId)) {
        container.releasePointerCapture(event.pointerId);
      }
      pauseForInteraction();
    };

    const handleWheel = () => {
      pauseForInteraction();
    };

    const handleKeyDown = () => {
      pauseForInteraction();
    };

    const initFrame = requestAnimationFrame(() => {
      moveToMiddleLoop();
      if (!reducedMotionRef.current) {
        startAutoplay();
      }
    });

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerup', endDrag);
    container.addEventListener('pointercancel', endDrag);
    container.addEventListener('wheel', handleWheel, { passive: true });
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(initFrame);
      mediaQuery.removeEventListener('change', syncReducedMotion);
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerup', endDrag);
      container.removeEventListener('pointercancel', endDrag);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('keydown', handleKeyDown);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }

      isPausedRef.current = false;
      isDraggingRef.current = false;
      container.classList.remove('is-dragging');
    };
  }, [references]);

  if (references.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`reference-carousel ${className}`}
      tabIndex={0}
      aria-label="Erfahrungen unserer Kunden"
    >
      <div className="reference-carousel-track">
        {carouselItems.map((reference, index) => (
          <ReferenceCard
            key={`${reference.id}-${index}`}
            reference={reference}
            className="reference-carousel-card w-[280px] md:w-[340px] shrink-0"
          />
        ))}
      </div>
    </div>
  );
}

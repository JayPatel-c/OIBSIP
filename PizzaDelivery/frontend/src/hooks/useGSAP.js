import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins once
gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for GSAP animations with automatic cleanup.
 * 
 * Usage:
 *   const containerRef = useGSAPContext((ctx) => {
 *     gsap.from('.element', { y: 80, opacity: 0, scrollTrigger: { ... } });
 *   }, [dependencies]);
 * 
 * All GSAP animations created inside the callback are automatically
 * scoped to the container ref and cleaned up on unmount.
 */
export const useGSAPContext = (callback, deps = []) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      callback(ctx);
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
};

/**
 * Simple hook to get GSAP and ScrollTrigger references.
 */
export const useGSAPPlugins = () => {
  return { gsap, ScrollTrigger };
};

export default useGSAPContext;

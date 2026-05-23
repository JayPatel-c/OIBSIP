import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll Provider
 * 
 * Wraps children with Lenis smooth scrolling and syncs
 * with GSAP ScrollTrigger for scroll-driven animations.
 */
const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    let lenis;
    let tickerCallback;

    try {
      lenis = new Lenis({
        lerp: 0.07,
        duration: 1.6,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
        infinite: false,
        autoResize: true,
      });

      lenisRef.current = lenis;

      // Sync Lenis scroll with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      // Use GSAP ticker for Lenis RAF loop
      tickerCallback = (time) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    } catch (err) {
      console.warn('Lenis initialization failed, falling back to native scroll:', err);
    }

    return () => {
      if (tickerCallback) gsap.ticker.remove(tickerCallback);
      if (lenis) lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;

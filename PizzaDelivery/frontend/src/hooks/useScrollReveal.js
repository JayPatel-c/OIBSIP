import { useEffect } from 'react';

/**
 * Custom hook that observes elements with scroll-reveal classes
 * and adds a 'revealed' class when they enter the viewport.
 * 
 * Usage: Just call useScrollReveal() in any component,
 * then add className="scroll-reveal" (or variants) to elements.
 * 
 * Variants:
 *   scroll-reveal           → fade up
 *   scroll-reveal-left      → slide from left
 *   scroll-reveal-right     → slide from right
 *   scroll-reveal-scale     → scale up
 *   scroll-reveal-rotate    → slight rotate in
 * 
 * Add data-delay="100" for staggered delays (ms).
 */
const useScrollReveal = (threshold = 0.12) => {
  useEffect(() => {
    const elements = document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-rotate'
    );

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.getAttribute('data-delay') || 0;
            setTimeout(() => {
              el.classList.add('revealed');
            }, Number(delay));
            observer.unobserve(el);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });
};

export default useScrollReveal;

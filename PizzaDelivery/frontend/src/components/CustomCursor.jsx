import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * CustomCursor — Premium dot + ring cursor
 * 
 * - Dot follows mouse instantly
 * - Ring follows with spring delay
 * - Both scale up on hover over interactive elements
 * - Hidden on touch devices via CSS
 */
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Track mouse position
    const pos = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Dot follows instantly
      gsap.set(dot, { x: mouse.x, y: mouse.y });
    };

    // Ring follows with spring
    const updateRing = () => {
      pos.x += (mouse.x - pos.x) * 0.15;
      pos.y += (mouse.y - pos.y) * 0.15;
      gsap.set(ring, { x: pos.x, y: pos.y });
      requestAnimationFrame(updateRing);
    };

    // Hover states
    const interactiveSelector = 'a, button, .btn, .pizza-card, .feature-card, .navbar-link, input, select, textarea';

    const onMouseEnter = () => {
      dot.classList.add('cursor-hover');
      ring.classList.add('cursor-hover');
    };

    const onMouseLeave = () => {
      dot.classList.remove('cursor-hover');
      ring.classList.remove('cursor-hover');
    };

    const onMouseDown = () => {
      dot.classList.add('cursor-click');
      ring.classList.add('cursor-click');
    };

    const onMouseUp = () => {
      dot.classList.remove('cursor-click');
      ring.classList.remove('cursor-click');
    };

    // Bind events
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    document.querySelectorAll(interactiveSelector).forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    const rafId = requestAnimationFrame(updateRing);

    // Observe DOM changes to re-bind hover on dynamic elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

export default CustomCursor;

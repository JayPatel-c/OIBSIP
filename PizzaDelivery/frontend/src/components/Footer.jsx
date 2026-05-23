import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 95%' }
    });
  }, []);

  return (
    <footer ref={footerRef} className="site-footer">
      <div className="footer-top">
        <div>
          <div className="footer-logo">Pizza<em>Crafters</em></div>
          <div className="footer-tagline">Crafted for you. Delivered with care.</div>
        </div>
        <div className="footer-nav">
          <div className="footer-col">
            <h5>Order</h5>
            <ul>
              <li><Link to="/build">Build your pizza</Link></li>
              <li><Link to="/dashboard">View menu</Link></li>
              <li><Link to="/my-orders">Track order</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Account</h5>
            <ul>
              <li><Link to="/register">Sign up</Link></li>
              <li><Link to="/login">Log in</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© {new Date().getFullYear()} Pizza Crafters — Built for OIBSIP</span>
        <div className="footer-socials">
          <a href="#">Instagram</a>
          <a href="#">Twitter</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

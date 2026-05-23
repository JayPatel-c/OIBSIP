import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${isHome ? 'navbar--home' : 'navbar--inner'}`}
    >
      <Link to="/" className="nav-logo">
        Pizza<em>Crafters</em>
      </Link>

      <div className="navbar-menu">
        {user ? (
          <>
            {user.role === 'admin' ? (
              <ul className="nav-links">
                <li><Link to="/admin" className={isActive('/admin') ? 'active' : ''}>Admin</Link></li>
                <li><Link to="/admin/inventory" className={isActive('/admin/inventory') ? 'active' : ''}>Inventory</Link></li>
                <li><Link to="/admin/orders" className={isActive('/admin/orders') ? 'active' : ''}>Orders</Link></li>
              </ul>
            ) : (
              <ul className="nav-links">
                <li><Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Menu</Link></li>
                <li><Link to="/build" className={isActive('/build') ? 'active' : ''}>Build</Link></li>
                <li><Link to="/my-orders" className={isActive('/my-orders') ? 'active' : ''}>Track</Link></li>
              </ul>
            )}
            <div className="navbar-user-section">
              <span className="navbar-username">
                {user.role === 'admin' && <span className="badge badge-admin">Admin</span>}
                {user.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="nav-cta">
                Log out
              </button>
            </div>
          </>
        ) : (
          <>
            <ul className="nav-links">
              <li><Link to="/login">Sign in</Link></li>
            </ul>
            <Link to="/register" className="nav-cta">
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

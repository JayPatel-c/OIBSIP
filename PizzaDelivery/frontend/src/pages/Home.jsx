import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../api/axios';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  // Real backend data state
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch real pizzas on mount
  useEffect(() => {
    const fetchTopPizzas = async () => {
      try {
        const res = await api.get('/pizzas');
        // Grab top 5 or 6 pizzas to showcase
        setPizzas(res.data.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch pizzas:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTopPizzas();
  }, []);

  // GSAP Animations (runs after pizzas are loaded so dynamic DOM exists)
  useEffect(() => {
    if (loading) return;
    
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // ── HERO entrance ──
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .to('.hero-eyebrow',   { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
        .to('.hero-h1',        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=0.6')
        .to('.hero-sub',       { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.7')
        .to('.hero-actions',   { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
        .to('.hero-scroll-hint', { opacity: 1, duration: 1 }, '-=0.3');

      // ── Hero parallax ──
      gsap.to('.hero-circle', {
        yPercent: 25, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
      });
      gsap.to('.hero-pizza-emoji', {
        rotate: 40, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 }
      });
      gsap.to('.hero-circle-ring', {
        yPercent: 15, scale: 1.06, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.8 }
      });
      gsap.to('.hero-content', {
        yPercent: -20, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: '40% top', end: 'bottom top', scrub: 1 }
      });

      // ── Story Section — Image clip-path reveal (Criteria 5) ──
      gsap.fromTo('.story-image-wrap',
        { clipPath: 'inset(20% 20% 20% 20%)', scale: 0.85 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.story-section', start: 'top 80%', end: 'center center', scrub: 1 },
        }
      );
      gsap.to('.story-text-line', {
        y: 0, opacity: 1, stagger: 0.12, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: '.story-text', start: 'top 75%' }
      });

      // ── Philosophy section ──
      gsap.to('.phil-overline', { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.phil-overline', start: 'top 82%' } });
      gsap.to('.phil-h2', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.phil-h2', start: 'top 80%' } });
      gsap.to('.phil-right', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.phil-right', start: 'top 80%' } });

      // ── Menu section ──
      gsap.to('.menu-h2', { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.menu-h2', start: 'top 82%' } });
      gsap.to('.menu-see-all', { opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: '.menu-h2', start: 'top 82%' } });

      gsap.to('.menu-card', { 
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: '.menu-cards', start: 'top 80%' } 
      });

      // ── Process section ──
      gsap.to('.process-h2', { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.process-h2', start: 'top 80%' } });
      gsap.to('.process-intro', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.1,
        scrollTrigger: { trigger: '.process-intro', start: 'top 80%' } });

      gsap.to('.step-item', { 
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: '.steps-grid', start: 'top 80%' } 
      });

      // ── CTA section ──
      gsap.to('.cta-pizza-bg', {
        rotate: 60, scale: 1.1, ease: 'none',
        scrollTrigger: { trigger: '.cta-section', start: 'top bottom', end: 'bottom top', scrub: 2 }
      });
      gsap.to('.cta-h2', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-section', start: 'top 70%' } });
      gsap.to('.cta-sub', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.15,
        scrollTrigger: { trigger: '.cta-section', start: 'top 70%' } });
      gsap.to('.cta-actions', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.25,
        scrollTrigger: { trigger: '.cta-section', start: 'top 70%' } });

      // ── CTA rings slow rotation ──
      gsap.to('.cta-bg-circle', {
        rotate: (i) => 360 * (i % 2 === 0 ? 1 : -1),
        duration: (i) => 40 + i * 10,
        repeat: -1, ease: 'none',
        stagger: 0
      });

    }, el);

    return () => ctx.revert();
  }, [loading]);

  const handleOrderInstantly = (pizza) => {
    navigate('/checkout', {
      state: {
        orderItems: [
          {
            isCustom: false,
            pizza: pizza,
            quantity: 1,
            price: pizza.price,
          },
        ],
        totalAmount: pizza.price,
      },
    });
  };

  const renderHeroButtons = () => {
    if (user) {
      if (user.role === 'admin') {
        return <Link to="/admin" className="btn-ember">Admin hub</Link>;
      }
      return (
        <>
          <Link to="/build" className="btn-ember">Start building</Link>
          <Link to="/dashboard" className="btn-ghost-text">View menu</Link>
        </>
      );
    }
    return (
      <>
        <Link to="/register" className="btn-ember">Start building</Link>
        <Link to="/login" className="btn-ghost-text">Sign in</Link>
      </>
    );
  };

  return (
    <div ref={containerRef} className="home-cinematic">

      {/* ══════ HERO ══════ */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grain" />
        <div className="hero-circle-ring" />
        <div className="hero-circle">
          <div className="hero-circle-inner hero-pizza-emoji">🍕</div>
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow">Artisan pizza — delivered</p>
          <h1 className="hero-h1">Craft your<br /><em>perfect</em><br />slice</h1>
          <p className="hero-sub">
            Choose every layer. Your base, your sauce, your cheese, your toppings.
            Hot, handmade, and at your door in 30 minutes.
          </p>
          <div className="hero-actions">
            {renderHeroButtons()}
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span className="scroll-line" />
          Scroll
        </div>
      </section>

      {/* ══════ MARQUEE ══════ */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[
            'Wood-fired quality', '30-minute delivery', 'Build your own',
            'Premium ingredients', '5,200+ orders', 'Rated 4.9 stars',
            'Wood-fired quality', '30-minute delivery', 'Build your own',
            'Premium ingredients', '5,200+ orders', 'Rated 4.9 stars',
          ].map((text, i) => (
            <span className="marquee-item" key={i}>
              <span className="marquee-dot" />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* ══════ STORY SECTION (Image Expansion Criteria) ══════ */}
      <section className="story-section">
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '80px' }}>
          <div className="story-image-wrap" style={{ flex: '1', height: '600px', overflow: 'hidden' }}>
            <img 
              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=1200" 
              alt="Artisan Crafting" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="story-text" style={{ flex: '1' }}>
            <span className="story-text-line phil-overline">The Origin</span>
            <h2 className="story-text-line phil-h2" style={{ marginBottom: '24px' }}>
              Rooted in<br /><em>tradition</em>.
            </h2>
            <p className="story-text-line phil-body">
              Every crust is hand-stretched from dough fermented for 48 hours. 
              Our organic San Marzano tomatoes are crushed daily, blending Italian 
              heritage with bold, modern flavors that redefine what pizza should be.
            </p>
          </div>
        </div>
      </section>

      {/* ══════ PHILOSOPHY ══════ */}
      <section className="philosophy-section">
        <div className="philosophy">
          <div className="phil-left">
            <span className="phil-overline">Our craft</span>
            <h2 className="phil-h2">Made with<br /><em>obsession,</em><br />not shortcuts.</h2>
          </div>
          <div className="phil-right">
            <p className="phil-body">
              Every pizza starts with a choice. We give you five bases, five sauces,
              four cheeses, and a garden of toppings — because the best pizza is the
              one you designed. Our kitchen moves fast. Your standards shouldn't.
            </p>
            <div className="phil-stats">
              <div>
                <div className="phil-stat-num">5k+</div>
                <div className="phil-stat-label">Pizzas delivered</div>
                <div className="phil-stat-line" />
              </div>
              <div>
                <div className="phil-stat-num">4.9</div>
                <div className="phil-stat-label">Average rating</div>
                <div className="phil-stat-line" />
              </div>
              <div>
                <div className="phil-stat-num">30m</div>
                <div className="phil-stat-label">Avg delivery</div>
                <div className="phil-stat-line" />
              </div>
              <div>
                <div className="phil-stat-num">100%</div>
                <div className="phil-stat-label">Fresh daily</div>
                <div className="phil-stat-line" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ MENU SHOWCASE (Dynamic Backend Fetch) ══════ */}
      <section className="menu-section">
        <div className="menu-header">
          <h2 className="menu-h2">Our most<br /><em>loved</em> pizzas</h2>
          <Link to={user ? "/dashboard" : "/login"} className="menu-see-all">
            See full menu
          </Link>
        </div>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <div className="spinner"></div>
          </div>
        ) : error || pizzas.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--ash)', padding: '50px' }}>
            {error ? 'Unable to load pizzas.' : 'No pizzas available right now.'}
          </div>
        ) : (
          <div className="menu-cards">
            {pizzas.map((pizza, i) => (
              <div 
                className="menu-card" 
                key={pizza._id}
                onClick={() => user ? handleOrderInstantly(pizza) : navigate('/login')}
              >
                {/* Fallback to emoji if no real image provided, else display actual image as background */}
                {pizza.image ? (
                  <div 
                    className="menu-card-bg-img" 
                    style={{ backgroundImage: `url(${pizza.image})`, position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.6 }}
                  />
                ) : (
                  <div className="menu-card-bg">{pizza.category === 'Veg' ? '🥦' : '🥩'}</div>
                )}
                
                <div className="menu-card-overlay" style={{ background: pizza.image ? 'linear-gradient(to top, var(--ink) 0%, transparent 100%)' : undefined }} />
                
                <div className="menu-card-content">
                  <div className="menu-card-name">{pizza.name}</div>
                  <div className="menu-card-price">₹ {pizza.price}</div>
                  <div className="menu-card-tags">
                    <span className={`tag-pill ${pizza.category === 'Veg' ? 'veg' : 'hot'}`}>
                      {pizza.category}
                    </span>
                    {/* Add extra tags from description or custom logic if needed */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ══════ PROCESS ══════ */}
      <section className="process-section">
        <div className="process-inner">
          <div className="process-header">
            <h2 className="process-h2">From craving<br />to doorstep</h2>
            <p className="process-intro">
              Four simple steps between you and the pizza you actually want.
              No defaults, no compromises — just how you imagined it.
            </p>
          </div>
          <div className="steps-grid">
            {[
              { num: '01', icon: '👤', name: 'Create account', desc: 'Sign up and verify your email. Takes under a minute — you won\'t even remember doing it.' },
              { num: '02', icon: '🍕', name: 'Build your pizza', desc: 'Choose base, sauce, cheese, veggies, and meat across our custom step-by-step builder.' },
              { num: '03', icon: '💳', name: 'Pay securely', desc: 'Razorpay checkout. Fast, encrypted, and done in two taps — card, UPI, or wallet.' },
              { num: '04', icon: '🛵', name: 'Track live', desc: 'Watch your order move from kitchen to your door. Real-time status, no guessing.' },
            ].map((step, i) => (
              <div className="step-item" key={i}>
                <div className="step-number">{step.num}</div>
                <div className="step-icon-wrap">{step.icon}</div>
                <div className="step-name">{step.name}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FULLSCREEN CTA ══════ */}
      <section className="cta-section">
        <div className="cta-bg-circle" />
        <div className="cta-bg-circle" />
        <div className="cta-bg-circle" />
        <div className="cta-pizza-bg">🍕</div>
        <div className="cta-content">
          <h2 className="cta-h2">Your first order.<br /><em>20% off.</em></h2>
          <p className="cta-sub">
            Sign up now and get a promo code instantly. No spam, just pizza.
          </p>
          <div className="cta-actions">
            {user ? (
              <Link to="/build" className="btn-ember">Build your pizza</Link>
            ) : (
              <>
                <Link to="/register" className="btn-ember">Get started</Link>
                <Link to="/login" className="btn-ghost-text">Sign in</Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

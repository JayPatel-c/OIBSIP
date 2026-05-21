import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-hero">
      <div className="hero-overlay"></div>
      <div className="hero-content container">
        <h1 className="hero-title animate-fade-in">
          Craft Your Perfect <span className="text-highlight">Pizza Masterpiece</span>
        </h1>
        <p className="hero-subtitle animate-fade-in-delayed">
          Experience gourmet pizza tailored exactly to your cravings. Handpick your base, choose your sauce, layer artisan cheese, and pile on premium fresh garden veggies. Fast delivery, fresh ingredients.
        </p>
        <div className="hero-actions animate-fade-in-delayed">
          {user ? (
            user.role === 'admin' ? (
              <Link to="/admin" className="btn btn-primary btn-lg">
                Go to Admin Hub
              </Link>
            ) : (
              <>
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Explore Varieties
                </Link>
                <Link to="/build" className="btn btn-accent btn-lg">
                  Build Custom Pizza
                </Link>
              </>
            )
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-lg">
                Order Online
              </Link>
              <Link to="/register" className="btn btn-accent btn-lg">
                Create Account
              </Link>
            </>
          )}
        </div>

        <div className="features-grid container">
          <div className="feature-card">
            <h3>5 Premium Bases</h3>
            <p>From organic whole wheat to gooey double-filled ultimate cheese burst.</p>
          </div>
          <div className="feature-card">
            <h3>Artisan Sauces</h3>
            <p>Zesty Italian marinara, smoky sweet honey BBQ, rich creamy garlic alfredo, and more.</p>
          </div>
          <div className="feature-card">
            <h3>Real Cheese</h3>
            <p>100% gourmet Mozzarella, sharp golden Cheddar, or premium dairy-free vegan alternatives.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Tracking</h3>
            <p>Monitor your orders live as they move from the oven to your doorstep.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

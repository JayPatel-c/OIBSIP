import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} <strong>Pizza Crafters Premium gourmet Delivery</strong>. Built for OIBSIP Level 3 Task.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

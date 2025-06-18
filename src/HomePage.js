import React from 'react';
import './HomePage.css';

function HomePage({ onContinue }) {
  return (
    <div className="home-container">
      <div className="animated-bg"></div>

      <div className="home-content">
        <h1 className="fade-in">📄 Invoice Generator</h1>
        <p className="fade-in delay-1">
          Easily generate and download professional invoices for your mobile and accessories store.
        </p>
        <button className="fade-in delay-2" onClick={onContinue}>🚀 Get Started</button>
      </div>
    </div>
  );
}

export default HomePage;

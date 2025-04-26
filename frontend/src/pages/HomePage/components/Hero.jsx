// Hero.jsx
import React from 'react';
import './Hero.css';

const Hero = () => (
  <section className="hero">
    <div className="hero__overlay" />

    <div className="hero__content">
      <h1 className="home__title">
        Discover NYC's Art Scene
      </h1>
      <p className="home_subtitle">
      <a href="/explore" className="home_subtitle-link">Explore</a> local masterpieces, find hidden gems, and connect with artists around the city.
     </p>
    </div>
  </section>
);

export default Hero;

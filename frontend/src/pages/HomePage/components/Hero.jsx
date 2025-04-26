import React from 'react';
import './Hero.css';
import heroTop from './hero-top.png';
import heroBottom from './hero-bottom.png';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-image-top">
          <img src={heroTop} alt="Art Gallery" />
        </div>
        
        <div className="hero-text">
          <h1>Bring Art Beyond the Screen</h1>
          <p className="hero-description">
            The shining objective of Château NYC is to inspire a passion for art in an era where technology 
            has become increasingly disconnected from real-world experiences. By harnessing and showcasing 
            the city's diverse art scene, our platform offers a bridge to connect the digital and physical realms 
            of artistic expression, unlocking years of art's profound role in experiencing cultural richness and 
            fostering cross-cultural understanding.
          </p>
        </div>

        <div className="hero-image-bottom">
          <img src={heroBottom} alt="Featured Artwork" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

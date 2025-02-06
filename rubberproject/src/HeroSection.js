import React from 'react';
import { Link } from 'react-router-dom';

import logo from './images/tyre_scrap.jpeg'; // Ensure correct image path for the logo
import 'bootstrap/dist/css/bootstrap.min.css';

const HeroSection = () => {
  return (
    <div className="hero-section text-white d-flex align-items-center mb-5" style={styles.heroSection}>
      <div className="background-image" style={styles.backgroundImage}></div> {/* Blurred background */}
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-7 ">
            <h2 className="fw-bold falling-text mx-3">
              India's Exclusive Marketplace 
              for <br /> Rubber-Derived Products
            </h2>
            <p className="mt-3 mx-3">
              India’s premier digital scrap marketplace for sustainable scrap management, offering an online platform to buy, sell, and trade scrap materials through eco-friendly recycling processes.
            </p>
            <div className="mt-4 mx-3">
              {/* Link for the BUY button */}
              <Link to="/Productspage">
                <button className="btn btn-primary me-3">
                  BUY
                </button>
              </Link>
              
              {/* Link for the SELL button */}
              <Link to="/Sell">
                <button className="btn btn-outline-light">
                  SELL
                </button>
              </Link>
            </div>
          </div>
          <div className="col-md-5 text-center">
            <img src={logo} alt="Eco-Friendly Recycling" className="img-fluid" style={styles.image} />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  heroSection: {
    position: 'relative',
    minHeight: '90vh',
    padding: '60px 0',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url(${logo}) no-repeat center center/cover`, // Logo as background image
    filter: 'blur(6px)', // Blurring the background image only
    zIndex: 0, // Keep the background behind the content
  },
  image: {
    maxWidth: '80%',
    borderRadius: '10px',
    zIndex: 1, // Ensure image stays above the background
  },
};

// Adding CSS for the animation of the falling text
const fallingTextStyle = `
  .falling-text {
    animation: fallText 3s ease-in-out forwards;
  }

  @keyframes fallText {
    0% {
      transform: translateY(-100%);
      opacity: 0;
    }
    50% {
      transform: translateY(20px);
      opacity: 0.7;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// Append CSS to the document head for the animation
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = fallingTextStyle;
document.head.appendChild(styleSheet);

export default HeroSection;

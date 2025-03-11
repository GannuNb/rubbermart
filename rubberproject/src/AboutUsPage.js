import React from 'react';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AboutUsPage.css'; // Custom CSS for advanced styling
import scrapImage from './images/baledtrespcr2.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css';  // Import FontAwesome icons
import { Link } from 'react-router-dom';


const AboutUsPage = () => {

  useEffect(() => {
    // Directly set the scroll position to the top of the page
    document.documentElement.scrollTop = 0; 
    document.body.scrollTop = 0;  // For compatibility with older browsers
  }, []); // Empty dependency array ensures it runs only once on page load

  return (
    <div className="setter">
      <div className="about-us-page">
        {/* About Section with Background Gradient */}
        <div className="about-header">
          <div className="container text-center py-5">
            <h1 className="about-heading">About RubberScrapMart</h1>
            <p className="lead text-white">Your One-Stop Marketplace for Rubber Scrap Derived Products</p>
          </div>
        </div>

        {/* Who We Are Section */}
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="section-title">Who We Are</h2>
              <p className="section-description">
              <Link to="/" style={{ textDecoration: "none" }}>RubberScrapMart.com</Link> is India's exclusive leading B2B marketplace dedicated to the buying, selling, and trading of rubber scrap-derived products. Our platform connects recyclers, manufacturers, suppliers, and buyers from all over India, promoting sustainability and innovation in the rubber industry.
              </p>
              <p>
              <Link to="/" style={{ textDecoration: "none" }}>RubberScrapMart.com</Link>, we are committed to creating a sustainable and profitable ecosystem for rubber waste and its recycled products. By leveraging cutting-edge technology and an extensive global network, we help businesses source high-quality reclaimed rubber materials, rubber scrap, rubber belt scrap, rubber granules, rubber crumb of different sizes, rubberized flooring, tire-derived products, and more.
              </p>
            </div>
            <div className="col-lg-6">
              <img src={scrapImage} alt="Rubber Products" className="img-fluid imgmore rounded shadow-lg" />
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="container py-5 bg-light">
          <div className="row">
            <div className="col-12 text-center">
              <h3 className="section-subtitle">What We Offer</h3>
            </div>
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="offer-card p-4 shadow-sm">
                <i className="fas fa-exchange-alt offer-icon"></i>
                <h5>Buy & Sell Rubber Scrap</h5>
                <p>A seamless platform for trading rubber waste, crumb rubber, rubber sheets, mats, flooring, and other derived products.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="offer-card p-4 shadow-sm">
                <i className="fas fa-check-circle offer-icon"></i>
                <h5>Verified Suppliers & Buyers</h5>
                <p>Ensuring trust and reliability in every transaction through verified suppliers and buyers.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="offer-card p-4 shadow-sm">
                <i className="fas fa-tags offer-icon"></i>
                <h5>Competitive Pricing & Bulk Deals</h5>
                <p>Direct access to manufacturers and recyclers for cost-effective solutions.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="offer-card p-4 shadow-sm">
                <i className="fas fa-leaf offer-icon"></i>
                <h5>Sustainability Focus</h5>
                <p>Promoting circular economy solutions by reducing rubber waste and encouraging eco-friendly alternatives.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission and Vision Section */}
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-6">
              <h3 className="mission-vision-title text-success">
                <i className="fas fa-bullseye"></i> Our Mission
              </h3>
              <p className="section-description">
                Our main aim is to bridge the gap between rubber waste suppliers, recyclers, and manufacturers by providing a transparent, efficient, and eco-conscious trading platform.
              </p>
            </div>
            <div className="col-lg-6">
              <h3 className="mission-vision-title text-danger">
                <i className="fas fa-eye"></i> Our Vision
              </h3>
              <p className="section-description">
                To be India's #1 marketplace for rubber scrap-derived products, driving a zero-waste future through innovation and collaboration.
              </p>
            </div>
          </div>
        </div>

        {/* Join Us Section */}
        <div className="join-us-section py-5 bg-dark text-white">
          <div className="container text-center">
            <h2 className="join-us-heading mb-4">Join Us Today!</h2>
            <p className="join-us-description mb-4">
              Whether you're a rubber recycler, manufacturer, or industrial buyer, RubberScrapMart.com is your one-stop destination for all rubber scrap and recycled product needs.
            </p>
            <p className="join-us-description mb-5">
              Sign up today and become part of a growing, sustainable industry!
            </p>
            <a href="/signup" className="btn btn-light btn-lg join-us-btn shadow-lg">
              Sign Up Now
            </a>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default AboutUsPage;

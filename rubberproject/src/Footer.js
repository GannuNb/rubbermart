import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-5 pt-4">
      <Container>
        <Row className="justify-content-center justify-content-lg-end">
          {/* Column 1: Trust & Opportunity Message */}
          <Col xs={12} md={6} lg={4} className="mb-4 text-center text-md-left">
            <h5 className="fw-bold">Where Trust Meets Opportunity—Shop and Sell with Hope!</h5>
            <p>
              We are a dedicated team of professionals committed to providing top-notch services. Our mission is to deliver quality and value to our clients.
            </p>
          </Col>

          {/* Column 2: Quick Links */}
          <Col xs={12} md={2} lg={2} className="mb-4 text-center text-md-left">
            <div className="text-center text-lg-end">
              <h5 className="fw-bold">Quick Links</h5>
              <ul className="quick-links list-unstyled">
                  <li><Link to ="/"><a>Home</a></Link></li>
                  <li><Link to ="/AboutUsPage"><a>About Us</a></Link></li>
                  <li><Link to ="/Productspage"><a>Buy</a></Link></li>
                  <li><Link to ="/Sell"><a>Sell</a></Link></li>
                  <li><Link to ="/Contact"><a>Contact</a></Link></li>
              </ul>
            </div>
          </Col>

          {/* Column 3: Contact Info and Social Media */}
          <Col xs={12} md={6} lg={4} className="mb-4 text-center text-lg-end">
            <h5 className="fw-bold">Contact Information</h5>
            <p>Email: info@rubberscrapmart.com</p>
            <p>Phone: +91 4049471616</p>
            <h5 className="fw-bold">Follow Us</h5>
            <div className="text-center text-lg-end">
              <a href="https://www.facebook.com/profile.php?id=61574102936310" className="social-icon me-3" target="_blank" rel="noopener noreferrer" style={{ color: '#1877F2' }}>
                <FaFacebook />
              </a>
              <a href="https://x.com/Rubberscrapmart" className="social-icon me-3" target="_blank" rel="noopener noreferrer" style={{ color: '#1DA1F2' }}>
                <FaTwitter />
              </a>
              <a href="https://www.youtube.com/@Rubberscrapmart" className="social-icon me-3" target="_blank" rel="noopener noreferrer" style={{ color: '#FF0000' }}>
                <FaYoutube />
              </a>
              <a href="https://www.instagram.com/rubberscrapmart/" className="social-icon" target="_blank" rel="noopener noreferrer" style={{ color: '#E4405F' }}>
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>

        {/* Copyright Row */}
        <Row className="mt-4 justify-content-center">
          <Col className="text-center" style={{ marginLeft: '20%' }}>
            <p className="mb-0">Copyright &copy; {new Date().getFullYear()} Rubberscrapmart | All rights reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

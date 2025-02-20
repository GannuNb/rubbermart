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
        <Row className="justify-content-center justify-content-lg-end"> {/* Align content to the right on large screens, center on smaller screens */}
          {/* Column 1: Trust & Opportunity Message */}
          <Col xs={12} md={6} lg={4} className="mb-4 text-left"> {/* Centered text on all screens */}
            <h5 className="fw-bold">Where Trust Meets Opportunity—Shop and Sell with Hope!</h5>
            <p>
              We are a dedicated team of professionals committed to providing top-notch services. Our mission is to deliver quality and value to our clients.
            </p>
          </Col>

          {/* Column 2: Quick Links */}
          <Col xs={12} md={2} lg={2} className="mb-4 text-left"> {/* Centered for small screens, adjust for medium and larger screens */}
            <div className="text-left text-lg-end"> {/* Center text on small screens, right align on medium and larger screens */}
              <h5 className="fw-bolds">Quick Links</h5>
              <ul className="quick-links list-unstyled"> {/* Center the list items */}
                  <li><Link to ="/"><a >Home</a></Link></li>
                  <li><Link to ="/AboutUsPage"><a >About Us</a></Link></li>
                  <li><Link to ="/Productspage"><a >Buy</a></Link></li>
                  <li><Link to ="/Sell"><a >Sell</a></Link></li>
                  <li><Link to ="/Contact"><a >Contact</a></Link></li>
 
              </ul>

            </div>
          </Col>

{/* Column 3: Contact Info and Social Media */}
<Col xs={12} md={6} lg={4} className="mb-4 text-center text-lg-end"> {/* Centered for small screens, align right on large screens */}
  <h5 className="fw-bold">Contact Information</h5>
  <p>Email: info@rubberscrapmart.com</p>
  <p>Phone: +91 4049471616</p>
  <h5 className="fw-bold">Follow Us</h5>
  <div className="text-center text-lg-end"> {/* Center icons on small screens, align right on larger screens */}
    <a href="https://www.facebook.com/people/Vikah-Ecotech/61562484014600/?mibextid=qi2Omg&rdid=DtTaZ8FyfC8gsDCh&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Mxsd16XWYMsvCyi%2F%3Fmibextid%3Dqi2Omg" className="social-icon me-3" target="_blank" rel="noopener noreferrer" style={{ color: '#1877F2' }}>
      <FaFacebook />
    </a>
    <a href="https://x.com/i/flow/login?redirect_after_login=%2Fvikahecotech" className="social-icon me-3" target="_blank" rel="noopener noreferrer" style={{ color: '#1DA1F2' }}>
      <FaTwitter />
    </a>
    <a href="https://www.youtube.com/@vikahecotech" className="social-icon me-3" target="_blank" rel="noopener noreferrer" style={{ color: '#FF0000' }}>
      <FaYoutube />
    </a>
    <a href="https://www.instagram.com/vikahecotech/" className="social-icon" target="_blank" rel="noopener noreferrer" style={{ color: '#E4405F' }}>
      <FaInstagram />
    </a>
  </div>
</Col>
        </Row>

        {/* Copyright Row */}
        <Row className="mt-4 justify-content-center"> {/* Centering the row */}
          <Col className="text-center"> {/* Center text in the column */}
            <p className="mb-0">Copyright &copy; {new Date().getFullYear()} Vikah-Rubber | All rights reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

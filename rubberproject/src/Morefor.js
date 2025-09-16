import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaUserTie, FaStore, FaShoppingCart, FaEnvelope } from "react-icons/fa";
import "./Morefor.css"; // Import custom CSS
import { Link } from 'react-router-dom';

function Morefor() {
  return (
    <Container className=" fade-up" >
      
      <div className=" mt-3 morefor-card p-4 shadow-sm rounded">
        <h2 className="mb-4 text-center">More for You</h2>
        <Row className="text-center">
          <Col xs={12} sm={6} md={3} className="mb-4 mb-sm-0">
            <div className="morefor-item">
              <FaUserTie size={40} className="mb-2 icon-style" />
              <p className="morefor-title">Create Business Profile</p>
              <p className="text-muted">Tell us about your business and set up your profile to attract more buyers.</p>
              <div className="button-container">
                <Link to="/BusinessProfile">
                  <Button variant="outline-primary" className="morefor-btn">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} className="mb-4 mb-sm-0">
            <div className="morefor-item">
              <FaStore size={40} className="mb-2 icon-style" />
              <p className="morefor-title">Sell on Rubbercrapmart for Free</p>
              <p className="text-muted">Reach out to more than 4 crore buyers. Sell with us.</p>
              <div className="button-container">
                <Link to="/sell">
                  <Button variant="outline-primary" className="morefor-btn">
                    Sell
                  </Button>
                </Link>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} className="mb-4 mb-sm-0">
            <div className="morefor-item">
              <FaShoppingCart size={40} className="mb-2 icon-style" />
              <p className="morefor-title">Buying</p>
              <p className="text-muted">Get the best deals and offers from trusted sellers.</p>
              <div className="button-container">
                <Link to="/Productspage">
                  <Button variant="outline-primary" className="morefor-btn">
                    Explore Now
                  </Button>
                </Link>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3}>
            <div className="morefor-item">
              <FaEnvelope size={40} className="mb-2 icon-style" />
              <p className="morefor-title">Contact Us</p>
              <p className="text-muted">Have queries? Get in touch with our support team for assistance.</p>
              <div className="button-container">
                <Link to="/Contact">
                  <Button variant="outline-primary" className="morefor-btn">
                    Know More
                  </Button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default Morefor;

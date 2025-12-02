import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">
      <Container>
        <Row className="footer-top">
          {/* About Us */}
          <Col md={3} sm={6} className="footer-col">
            <h5 className="footer-title">ABOUT US</h5>
            <div className="footer-line"></div>
            <p className="footer-text">
              Rubberscrapmart is a trusted marketplace for buying and selling
              rubber scrap. We ensure quality, sustainability, and trusted
              service across all our products and business transactions.
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={3} sm={6} className="footer-col">
            <h5 className="footer-title">QUICK LINKS</h5>
            <div className="footer-line"></div>
            <ul className="footer-links">
              <li>
                <Link to="/">› Home</Link>
              </li>
              <li>
                <Link to="/AboutUsPage">› About Us</Link>
              </li>
              <li>
                <Link to="/Productspage">› Our Products</Link>
              </li>
              <li>
                <Link to="/Sell">› Sell With Us</Link>
              </li>
              <li>
                <Link to="/Contact">› Contact Us</Link>
              </li>
            </ul>
          </Col>

          {/* Our Products */}
          <Col md={3} sm={6} className="footer-col">
            <h5 className="footer-title">OUR PRODUCTS</h5>
            <div className="footer-line"></div>
            <ul className="footer-links">
              <li>
                <Link to="/Tyrescrap">› Tyre Scrap</Link>
              </li>
              <li>
                <Link to="/Pyrooil">› Pyro Oil</Link>
              </li>
              <li>
                <Link to="/TyresteelScrap">› Tyresteel Scrap</Link>
              </li>
            </ul>
          </Col>

          {/* Address & Socials */}
          <Col md={3} sm={6} className="footer-col">
            <h5 className="footer-title">ADDRESS</h5>
            <div className="footer-line"></div>
            <p className="footer-text">
              <strong>Address:</strong> Ground Floor, Office No-52/ Plot No-44, Sai Chamber CHS, Wing A, Sector 11, Sai Chambers,
               CBD Belapur, Navi Mumbai, Thane, Maharashtra - 400614, GSTN:27AAVFV4635R1ZY
            </p>
            <p>
              <strong>Phone:</strong> 022-46030343
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:info@rubberscrapmart.com"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                info@rubberscrapmart.com
              </a>
            </p>
            <div className="footer-social">
              <a
                href="https://www.facebook.com/profile.php?id=61574102936310"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://x.com/Rubberscrapmart"
                target="_blank"
                rel="noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.youtube.com/@Rubberscrapmart"
                target="_blank"
                rel="noreferrer"
              >
                <FaYoutube />
              </a>
              <a
                href="https://www.instagram.com/rubberscrapmart/"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>

        <hr className="footer-divider" />

        {/* Copyright */}
        <Row>
          <Col className="text-center">
            <p className="footer-bottom">
              © {new Date().getFullYear()} Rubberscrapmart | All Rights Reserved
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

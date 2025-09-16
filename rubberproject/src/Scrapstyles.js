import React, { useEffect, useRef } from "react";
import myGif from "./images/videos/blueyellow.gif";
import scrapImage from "./images/baledtrespcr2.jpg";
import rightImage from "./images/baledtrespcr2.jpg";
import cardIcon1 from "./images/baledtrespcr2.jpg";
import cardIcon2 from "./images/baledtrespcr2.jpg";
import cardIcon3 from "./images/baledtrespcr2.jpg";
import cardIcon4 from "./images/baledtrespcr2.jpg";
import "./Scrapstyles.css";
import Morefor from "./Morefor";
import SrenComponent from "./SrenComponent";
import PyroSteelImage from "./images/PyroSteel.jpeg";
import pyrooilImage from "./images/pyro_oil2.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faRecycle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

function Scrapstyles() {
  const sectionRef = useRef(null);

  // Scroll to top on mount
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
useEffect(() => {
  const handleResize = () => {
    AOS.refresh(); // refresh AOS animations
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  // Intersection Observer for fade-up effect
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleGifClick = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="setterhome fade-up">
      {/* GIF Section */}
      <div className="sticky-section">
        <div
          className="gif-wrapper"
          style={{ width: "100%", overflow: "hidden", cursor: "pointer" }}
        >
          <img
            src={myGif}
            alt="A cool GIF"
            style={{ width: "100%" }}
            onClick={handleGifClick}
          />
        </div>


        {/* First Section */}
        <div className="scrap-container fade-up">
          <div className="scrap-content">
            <p className="scrap-highlight mt-2">BUY AND SELL RUBBERSCRAP</p>
            <h1>
              India’s Premier digital Rubberscrap Marketplace for Sustainable
              Scrap Management, offering an online platform to Buy, Sell, and
              Trade scrap materials through eco-friendly recycling processes
            </h1>
          </div>
          <div className="scrap-image fade-up">
            <img src={scrapImage} alt="Scrap Icon" />
          </div>
        </div>
      </div>
      {/* About Us Section */}
      <div className="about-us-section fade-up">
        <div className="about-us-content">
          <h2 className="about-us-title">About Us</h2>
          <p className="about-us-description">
            Rubberscrapmart.com is an India's exclusive leading B2B
            marketplace dedicated to the buying, selling, and trading of
            rubber scrap-derived products. Our platform connects recyclers,
            manufacturers, suppliers, and buyers from all over India,
            promoting sustainability and innovation in the rubber industry. We
            (“Rubberscrapmart.com”) are committed to creating a sustainable
            and profitable ecosystem for rubber waste and its recycled
            products.
          </p>
          <Link to="/AboutUsPage">
            <button className="request-demo">Learn More →</button>
          </Link>
        </div>
      </div>

      {/* Sell Your Scrap Section */}
      <div className="sell-your-scrap-section fade-up">
        <h2 className="section-title">Sell Your Scrap</h2>
        <div className="cards-containerss">
          <div className="cardsel fade-up">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="card-icon" />
            <h3>Service Areas</h3>
            <p>
              We are serving across three major locations Mundra, Chennai, and
              Nhavasheva specializing in the collection and recycling of
              rubber scrap materials, ensuring efficient processing in these
              key regions.
            </p>
          </div>

          <div className="cardsel fade-up">
            <FontAwesomeIcon icon={faRecycle} className="card-icon" />
            <h3>Recycling Services</h3>
            <p>
              We provide SCRAP PICKUP SERVICE, buying all kinds of rubber
              scrap materials such as PCR Mulch, PCR Baled tyres, PCR
              three-piece, TBR baled tyres, TBR three-piece, rubber
              granules/crumb, shreds, pyro oil, rubber crumb steel, and pyro
              steel.
            </p>
          </div>

          <div className="cardsel fade-up">
            <FontAwesomeIcon icon={faTrashAlt} className="card-icon" />
            <h3>Waste Management</h3>
            <p>
              Rubberscrapmart.com provides outstanding WASTE MANAGEMENT/SCRAP
              DISPOSAL services. This includes collecting, segregating, and
              disposing of Rubber waste, along with monitoring the waste
              management process. Our waste management services are designed
              to reduce the harmful effects of Rubber waste on human health
              and the environment.
            </p>
          </div>
        </div>
      </div>

      {/* New Section */}
      <div className="new-section fade-up" ref={sectionRef}>
        <div className="new-content fade-up">
          <h2>Your One-Stop Marketplace for Rubber Scrap Derived Products</h2>
          <p>
            Discover a seamless platform to buy and sell rubber scrap,
            connecting buyers and sellers in the industry.
          </p>
          <ul>
            <li>
              <strong>For Buyers:</strong> Access a wide range of high-quality
              rubber scrap from trusted suppliers.
            </li>
            <li>
              <strong>For Sellers:</strong> Optimize your selling process to
              move inventory quickly and efficiently.
            </li>
          </ul>
          <div className="scrap-buttons">
            <Link to="/Productspage">
              <button className="buying-btn">BUY</button>
            </Link>
            <Link to="/sell">
              <button className="selling-btn">SELL</button>
            </Link>
          </div>
        </div>
        <div className="new-image fade-up">
          <img src={rightImage} alt="Scrap Trading Illustration" />
        </div>
      </div>

      {/* Cards Section */}
      <div className="cards-container fade-up">
        <h2 className="cards-title">Available to Buy</h2>
        <div className="cards-grid">
          <Link to="/Tyrescrap" className="linkstyle">
            <div className="cardbu fade-up">
              <img src={cardIcon1} alt="Tyre Scrap" className="cardbu-icon" />
              <h3>Tyre Scrap</h3>
              <p>
                Efficient collection and processing of tyre scrap for maximum
                recycling potential.
              </p>
            </div>
          </Link>
          <Link to="/pyrooil" className="linkstyle">
            <div className="cardbu fade-up">
              <img src={pyrooilImage} alt="Pyro Oil" className="cardbu-icon" />
              <h3>Pyro Oil</h3>
              <p>
                Eco-friendly pyrolysis process turning rubber scrap into
                valuable pyro oil.
              </p>
            </div>
          </Link>
          <Link to="/TyresteelScrap" className="linkstyle">
            <div className="cardbu fade-up">
              <img src={PyroSteelImage} alt="Tyre Steel Scrap" className="cardbu-icon" />
              <h3>Tyre Steel Scrap</h3>
              <p>
                Expert recycling of tyre steel scrap for efficient material
                recovery.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Properly rendering SrenComponent and Morefor */}
      <div className="fade-up">
        <SrenComponent />
      </div>
      <div className="fade-up">
        <Morefor />
      </div>
    </div>

  );
}

export default Scrapstyles;

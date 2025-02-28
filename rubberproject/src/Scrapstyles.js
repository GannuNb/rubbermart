import React from "react";
import myGif from "./images/videos/top.gif"; // Import the local GIF
import scrapImage from "./images/baledtrespcr2.jpg"; // Replace with your actual image path
import rightImage from "./images/baledtrespcr2.jpg"; // Add your new right-side image
import cardIcon1 from "./images/baledtrespcr2.jpg"; // Replace with actual icon paths
import cardIcon2 from "./images/baledtrespcr2.jpg";
import cardIcon3 from "./images/baledtrespcr2.jpg";
import cardIcon4 from "./images/baledtrespcr2.jpg";
import "./Scrapstyles.css"; // Import CSS for styling
import Morefor from "./Morefor";
import SrenComponent from "./SrenComponent";
import PyroSteelImage from "./images/PyroSteel.jpeg";
import pyrooilImage from "./images/pyro_oil2.jpeg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faRecycle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';


function Scrapstyles() {
  return (
    <>
      <div className="setter">
        {/* GIF Section */}
        <div style={{ width: "100%", overflow: "hidden" }}>
          <img
            src={myGif}
            alt="A cool GIF"
            style={{ width: "100%", height: "650px" }}
          />
        </div>

        {/* First Section */}
        <div className="scrap-container">
          <div className="scrap-content">
            <p className="scrap-highlight">BUY AND SELL RUBBERSCRAP</p>
            <h1>India's Exclusive Marketplace for Rubber-Derived Products</h1>
            <p className="scrap-description">
              India’s premier digital scrap marketplace for sustainable scrap
              management, offering an online platform to buy, sell, and trade
              scrap materials through eco-friendly recycling processes.
            </p>
            <div className="scrap-buttons">
              {/* <button className="request-demo">Request a demo</button> */}
              <button className="request-demo">Learn More →</button>
            </div>
          </div>
          <div className="scrap-image">
            <img src={scrapImage} alt="Scrap Icon" />
          </div>
        </div>

        {/* About Us Section */}
        <div className="about-us-section">
          <div className="about-us-content">
            <h2 className="about-us-title">About Us</h2>
            <p className="about-us-description">
              At <span className="brand-name">Vikah Rubber</span>, We are
              committed to being a leading provider of high-quality rubber
              products that meet the diverse needs of our customers. Our focus
              on innovation and sustainability drives us to develop solutions
              that not only enhance performance but also minimize environmental
              impact. With a team of experienced professionals and a dedication
              to excellence, We strive to exceed customer expectations through
              reliable service and superior products. Join us on our journey to
              a greener, more sustainable future.{" "}
            </p>
          </div>
        </div>

        <div className="sell-your-scrap-section">
  <h2 className="section-title">Sell Your Scrap</h2>
  <div className="cards-containerss">
    <div className="cardsel">
      <FontAwesomeIcon icon={faMapMarkerAlt} className="card-icon" />
      <h3>Service Areas</h3>
      <p>
        We are serving across three major locations Ex-Mundra, Ex-Chennai, 
        and Ex-Nhavasheva specializing in the collection and recycling of rubber scrap materials, 
        ensuring efficient processing in these key regions.
      </p>
    </div>
   
    <div className="cardsel">
      <FontAwesomeIcon icon={faRecycle} className="card-icon" />
      <h3>Recycling Services</h3>
      <p>
        We provide SCRAP PICKUP SERVICE, 
         buying all kinds of rubberscrap materials such as Mulch Pcr, Baled tyres pcr, three-piece pcr, baled tyres tbr, three-piece tbr, rubber granules/crumb, shreds, pyro oil, rubber crumb steel, and pyro steel.
      </p>
    </div>
    <div className="cardsel">
      <FontAwesomeIcon icon={faTrashAlt} className="card-icon" />
      <h3>Waste Management</h3>
      <p>
        Rubberscrap provides outstanding WASTE MANAGEMENT/SCRAP DISPOSAL services. 
        This includes collecting, segregating, and disposing of dry waste, along with monitoring the waste management process. 
        Our waste management services are designed to reduce the harmful effects of waste on human health and the environment.
      </p>
    </div>
  </div>
</div>



        {/* New Section */}
        <div className="new-section">
          <div className="new-content">
            <h2>Your One-Stop Marketplace for Rubber Scrap Transactions</h2>
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
              <button className="buying-btn">BUY</button>
              <button className="selling-btn">SELL</button>
            </div>
          </div>
          <div className="new-image">
            <img src={rightImage} alt="Scrap Trading Illustration" />
          </div>
        </div>

        {/* Cards Section */}
        <div className="cards-container">
          <h2 className="cards-title">Available to Buy</h2>
          <div className="cards-grid">
            <div className="card">
              <img
                src={cardIcon1}
                alt="Comprehensive Service"
                className="card-icon"
              />
              <h3>Tyre Scrap</h3>
              <p>
                Efficient collection and processing of tyre scrap for maximum
                recycling potential.
              </p>
            </div>
            <div className="card">
              <img
                src={pyrooilImage}
                alt="Sustainability"
                className="card-icon"
              />
              <h3>Pyro Oil</h3>
              <p>
                Eco-friendly pyrolysis process turning rubber scrap into
                valuable pyro oil.
              </p>
            </div>
            <div className="card">
              <img src={PyroSteelImage} alt="Expertise" className="card-icon" />
              <h3>Tyre Steel Scrap</h3>
              <p>
                Expert recycling of tyre steel scrap for efficient material
                recovery.
              </p>
            </div>
          </div>
        </div>
        <SrenComponent />
        <Morefor />
      </div>
    </>
  );
}

export default Scrapstyles;

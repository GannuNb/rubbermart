import { useEffect, React } from "react";
import { FaShoppingCart, FaTags, FaHeadset } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link
import "./TechnologyCards.css";

const TechnologyCards = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const technologies1 = [
    {
      count: "1",
      icon: <FaShoppingCart size={40} />, // Shopping Cart icon
      title: "Easy Buying",
      description: "Browse products and make purchases with a seamless experience.",
      link: "/Productspage", // Link to the products page
    },
    {
      count: "2",
      icon: <FaTags size={40} />, // Tags icon
      title: "Simple Selling",
      description: "List your products easily and reach a wide range of buyers.",
      link: "/Sell", // Link to the selling page
    },
    {
      count: "3",
      icon: <FaHeadset size={40} />, // Headset icon
      title: "24/7 Support",
      description: "Our customer support team is available 24/7 to help you with any inquiries.",
      link: "/Contact", // Link to the support page
    },
  ];

  return (
    <div className="trb-technology-container">
      <h3 className="trb-section-title">
        Transform Your Business With <span>Rubberscrapmart.com</span>
      </h3>
      <div className="trb-technology-grid">
        {technologies1.map((tech, index) => (
          <Link
            to={tech.link}
            key={index}
            className="trb-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="trb-card-body">
              <div className="trb-count-icon-container">
                <h2>{tech.count}</h2>
                <div className="trb-tech-icon">{tech.icon}</div>
              </div>
              <h4 className="trb-tech-title">{tech.title}</h4>
              <p className="trb-tech-description">{tech.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TechnologyCards;

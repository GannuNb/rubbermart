import { useEffect, React } from "react";
import "./SrenComponent.css";
import { Link } from "react-router-dom";
import { FaUpload, FaCheckCircle, FaHandshake } from "react-icons/fa"; // Updated Icons

const SrenComponent = () => {
  const cards = [
    {
      title: "Upload Your Scrap Details",
      description:
        "Provide details about the scrap you want to sell. Ensure accurate details for faster processing.",
      icon: <FaUpload className="sren-icon" />, // Foreground icon
      bgIcon: <FaUpload className="sren-bg-icon" />, // Background icon
    },
    {
      title: "Get Verified by Admin",
      description:
        "Once you upload your scrap details, our admin team will review and verify the information for approval.",
      icon: <FaCheckCircle className="sren-icon" />, // Foreground icon
      bgIcon: <FaCheckCircle className="sren-bg-icon" />, // Background icon
    },
    {
      title: "Sell Scrap Successfully",
      description:
        "After admin verification, your scrap will be listed for sale, and you can proceed to finalize the transaction.",
      icon: <FaHandshake className="sren-icon" />, // Foreground icon
      bgIcon: <FaHandshake className="sren-bg-icon" />, // Background icon
    },
  ];
  // #dbffd6

  return (
    <div className="mt-5 " >
      <h2 className="sren-heading mt-3">How It Works for Sellers</h2>
      <div className="sren-container">
        {cards.map((card, index) => (
          <div className="sren-card" key={index}>
            <div className="sren-bg-icon-wrapper">{card.bgIcon}</div>{" "}
            {/* Background Icon */}
            <div>{card.icon}</div> {/* Foreground Icon */}
            <h3 className="sren-title">{card.title}</h3>
            <hr className="sren-underline" />
            <p className="sren-description">{card.description}</p>
          </div>
        ))}
      </div>
      <Link style={{ textDecoration: "none" }} to="/Sell" className="mb-5">
        <button
          className="btn btn-primary mt-4 d-block mx-auto"
          style={{ fontSize: "16px", padding: "10px 20px", maxWidth: "300px" }}
        >
          Start Selling
        </button>
      </Link>
    </div>
  );
};

export default SrenComponent;

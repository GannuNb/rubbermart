import {useEffect,React} from "react";
import { FaRecycle } from "react-icons/fa"; // Importing the recycle icon
import "./SellTop.css"; // Add CSS for styling

const SellTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);

  return (
    <div className="sell-top-container">
      <div className="sell-top-content">
        <div className="festival-badge">Great Scrap Festival</div>
        <h1>Become a VikaRubber Partner</h1>
        <p>
          Recycle scrap responsibly and contribute to a greener planet. Join
          India’s leading eco-friendly initiative and help build a sustainable
          future.
        </p>
        <div className="buttons">
          <button className="sign-up-btn">Upload scrap with below form</button>
          <button className="learn-more-btn">Now sell scrap responsibly</button>
        </div>
        <small className="disclaimer">*Join and make a positive impact!</small>
      </div>
      <div className="sell-top-icon">
        <FaRecycle size={100} color="#32cd32" /> {/* Recycle icon */}
      </div>
    </div>
  );
};

export default SellTop;

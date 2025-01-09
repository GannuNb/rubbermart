import { useEffect, React, useRef } from "react";
import { FaRecycle } from "react-icons/fa"; // Importing the recycle icon
import "./SellTop.css"; // Add custom CSS for additional styling

const SellTop = () => {
  // Create a reference to the "Upload Your Scrap Details" section
  const formSectionRef = useRef(null);

  // Scroll to the form section when the "Get Started" button is clicked
  const handleGetStarted = () => {
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

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

        {/* Get Started Button */}
        <button className="get-started-btn" onClick={handleGetStarted}>
          Get Started
        </button>
        <small className="disclaimer">*Join and make a positive impact!</small>
      </div>

      <div className="sell-top-image">
        <FaRecycle size={100} color="#32cd32" /> {/* Recycle icon */}
      </div>

      {/* Pass the ref to the "Upload Your Scrap Details" section */}
      <div ref={formSectionRef} />
    </div>
  );
};

export default SellTop;

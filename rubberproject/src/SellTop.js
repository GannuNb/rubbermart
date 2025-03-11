import { useEffect, React, useRef } from "react";
import { FaRecycle } from "react-icons/fa";
import "./SellTop.css"; // Custom CSS

const SellTop = () => {
  const formSectionRef = useRef(null);

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
        <h1 className="title mb-3">Become a RubberScrap Seller</h1>
        <p className="description">
          Sell your scrap materials quickly and easily through India’s leading scrap marketplace. Whether you have Rubber,Pyro oil or Tyre Steel  our platform connects you to reliable buyers, ensuring a smooth and profitable selling experience.
        </p>


        <div className="cta-buttons">
          <button className="get-started-btn" onClick={handleGetStarted}>
            Get Started
          </button>
          <button className="learn-more-btn">
            Learn More
          </button>
        </div>
        <small className="disclaimer">*Join and make a positive impact!</small>
      </div>

      <div className="sell-top-image">
        <FaRecycle size={120} color="#32cd32" />
      </div>

      <div ref={formSectionRef} />
    </div>
  );
};

export default SellTop;
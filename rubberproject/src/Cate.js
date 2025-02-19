import React, { useState, useEffect, useRef } from "react";
import tyreScrap from "./images/tyre_scrap.jpeg";
import pyroOil from "./images/pyro_oil2.jpeg";
import artificialPlants from "./images/PyroSteel.jpeg";
import "./Homepage.css"; 

function Cate() {
  // State to toggle the dropdown
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // Ref for the dropdown element
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Toggle dropdown visibility
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent event propagation when clicking the button
    setDropdownVisible(!isDropdownVisible);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownVisible(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="categories-container">
      <h2 className="title">Categories</h2>
      <p className="subtitle">Find what you are looking for</p>

      <div className="categories">
        {/* Left Image - Natural Plants */}
        <div className="category leftpic">
          <img src={tyreScrap} alt="Natural Plants" className="category-image" />
          <p className="category-title">Tyre Scrap</p>
        </div>

        {/* Middle Image - Plant Accessories */}
        <div className="category middle">
          <img src={pyroOil} alt="Plant Accessories" className="category-image" />
          <p className="category-title">Pyro oil</p>
          <p className="category-description">
            Looking for quality scrap? We offer a variety of materials, including Tyre scrap, Pyro oil, and Tyre Steel Scrap. Purchase from us for great prices and contribute to sustainable recycling practices.
          </p>
          {/* Explore Button */}
          <button
            className="explore-button"
            onClick={toggleDropdown}
            ref={buttonRef}
          >
            Explore →
          </button>

          {/* Dropdown */}
          <div
            className={`dropdown ${isDropdownVisible ? "dropdown-visible" : ""}`}
            ref={dropdownRef}
          >
            <ul>
              <li><a href="/tyrescrap">Tyre Scrap</a></li>
              <li><a href="/pyrooil">Pyro Oil</a></li>
              <li><a href="/tyresteelscrap">Tyre Steel Scrap</a></li>
            </ul>
          </div>
        </div>

        {/* Right Image - Artificial Plants */}
        <div className="category rightpic">
          <img src={artificialPlants} alt="Artificial Plants" className="category-image" />
          <p className="category-title">Tyre Steel Scrap</p>
        </div>
      </div>
    </div>
  );
}

export default Cate;

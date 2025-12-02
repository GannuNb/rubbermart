import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import Filter from "./Filter";

// Images
import PyroSteelImage from "./images/PyroSteel.jpeg";
import PyroSteelImage2 from "./images/PyroSteel2.webp";
import RubberCrumSteelImage from "./images/RubberCrumSteel.jpeg";
import rubbercrumimg1 from "./images/rubbercrumbtw3.jpg";

const Tyresteelscrap = () => {
  const [steelScrapItems, setSteelScrapItems] = useState([]);
  const [approvalData, setApprovalData] = useState([]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [priceLimits, setPriceLimits] = useState({ min: 0, max: 0 });
  const [priceFilterActive, setPriceFilterActive] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");

  const imagesMap = {
    "Rubber Crum Steel": [RubberCrumSteelImage, rubbercrumimg1],
    "Pyro Steel": [PyroSteelImage, PyroSteelImage2],
  };

  // Scroll to top on mount
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Fetch base data (scrap items + approvals)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const scrapRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/scrap`
        );
        const steelItems = scrapRes.data.scrap_items.filter(
          (item) => item.type === "Tyre steel scrap"
        );
        setSteelScrapItems(steelItems);

        const approvalRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/getallapprovals`
        );
        const approvals = approvalRes.data;
        setApprovalData(approvals);

        // Compute price limits
        const prices = approvals
          .filter((ap) => typeof ap.price === "number")
          .map((ap) => ap.price);
        if (prices.length > 0) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceLimits({ min, max });
          setPriceRange({ min, max });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handlers for filter changes
  const handleProductFilterChange = (productName) => {
    setSelectedProducts((prev) =>
      prev.includes(productName)
        ? prev.filter((n) => n !== productName)
        : [...prev, productName]
    );
  };

  const handleLocationFilterChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange({ min: range.min, max: range.max });
  };

  const togglePriceFilterActive = (active) => {
    setPriceFilterActive(active);
  };

  // Compute available locations based on approvals & selected products
  const availableLocations = useMemo(() => {
    const locSet = new Set();
    approvalData.forEach((approval) => {
      if (
        approval.application &&
        approval.loadingLocation != null &&
        (selectedProducts.length === 0 ||
          selectedProducts.includes(approval.application))
      ) {
        locSet.add(approval.loadingLocation);
      }
    });
    return Array.from(locSet);
  }, [approvalData, selectedProducts]);

  // Determine which items to show based on filters
  const displayedItems = useMemo(() => {
    let items = steelScrapItems;

    // product filter
    if (selectedProducts.length > 0) {
      items = items.filter((item) => selectedProducts.includes(item.name));
    }

    // location filter
    if (selectedLocations.length > 0) {
      const validApps = new Set();
      approvalData.forEach((approval) => {
        if (
          approval.application &&
          approval.loadingLocation != null &&
          selectedLocations.includes(approval.loadingLocation)
        ) {
          validApps.add(approval.application);
        }
      });
      items = items.filter((item) => validApps.has(item.name));
    }

    // price filter
    if (priceFilterActive) {
      const min = priceRange.min;
      const max = priceRange.max;
      const validAppsByPrice = new Set();
      approvalData.forEach((approval) => {
        if (
          approval.application &&
          typeof approval.price === "number" &&
          approval.price >= min &&
          approval.price <= max
        ) {
          validAppsByPrice.add(approval.application);
        }
      });
      items = items.filter((item) => validAppsByPrice.has(item.name));
    }

    return items;
  }, [
    steelScrapItems,
    selectedProducts,
    selectedLocations,
    priceFilterActive,
    priceRange,
    approvalData,
  ]);

  const handleOrderClick = (itemName) => {
    if (!isLoggedIn) {
      alert("Please log in to order.");
      navigate("/Login");
    } else {
      navigate(`/${itemName.replaceAll(" ", "")}`);
    }
  };

  // Carousel arrow components
  const NextArrow = ({ onClick }) => (
    <div className="custom-arrow custom-arrow-next" onClick={onClick}>
      ❯
    </div>
  );
  const PrevArrow = ({ onClick }) => (
    <div className="custom-arrow custom-arrow-prev" onClick={onClick}>
      ❮
    </div>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="tyre-scrap-layout mt-5">
      <h2 className="tyre-scrap-heading headings">Tyre Steel Scrap</h2>
      <p className="tyre-scrap-description">
        Tyre Steel Scrap is a high-quality byproduct of tyre recycling,
        primarily used in industrial applications such as construction and
        manufacturing. Products like **Pyro Steel** and **Rubber Crum Steel**
        are valuable raw materials for various engineering and industrial
        processes. These materials are sustainably sourced, making them a
        cost-effective and eco-friendly choice for businesses.
      </p>

      <div className="tyre-scrap-main-content">
        <div className="tyre-scrap-grid">
          {displayedItems.map((item, idx) => (
            <div key={item._id || idx} className="tyre-card">
              <Slider {...settings}>
                {imagesMap[item.name]?.map((imgSrc, i) => (
                  <div key={i}>
                    <img
                      src={imgSrc}
                      className="tyre-image"
                      alt={`${item.name}-${i}`}
                      onClick={() => handleOrderClick(item.name)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ))}
              </Slider>

              <div className="tyre-card-body">
                <h5 className="tyre-card-title">{item.name}</h5>
                <button
                  className="btn btn-primary"
                  onClick={() => handleOrderClick(item.name)}
                  disabled={item.available_quantity === 0}
                >
                  Order
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="filter-sidebar">
          <Filter
            tyreScrapItems={steelScrapItems}
            selectedProducts={selectedProducts}
            onProductFilterChange={handleProductFilterChange}
            locations={availableLocations}
            selectedLocations={selectedLocations}
            onLocationFilterChange={handleLocationFilterChange}
            categoryName="Tyre Steel Scrap"
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            priceLimits={priceLimits}
            priceFilterActive={priceFilterActive}
            onPriceFilterToggle={togglePriceFilterActive}
          />
        </div>
      </div>
    </div>
  );
};

export default Tyresteelscrap;

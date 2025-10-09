import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';

import Filter from './Filter';
import './TyreScrap.css';

// Image imports
import RubberGranulesImage from './images/RubberGranules.jpeg';
import ShreddsImage from './images/Shredds.jpeg';
import BaledTyresTBRImage from './images/BaledTyresTBR.jpg';
import BaledTyresTBRImage2 from './images/BaledTyresTBR_2.jpg';
import ThreePiecePCRImage from './images/ThreePiecePCR.jpeg';
import ThreePieceTBRImage from './images/ThreePieceTBR.jpeg';
import ThreePieceTBRImage2 from './images/ThreePieceTBR2.webp';
import mulchImage from './images/mulch.jpeg';
import mulchImage2 from './images/mulch1.jpg';
import rubbercrumimg2 from "./images/rubbercrumbtw4.jpg";
import baledtrespcrimg1 from "./images/baledtrespcr2.jpg";
import baledtrespcrimg2 from "./images/baledtrespcr3.jpg";
import RubberCrumSteelImage1 from './images/RubberCrumSteel1.jpg';
import RubberGranuelsimg2 from './images/RubberGranules2.jpeg';
import pcr2 from './images/3piecepcr2.jpg';
import tbr2 from './images/3piecetbr2.jpg';

const TyreScrap = () => {
  const [tyreScrapItems, setTyreScrapItems] = useState([]);
  const [approvalData, setApprovalData] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [priceLimits, setPriceLimits] = useState({ min: 0, max: 0 });
  const [priceFilterActive, setPriceFilterActive] = useState(false);

  const navigate = useNavigate();

  const imagesMap = {
    "Rubber Granules/Crum": [RubberCrumSteelImage1, RubberGranuelsimg2],
    "Shreds": [ShreddsImage, ShreddsImage],
    "Baled Tyres PCR": [baledtrespcrimg1, baledtrespcrimg2],
    "Baled Tyres TBR": [BaledTyresTBRImage, BaledTyresTBRImage2],
    "Three Piece PCR": [ThreePiecePCRImage, pcr2],
    "Three Piece TBR": [ThreePieceTBRImage, tbr2],
    "Mulch PCR": [mulchImage, mulchImage2],
  };

  const NextArrow = ({ onClick }) => (
    <div className="custom-arrow custom-arrow-next" onClick={onClick}>❯</div>
  );
  const PrevArrow = ({ onClick }) => (
    <div className="custom-arrow custom-arrow-prev" onClick={onClick}>❮</div>
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scrapRes = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
        const tyreScrap = scrapRes.data.scrap_items.filter(item => item.type === 'Tyre scrap');

        const desiredOrder = [
          "Baled Tyres PCR",
          "Three Piece PCR",
          "Shreds",
          "Baled Tyres TBR",
          "Three Piece TBR",
          "Mulch PCR",
          "Rubber Granules/Crum"
        ];

        const sorted = tyreScrap.sort(
          (a, b) => desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name)
        );
        setTyreScrapItems(sorted);

        const approvalRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/getallapprovals`);
        const approvals = approvalRes.data;
        setApprovalData(approvals);

        const prices = approvals
          .filter(ap => typeof ap.price === 'number')
          .map(ap => ap.price);
        if (prices.length > 0) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceLimits({ min, max });
          setPriceRange({ min, max });
        }
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };

    fetchData();
  }, []);

  const handleProductFilterChange = (productName) => {
    setSelectedProducts(prev =>
      prev.includes(productName)
        ? prev.filter(n => n !== productName)
        : [...prev, productName]
    );
  };

  const handleLocationFilterChange = (location) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange({ min: range.min, max: range.max });
  };

  const togglePriceFilterActive = (active) => {
    setPriceFilterActive(active);
  };

  const availableLocations = useMemo(() => {
    const locSet = new Set();
    approvalData.forEach(approval => {
      if (
        approval.application &&
        approval.loadingLocation != null &&
        (selectedProducts.length === 0 || selectedProducts.includes(approval.application))
      ) {
        locSet.add(approval.loadingLocation);
      }
    });
    return Array.from(locSet);
  }, [approvalData, selectedProducts]);

  const displayedItems = useMemo(() => {
    let items = tyreScrapItems;

    if (selectedProducts.length > 0) {
      items = items.filter(item => selectedProducts.includes(item.name));
    }

    if (selectedLocations.length > 0) {
      const validApps = new Set();
      approvalData.forEach(approval => {
        if (
          approval.application &&
          approval.loadingLocation != null &&
          selectedLocations.includes(approval.loadingLocation)
        ) {
          validApps.add(approval.application);
        }
      });
      items = items.filter(item => validApps.has(item.name));
    }

    if (priceFilterActive) {
      const min = priceRange.min;
      const max = priceRange.max;
      const validAppsByPrice = new Set();
      approvalData.forEach(approval => {
        if (
          approval.application &&
          typeof approval.price === 'number' &&
          approval.price >= min &&
          approval.price <= max
        ) {
          validAppsByPrice.add(approval.application);
        }
      });
      items = items.filter(item => validAppsByPrice.has(item.name));
    }

    return items;
  }, [tyreScrapItems, selectedProducts, selectedLocations, priceFilterActive, priceRange, approvalData]);

  const handleOrderClick = (itemName) => {
    navigate(`/${itemName.replaceAll(" ", "")}`);
  };

  return (
    <div className="tyre-scrap-layout">
      <h2 className="tyre-scrap-heading animated-heading">Tyre Scrap Products</h2>
      <p className="tyre-scrap-description animated-description">
        We offer a wide variety of tyre scrap products tailored to meet your industrial needs. 
        From durable rubber granules to baled tyres, our collection ensures quality and reliability. 
        Perfect for recycling and manufacturing, these products are an ideal choice for sustainable solutions. 
        Browse through the options below and place your order hassle-free.
      </p>

      <div className="tyre-scrap-main-content">
        <div className="tyre-scrap-grid">
          {displayedItems.map((item, index) => (
            <div
              key={item._id}
              className="tyre-card animated-card"
              style={{ '--card-index': index }}
            >
              <Slider {...settings}>
                {imagesMap[item.name]?.map((imgSrc, idx) => (
                  <div key={idx}>
                    <img
                      src={imgSrc}
                      className="tyre-image"
                      alt={`${item.name}-${idx}`}
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
            tyreScrapItems={tyreScrapItems}
            selectedProducts={selectedProducts}
            onProductFilterChange={handleProductFilterChange}
            locations={availableLocations}
            selectedLocations={selectedLocations}
            onLocationFilterChange={handleLocationFilterChange}
            categoryName="Tyre Scrap"
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

export default TyreScrap;

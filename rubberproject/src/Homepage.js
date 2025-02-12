import React, { useRef } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import SrenComponent from './SrenComponent';
import './Homepage.css'; 
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import promotional from './images/promotional.jpg';
import group2 from './images/Group 267.jpg';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import VisibilityIcon from '@mui/icons-material/Visibility'; // Eye icon
import Cate from './Cate';
import Morefor from './Morefor';

import mulchImage from './images/mulch.jpeg'; 
import MultipleBaledTyresPCRImage from './images/MultipleBaledTyresPCR.jpeg';
import ThreePiecePCRImage from './images/ThreePiecePCR.jpeg';
import BaledTyresTBRImage from './images/BaledTyresTBR.jpg';
import ThreePieceTBRImage from './images/ThreePieceTBR.jpeg';
import RubberGranulesImage from './images/RubberGranules.jpeg';
import ShreddsImage from './images/Shredds.jpeg';
import rubbercrumimg1 from './images/rubbercrumbtw3.jpg';
import PyroSteelImage from './images/PyroSteel.jpeg';
import pyrooilImage from './images/pyro_oil2.jpeg';

const products = [
  { id: 1, category: 'Tyre Scrap', name: 'Mulch PCR', image: mulchImage, rating: 5, link: '/mulchpcr' },
  { id: 2, category: 'Tyre Scrap', name: 'Baled Tyres Pcr', image: MultipleBaledTyresPCRImage, rating: 4, link: '/baledtyrespcr' },
  { id: 3, category: 'Tyre Scrap', name: 'Three Piece Pcr', image: ThreePiecePCRImage, rating: 4, link: '/threepiecepcr' },
  { id: 4, category: 'Tyre Scrap', name: 'Baled Tyres TBR', image: BaledTyresTBRImage, rating: 5, link: '/baledtyrestbr' },
  { id: 5, category: 'Tyre Scrap', name: 'Three Piece Tbr', image: ThreePieceTBRImage, rating: 4, link: '/threepiecetbr' },
  { id: 6, category: 'Tyre Scrap', name: 'Rubber Granules/Crum', image: RubberGranulesImage, rating: 5, link: '/RubberGranules/Crum' },
  { id: 7, category: 'Tyre Scrap', name: 'Shreds', image: ShreddsImage, rating: 4, link: '/shreds' },
  { id: 8, category: 'Tyre Steel Scrap', name: 'Rubber Crum Steel', image: rubbercrumimg1, rating: 4, link: '/rubbercrumsteel' },
  { id: 9, category: 'Tyre Steel Scrap', name: 'Pyro Steel', image: PyroSteelImage, rating: 4, link: '/pyrosteel' },
  { id: 10, category: 'Pyro Oil', name: 'Pyro Oil', image: pyrooilImage, rating: 4, link: '/pyrooil' }
];

function Homepage() {
  const productRowRef = useRef(null);

  const scrollLeft = () => {
    productRowRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    productRowRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className='setter'>
      {/* Top Carousel */}
      <Carousel 
        showThumbs={false} 
        autoPlay 
        infiniteLoop 
        showStatus={false} 
        interval={3000} 
        className="top-carousel mb-5"
      >
        <div>
          <img src={promotional} alt="Promotional 1" />
        </div>
        <div>
          <img src={group2} alt="Promotional 2" />
        </div>
      </Carousel>

      <p className="products-heading">Available to Buy</p>

      <div className="products-wrapper">
        <button className="scroll-btn left" onClick={scrollLeft}>
          <ArrowBackIosIcon />
        </button>

        <div className="products-container" ref={productRowRef}>
          {products.map((product) => (
            // Wrap only the image and product name with Link
            <div className="product-card" key={product.id}>
              <Link to={product.link || '#'} className="product-link">
                <div className="image-container">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <VisibilityIcon className="eye-icon" />
                </div>
                <div className="product-info">
                  <p className="category">{product.category}</p>
                  <p className="product-name">{product.name}</p>
                </div>
              </Link>

              {/* Rating stars outside of the Link */}
              <div className="rating">
                {'★'.repeat(product.rating) + '☆'.repeat(5 - product.rating)}
              </div>
            </div>
          ))}
        </div>

        <button className="scroll-btn right" onClick={scrollRight}>
          <ArrowForwardIosIcon />
        </button>
      </div>

      <Cate/>
      <SrenComponent />
      <Morefor/>
    </div>
  );
}

export default Homepage;

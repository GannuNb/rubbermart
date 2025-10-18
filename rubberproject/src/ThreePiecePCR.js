import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ThreePiecePCRImage from './images/ThreePiecePCR.jpeg';
import pcr2 from './images/3piecepcr2.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FaMapMarkerAlt } from 'react-icons/fa';
import ts from './images/ts.svg';
import './Mulch.css';

import ShreddsImage from './images/Shredds.jpeg';
import baledtrespcrimg1 from "./images/baledtrespcr2.jpg";
import ThreePieceTBRImage from './images/ThreePieceTBR.jpeg';
import mulchImage from './images/mulch.jpeg';
import BaledTyresTBRImage1 from "./images/BaledTyresTBR.jpg";
import RubberGranulesImage from './images/RubberGranules2.jpeg';

// Custom Carousel Arrows
function NextArrow(props) {
  const { onClick } = props;
  return (
    <div className="custom-arrow next-arrow" onClick={onClick}>
      &#10095;
    </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div className="custom-arrow prev-arrow" onClick={onClick}>
      &#10094;
    </div>
  );
}

// Carousel settings
const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 4000,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};

function ThreePiecePCR() {
  const [approvals, setApprovals] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    { name: 'Baled Tyres PCR', path: '/BaledTyresPcr' },
    { name: 'Shreds', path: '/shreds' },
    { name: 'Baled Tyres TBR', path: '/baledtyrestbr' },
    { name: 'Three Piece TBR', path: '/threepiecetbr' },
    { name: 'Mulch PCR', path: '/mulchpcr' },
    { name: 'Rubber Granules/Crumb', path: '/RubberGranules/Crum' },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchApprovalDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/approvals`,
          { params: { application: 'Three Piece PCR' } }
        );

        const approvalsData = response.data.approvals;
        setApprovals(approvalsData);

        if (approvalsData.length > 0 && approvalsData[0].postedBy) {
          const userResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/users/${approvalsData[0].postedBy._id}`
          );
          setUserDetails(userResponse.data);
        }
      } catch (error) {
        console.error('Error fetching Three Piece PCR data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalDetails();
  }, []);

  const handleMoreDetailsClick = (approval) => navigate('/moredetails', { state: { approval } });

  if (loading) return <div className="loader-wrapper">Loading...</div>;

  return (
    <div className="mulch-page">
      {/* Hero Carousel */}
      <div className="hero-carousel">
        <Slider {...carouselSettings}>
          <div className="hero-slide">
            <img src={ThreePiecePCRImage} alt="Three Piece PCR 1" className="hero-image" />
            <div className="hero-text">
              <h1>Three Piece PCR</h1>
              <p>
                <strong>Three Piece PCR (Passenger Car Radial)</strong> is a durable and eco-friendly
                material made from recycled rubber. It’s known for its strength, performance, and cost-effectiveness,
                making it a preferred choice in the recycling and manufacturing industries.
              </p>
            </div>
          </div>
          <div className="hero-slide">
            <img src={pcr2} alt="Three Piece PCR 2" className="hero-image" />
            <div className="hero-text">
              <h1>Reliable & Sustainable Material</h1>
              <p>
                Three Piece PCR supports sustainable practices by reusing rubber materials efficiently,
                reducing environmental impact while maintaining high product quality.
              </p>
            </div>
          </div>
        </Slider>
      </div>

 {/* Approvals Horizontal Cards */}
 <div className="approvals-grid mt-4 container">
   {approvals.map((approval) => (
     <div key={approval._id} className="approval-card-horizontal">
       <div className="card-content">
         <div className="card-left">
           <img src={approval.images?.[0]} alt="Approval" />
         </div>
         <div className="card-right">
           <h5 className="approval-title">{approval.application}</h5>
           <p className="approval-material">{approval.material}</p>
           <p className="approval-price">
             <strong>Price:</strong> {approval.price} INR/MT
           </p>
           {userDetails?.businessProfiles?.[0] && (
             <p className="approval-seller">
               <strong>By:</strong> {approval.postedBy?.businessProfiles[0]?.profileId}
             </p>
           )}
           <p className="approval-location">
             <FaMapMarkerAlt /> {approval.loadingLocation}
           </p>
           <img src={ts} alt="Trusted Seller" className="trusted-seller" />
 
           {/* ✅ Button under the card */}
           <div className="mt-3">
             <button
                className="btn btn-primary w-100 more-details-btn"
                onClick={() => handleMoreDetailsClick(approval)}
              >
                More Details
              </button>
           </div>
         </div>
       </div>
     </div>
   ))}
 </div>

{/* Related Categories */}
<div className="related-categories container mt-5">
  <h3>Related Categories</h3>
  <div className="related-grid">
    <Link to="/threepiecepcr" className="related-card">
      <img src={ThreePieceTBRImage} alt="Three Piece PCR" />
      <p>Three Piece TBR</p>
    </Link>

    <Link to="/shreds" className="related-card">
      <img src={ShreddsImage} alt="Shreds" />
      <p>Shreds</p>
    </Link>

    <Link to="/baledtyrespcr" className="related-card">
      <img src={baledtrespcrimg1} alt="Baled Tyres PCR" />
      <p>Baled Tyres PCR</p>
    </Link>

    <Link to="/rubbergranules/crum" className="related-card">
      <img src={RubberGranulesImage} alt="Rubber Granules/Crumb" />
      <p>Rubber Granules/Crumb</p>
    </Link>

    <Link to="/mulch" className="related-card">
      <img src={mulchImage} alt="Mulch" />
      <p>Mulch</p>
    </Link>

    <Link to="/baledtyrestbr" className="related-card">
      <img src={BaledTyresTBRImage1} alt="Baled Tyres TBR" />
      <p>Baled Tyres TBR</p>
    </Link>
  </div>
</div>
    </div>
  );
}

export default ThreePiecePCR;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import pyrooilImage from './images/pyro_oil2.jpeg';
import pyrooilImage1 from './images/pyro_oil2.jpeg'; // Optional second image
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FaMapMarkerAlt } from 'react-icons/fa';
import ts from './images/ts.svg';
import './Mulch.css';

// Custom Carousel Arrows
function NextArrow({ onClick }) {
  return (
    <div className="custom-arrow next-arrow" onClick={onClick}>
      &#10095;
    </div>
  );
}

function PrevArrow({ onClick }) {
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

function Pyrooil() {
  const [approvals, setApprovals] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchApprovalDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/approvals`, {
          params: { application: 'Pyro Oil' },
        });

        const approvalsData = response.data.approvals;
        setApprovals(approvalsData);

        if (approvalsData.length > 0 && approvalsData[0].postedBy) {
          const userResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/users/${approvalsData[0].postedBy._id}`
          );
          setUserDetails(userResponse.data);
        }
      } catch (error) {
        console.error('Error fetching approval details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalDetails();
  }, []);

  const handleMoreDetailsClick = (approval) =>
    navigate('/moredetails', { state: { approval } });

  if (loading) return <div className="loader-wrapper">Loading...</div>;

  return (
    <div className="mulch-page">
      {/* Hero Carousel */}
      <div className="hero-carousel">
        <Slider {...carouselSettings}>
          <div className="hero-slide">
            <img src={pyrooilImage} alt="Pyro Oil 1" className="hero-image" />
            <div className="hero-text">
              <h1>Pyro Oil</h1>
              <p>
                Pyro Oil is a high-quality by-product of tire pyrolysis, widely used in industrial furnaces and boilers as a substitute for furnace oil.
              </p>
            </div>
          </div>
          <div className="hero-slide">
            <img src={pyrooilImage1} alt="Pyro Oil 2" className="hero-image" />
            <div className="hero-text">
              <h1>Eco-Friendly Energy Solution</h1>
              <p>
                This sustainable alternative not only reduces carbon emissions but also provides a cost-effective energy source for multiple industries.
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

    </div>
  );
}

export default Pyrooil;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PyroSteelImage from './images/PyroSteel.jpeg';
import PyroSteelImage2 from './images/PyroSteel2.webp';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FaMapMarkerAlt } from 'react-icons/fa';
import ts from './images/ts.svg';
import './Mulch.css';
import rubberCrumSteelImg1 from './images/RubberCrumSteel.jpeg';

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

function PyroSteel() {
  const [approvals, setApprovals] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    { name: 'Rubber Granules/Crum', path: '/RubberGranules/Crum' },

  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchApprovalDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/approvals`,
          { params: { application: 'Pyro Steel' } }
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
        console.error(error);
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
            <img src={PyroSteelImage} alt="Pyro Steel 1" className="hero-image" />
            <div className="hero-text">
              <h1>Pyro Steel</h1>
              <p>
                Pyro Steel is a high-quality by-product derived from the pyrolysis of scrap tyres.
                It serves as an eco-friendly raw material widely used in manufacturing and construction industries.
              </p>
            </div>
          </div>
          <div className="hero-slide">
            <img src={PyroSteelImage2} alt="Pyro Steel 2" className="hero-image" />
            <div className="hero-text">
              <h1>Durable and Sustainable</h1>
              <p>
                Made from recycled tyre steel, Pyro Steel offers exceptional strength and sustainability,
                making it a preferred material for eco-conscious industrial processes.
              </p>
            </div>
          </div>
        </Slider>
      </div>

      {/* Approvals Section */}
      <div className="approvals-grid mt-4 container">
        {approvals.length > 0 ? (
          approvals.map((approval) => (
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
                      <strong>By:</strong>{' '}
                      {approval.postedBy?.businessProfiles[0]?.profileId}
                    </p>
                  )}
                  <p className="approval-location">
                    <FaMapMarkerAlt /> {approval.loadingLocation}
                  </p>
                  <img src={ts} alt="Trusted Seller" className="trusted-seller" />
                </div>
              </div>
              <button
                className="btn btn-primary more-details-btn"
                onClick={() => handleMoreDetailsClick(approval)}
              >
                More Details
              </button>
            </div>
          ))
        ) : (
          <div className="no-stock-wrapper text-center mt-4">
            <h3>No Stock Available</h3>
          </div>
        )}
      </div>

      {/* Related Categories */}
      <div className="related-categories container mt-5">
        <h3>Related Categories</h3>
        <div className="related-grid">
          {categories.map((cat, index) => (
            <div key={index} className="related-card">
              <img
                src={index % 2 === 0 ? rubberCrumSteelImg1 : rubberCrumSteelImg1}
                alt={cat.name}
              />
              <p>{cat.name}</p>
</div>          ))}
        </div>
      </div>
    </div>
  );
}

export default PyroSteel;

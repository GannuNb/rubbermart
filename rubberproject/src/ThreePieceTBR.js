import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { FaMapMarkerAlt } from 'react-icons/fa'; // Location Icon
import { FaBars } from 'react-icons/fa'; // Menu Icon
import Slider from 'react-slick'; // Carousel import
import tbr2 from './images/3piecetbr2.jpg';
import ThreePieceTBRImage from './images/ThreePieceTBR.jpeg';
import ts from './images/ts.svg'; // Trusted Seller Image
import './Mulch.css'; // Import your CSS file
import { Link } from 'react-router-dom';

function ThreePieceTBR() {
  const [approvals, setApprovals] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // New state to track loading status

  const categories = [
    { name: "Three Piece PCR", path: "/threepiecepcr" },
    { name: "Shreds", path: "/shreds" },
    { name: "Baled Tyres TBR", path: "/baledtyrestbr" },
    { name: "Three Piece TBR", path: "/threepiecetbr" },
    { name: "Mulch PCR", path: "/mulchpcr" },
    { name: "Rubber Granules/Crumb", path: "/RubberGranules/Crum" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchApprovalDetails() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/approvals`, {
          params: { application: 'Three Piece TBR' },
        });

        const approvalsData = response.data.approvals;
        setApprovals(approvalsData);

        if (approvalsData.length > 0 && approvalsData[0].postedBy) {
          const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${approvalsData[0].postedBy._id}`);
          setUserDetails(userResponse.data);
        }
      } catch (error) {
        console.error('Error fetching approval details:', error);
      }finally {
        setLoading(false); // Set loading to false once the request completes
      }
    }

    fetchApprovalDetails();
  }, []);

  
  // Custom Arrow Components for Carousel
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

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  

  if (loading) {
    return (
      <div className='productleftside'>
      <div className="setter">
        <div className='container'>
        <h2 className="text-primary fw-bold text-left mt-5 btphead">Three Piece TBR</h2>
        <div className="row align-items-center mt-3">
        {/* Left Column */}
            <div className="col-md-6">
              <p className="text-justify">
                <strong>Three Piece TBR</strong> is a durable, high-performance product designed for use in automotive and industrial applications.
                Made with top-quality materials, this product is perfect for those seeking reliability and longevity in their tires.
              </p>
            </div>

              {/* Carousel Section */}
              <div className="col-md-5">
                <Slider {...carouselSettings} className="custom-carousel">
                  <div>
                    <img
                      src={ThreePieceTBRImage }
                      alt="Baled Tyres PCR Image 1"
                      className="img-fluid carousel-image"
                    />
                  </div>
                  <div>
                    <img
                      src={tbr2}
                      alt="Baled Tyres PCR Image 2"
                      className="img-fluid carousel-image"
                    />
                  </div>
                </Slider>
              </div>
          </div>
        <div className="no-stock-wrapper">
          <h1>Loading...</h1>
        </div>
      </div>
      </div>
      </div>
    );
  }

  if (approvals.length === 0 || !userDetails) {
    return (
      <div className='productleftside'>
      <div className="setter">
        <div className='container'>
        <h2 className="text-primary fw-bold text-left mt-5 btphead">Three Piece TBR</h2>
        <div className="row align-items-center mt-3">
        {/* Left Column */}
            <div className="col-md-6">
              <p className="text-justify">
                <strong>Three Piece TBR</strong> is a durable, high-performance product designed for use in automotive and industrial applications.
                Made with top-quality materials, this product is perfect for those seeking reliability and longevity in their tires.
              </p>
            </div>

              {/* Carousel Section */}
              <div className="col-md-5">
                <Slider {...carouselSettings} className="custom-carousel">
                  <div>
                    <img
                      src={ThreePieceTBRImage }
                      alt="Baled Tyres PCR Image 1"
                      className="img-fluid carousel-image"
                    />
                  </div>
                  <div>
                    <img
                      src={tbr2}
                      alt="Baled Tyres PCR Image 2"
                      className="img-fluid carousel-image"
                    />
                  </div>
                </Slider>
              </div>
          </div>
        <div className="no-stock-wrapper">
          <h1>No Stock Available</h1>
        </div>
      </div>
      </div>
      </div>
    );
  }

  const handleMoreDetailsClick = (approval) => {
    navigate('/moredetails', { state: { approval } });
  };


  return (
    <>
    <div className='productleftside'>
      <div className="setter">
        <div className="container">
          <div className='container'>
          <h2 className="text-primary fw-bold text-left  btphead">Three Piece TBR</h2>
          <div className="row align-items-center mt-3">
          {/* Left Column */}
            <div className="col-md-7">
              <p className="text-justify">
                <strong>Three Piece TBR</strong> is a durable, high-performance product designed for use in automotive and industrial applications.
                Made with top-quality materials, this product is perfect for those seeking reliability and longevity in their tires.
              </p>
            </div>

              {/* Carousel Section */}
              <div className="col-md-5">
                <Slider {...carouselSettings} className="custom-carousel">
                  <div>
                    <img
                      src={ThreePieceTBRImage }
                      alt="Baled Tyres PCR Image 1"
                      className="img-fluid carousel-image"
                    />
                  </div>
                  <div>
                    <img
                      src={tbr2}
                      alt="Baled Tyres PCR Image 2"
                      className="img-fluid carousel-image"
                    />
                  </div>
                </Slider>
              </div>
          </div>
          </div>

          {/* Related Categories Section */}
          <h2 className="fw-bold text-dark mt-5">Seller's Products</h2>
          <div className="categoriess-container">
            <div className={`categories-box shadow-sm ${isMobile ? "w-auto" : "w-25"}`}>
              <h6 className="text-dark fw-bold border-bottom pb-2 d-flex align-items-center">
                {isMobile && (
                  <button
                    className="btn btn-sm btn-dark me-2"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <FaBars />
                  </button>
                )}
                Related Categories
              </h6>

              {(!isMobile || isOpen) && (
                <div className={`category-list ${isOpen ? "show" : "hide"}`}>
                  <div className="scroll-container">
                    {categories.map((category, index) => (
                      <Link to={category.path} className="category-item" key={index}>
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Approvals Section */}
          {approvals.length > 0 && userDetails && (
            <div className="approval-cards-container">
              {approvals.map((approval) => (
                <div key={approval._id} className="approval-card">
                  {/* Image Section */}
                  {approval.images?.[0] && (
                    <div className="approval-image-container">
                      <img
                        src={approval.images[0]}
                        alt="Approval Image"
                        className="approval-card-image"
                      />
                    </div>
                  )}

                  {/* Divider Line */}
                  <div className="approval-divider"></div>

                  {/* Content Section */}
                  <div className="approval-card-body">
                    <h5 className="approval-title">{approval.application}</h5>
                    <h6 className="approval-material">{approval.material}</h6>

                    {/* Price */}
                    <p className="approval-price">
                      <strong>Price:</strong> {approval.price} INR/MT
                    </p>

                    {/* Seller Info */}
                    {userDetails?.businessProfiles?.[0] && (
                      <p className="approval-seller">
                        <strong>By:</strong> {approval.postedBy?.businessProfiles[0]?.profileId}
                      </p>
                    )}

                    {/* Location */}
                    <p className="approval-location">
                      <FaMapMarkerAlt className="approval-location-icon" />{" "}
                      <strong>Loading Location:</strong> {approval.loadingLocation}
                    </p>

                    {/* Trusted Seller Badge */}
                    <img
                      src={ts}
                      alt="Trusted Seller"
                      className="approval-trusted-seller-icon"
                    />

                    {/* Buttons */}
                    <div className="approval-button-container">
                      <button
                        className="btn btn-primary shadow-sm mt-2"
                        onClick={() => handleMoreDetailsClick(approval)}
                      >
                        More Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

export default ThreePieceTBR;

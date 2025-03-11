import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaBars } from 'react-icons/fa';
import RubberGranuelsimg2 from './images/RubberGranules2.jpeg';
import ts from './images/ts.svg'; // Trusted Seller Image
import './Mulch';  // Add any custom CSS styling if needed
import { Link } from "react-router-dom"; // Use Link for React Router
import RubberCrumSteelImage1 from './images/RubberCrumSteel1.jpg';

function RubberGranules() {
  const [approvals, setApprovals] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Track loading status

  const categories = [
    { name: "Three Piece PCR", path: "/threepiecepcr" },
    { name: "Shreds", path: "/shreds" },
    { name: "Baled Tyres TBR", path: "/baledtyrestbr" },
    { name: "Three Piece TBR", path: "/threepiecetbr" },
    { name: "Mulch PCR", path: "/mulchpcr" },
    { name: "Baled Tyres PCR", path: "/BaledTyresPcr" },
  ];

    useEffect(() => {
        // Directly set the scroll position to the top of the page
        document.documentElement.scrollTop = 0; 
        document.body.scrollTop = 0;  // For compatibility with older browsers
      }, []); // Empty dependency array ensures it runs only once on page load
  
      
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchApprovalDetails() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/approvals`, {
          params: { application: 'Rubber Granules/Crum' }
        });
  
        const approvalsData = response.data.approvals;
        setApprovals(approvalsData);
  
        if (approvalsData.length > 0 && approvalsData[0].postedBy) {
          const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${approvalsData[0].postedBy._id}`);
          setUserDetails(userResponse.data);
        }
      } catch (error) {
        console.error('Error fetching approval details:', error);
      } finally {
        setLoading(false); // Set loading to false once the request completes
      }
    }
  
    fetchApprovalDetails();
  }, []);
  

  // Handle mobile resizing for categories dropdown
  const handleMoreDetailsClick = (approval) => {
    navigate('/moredetails', { state: { approval } });
  };

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

  
  // Display "Loading" state when fetching
  if (loading) {
    return (
      <div className="productleftside">
        <div className="setter">
          <div className="container">
            <h2 className="text-primary fw-bold text-left mt-5 btphead">Rubber Granules/Crumb</h2>
            <div className="row align-items-center mt-3">
              <div className="col-md-7">
                <p className="text-justify">
                  Rubber Granules are a sustainable material made from recycled rubber, commonly used in sports fields, playgrounds, and industrial applications. It provides excellent shock absorption and durability.
                </p>
              </div>
              <div className="col-md-5">
                <Slider {...carouselSettings} className="custom-carousel">
                  <div>
                    <img
                      src={RubberGranuelsimg2}
                      alt="Baled Tyres PCR Image 1"
                      className="img-fluid carousel-image"
                    />
                  </div>
                  <div>
                    <img
                      src={RubberCrumSteelImage1}
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

   // Display "No Stock Available" if no approvals found
  if (approvals.length === 0) {
    return (
      <div className="productleftside">
        <div className="setter">
          <div className="container">
            <h2 className="text-primary fw-bold text-left mt-5 btphead">Rubber Granules/Crum</h2>
            <div className="row align-items-center mt-3">
              <div className="col-md-7">
                <p className="text-justify">
                  Rubber Granules are a sustainable material made from recycled rubber, commonly used in sports fields, playgrounds, and industrial applications. It provides excellent shock absorption and durability.
                </p>
              </div>
              <div className="col-md-5">
                <Slider {...carouselSettings} className="custom-carousel">
                  <div>
                    <img
                      src={RubberGranuelsimg2}
                      alt="Baled Tyres PCR Image 1"
                      className="img-fluid carousel-image"
                    />
                  </div>
                  <div>
                    <img
                      src={RubberCrumSteelImage1}
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



  return (
    <>
        <div className='productleftside'>
      <div className="setter">
        <div className="container">
          {/* Centered Heading and Content Section */}
          <h2 className="text-primary fw-bold text-left mt-5 btphead">Rubber Granules/Crum</h2>
          <div className="row align-items-center mt-3">
            <div className="col-md-6">
              <p className="text-justify">
                Rubber Granules are made from recycled rubber, primarily used for eco-friendly applications such as shock absorption in playgrounds, sports fields, and even in industrial uses.
              </p>
            </div>
            {/* Carousel Section */}
            <div className="col-md-5">
              <Slider {...carouselSettings} className="custom-carousel">
                <div>
                  <img
                    src={RubberGranuelsimg2}
                    alt="Baled Tyres PCR Image 1"
                    className="img-fluid carousel-image"
                  />
                </div>
                <div>
                  <img
                    src={RubberCrumSteelImage1}
                    alt="Baled Tyres PCR Image 2"
                    className="img-fluid carousel-image"
                  />
                </div>
              </Slider>
            </div>
          </div>

          {/* Categories Section */}
          <h2 className="fw-bold text-dark mt-5">Related Categories</h2>
          <div className="categoriess-container">
            <div className={`categories-box shadow-sm ${isMobile ? 'w-auto' : 'w-25'}`}>
              <h6 className="text-dark fw-bold border-bottom pb-2 d-flex align-items-center">
                {isMobile && (
                  <button className="btn btn-sm btn-dark me-2" onClick={() => setIsOpen(!isOpen)}>
                    <FaBars />
                  </button>
                )}
                Categories
              </h6>
              {(!isMobile || isOpen) && (
                <div className={`category-list ${isOpen ? 'show' : 'hide'}`}>
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

          {/* Seller's Products Section */}
          <h2 className="fw-bold text-dark mt-5">Seller's Products</h2>
          <div className="approval-cards-container">
            {approvals.map((approval) => (
              <div key={approval._id} className="approval-card">
                {/* IMAGE SECTION */}
                {approval.images?.[0] && (
                  <div className="approval-image-container">
                    <img
                      src={approval.images[0]}
                      alt="Approval Image"
                      className="approval-card-image"
                    />
                  </div>
                )}

                {/* CONTENT SECTION */}
                <div className="approval-card-body">
                  <h5 className="approval-title">{approval.application}</h5>
                  <h6 className="approval-material">{approval.material}</h6>
                  <p className="approval-price">
                    <strong>Price:</strong> {approval.price} INR/MT
                  </p>
                  {userDetails?.businessProfiles?.[0] && (
                    <p className="approval-seller">
                      <strong>By:</strong> {approval.postedBy?.businessProfiles[0]?.profileId}
                    </p>
                  )}
                  <p className="approval-location">
                    <FaMapMarkerAlt className="approval-location-icon" />
                    <strong>Loading Location:</strong> {approval.loadingLocation}
                  </p>
                  <img src={ts} alt="Trusted Seller" className="approval-trusted-seller-icon" />
                  <div className="approval-button-container">
                    <button className="btn btn-primary shadow-sm mt-2" onClick={() => handleMoreDetailsClick(approval)}>
                      More Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default RubberGranules;

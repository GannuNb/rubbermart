import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa"; // Location Icon
import { FaBars } from "react-icons/fa"; // Hamburger Icon
import ShreddsImage from './images/Shredds.jpeg';
import Slider from "react-slick"; // Carousel import
import { Link } from "react-router-dom"; // Use Link for React Router
import ts from "./images/ts.svg"; // Trusted Seller Image
import "./Mulch.css"; // Import your CSS file

function Shredds() {
  const [approvals, setApprovals] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
      const [loading, setLoading] = useState(true); // New state to track loading status
  
  const categories = [
    { name: "Three Piece PCR", path: "/threepiecepcr" },
    { name: "Baled Tyres PCR", path: "/BaledTyresPcr" },
    { name: "Baled Tyres TBR", path: "/baledtyrestbr" },
    { name: "Three Piece TBR", path: "/threepiecetbr" },
    { name: "Mulch PCR", path: "/mulchpcr" },
    { name: "Rubber Granules/Crumb", path: "/RubberGranules/Crum" },
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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchApprovalDetails() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/approvals`, {
          params: { application: "Shreds" }
        });

        const approvalsData = response.data.approvals;
        setApprovals(approvalsData);

        if (approvalsData.length > 0 && approvalsData[0].postedBy) {
          const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${approvalsData[0].postedBy._id}`);
          setUserDetails(userResponse.data);
        }
      } catch (error) {
        console.error("Error fetching approval details:", error);
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

  // If approvals or userDetails are empty or unavailable, show only the image and description
  if (loading) {
    return (
      <div className='productleftside'>
        <div className="setter">
          <div className="container">
            {/* Centered Heading at the Top */}
            <h2 className="text-primary fw-bold text-left mt-5 btphead">Shreds</h2>
            <div className="row align-items-center mt-3">
              {/* Content Section */}
              <div className="col-md-7">
                <p className="text-justify">
                  <strong>Shreds</strong> are finely shredded recycled materials used in landscaping, construction, road-making, and other industries.
                  These materials offer an eco-friendly, cost-effective, and durable alternative to traditional materials.
                  <strong>Shreds</strong> play a significant role in reducing landfill waste, conserving natural resources, and supporting sustainability efforts.
                </p>
              </div>

              {/* Carousel Section */}
              <div className="col-md-5">
                <Slider {...carouselSettings} className="custom-carousel">
                  <div>
                    <img
                      src={ShreddsImage}
                      alt="ShreddsImage"
                      className="img-fluid carousel-image"
                    />
                  </div>
                  <div>
                    <img
                      src={ShreddsImage}
                      alt="ShreddsImage"
                      className="img-fluid carousel-image"
                    />
                  </div>
                </Slider>
              </div>
            </div>
          </div>
          <div className="no-stock-wrapper">
          <h1>Loading...</h1>
        </div>
        </div>
      </div>
    );
  }

  // If approvals or userDetails are empty or unavailable, show only the image and description
  if (approvals.length === 0 || !userDetails) {
    return (
      <div className='productleftside'>
        <div className="setter">
          <div className="container">
            {/* Centered Heading at the Top */}
            <h2 className="text-primary fw-bold text-left mt-5 btphead">Shreds</h2>
            <div className="row align-items-center mt-3">
              {/* Content Section */}
              <div className="col-md-7">
                <p className="text-justify">
                  <strong>Shreds</strong> are finely shredded recycled materials used in landscaping, construction, road-making, and other industries.
                  These materials offer an eco-friendly, cost-effective, and durable alternative to traditional materials.
                  <strong>Shreds</strong> play a significant role in reducing landfill waste, conserving natural resources, and supporting sustainability efforts.
                </p>
              </div>

              {/* Carousel Section */}
              <div className="col-md-5">
                <Slider {...carouselSettings} className="custom-carousel">
                  <div>
                    <img
                      src={ShreddsImage}
                      alt="ShreddsImage"
                      className="img-fluid carousel-image"
                    />
                  </div>
                  <div>
                    <img
                      src={ShreddsImage}
                      alt="ShreddsImage"
                      className="img-fluid carousel-image"
                    />
                  </div>
                </Slider>
              </div>
            </div>
          </div>
          <div className="no-stock-wrapper">
          <h1>No Stock Available</h1>
        </div>
        </div>
      </div>
    );
  }

  const handleMoreDetailsClick = (approval) => {
    navigate("/moredetails", { state: { approval } });
  };

  return (
    <>
      <div className='productleftside'>
        <div className="setter">
          <div className="container">
            <div className="container">
              {/* Centered Heading at the Top */}
              <h2 className="text-primary fw-bold text-left mt-5 btphead">Shredds</h2>
              <div className="row align-items-center mt-3">
                {/* Content Section */}
                <div className="col-md-7">
                  <p className="text-justify">
                    <strong>Shreds</strong> are finely shredded recycled materials used in landscaping, construction, road-making, and other industries.
                    These materials offer an eco-friendly, cost-effective, and durable alternative to traditional materials.
                    <strong>Shreds</strong> play a significant role in reducing landfill waste, conserving natural resources, and supporting sustainability efforts.
                  </p>
                </div>

                {/* Carousel Section */}
                <div className="col-md-5">
                  <Slider {...carouselSettings} className="custom-carousel">
                    <div>
                      <img
                        src={ShreddsImage}
                        alt="ShreddsImage"
                        className="img-fluid carousel-image"
                      />
                    </div>
                    <div>
                      <img
                        src={ShreddsImage}
                        alt="ShreddsImage"
                        className="img-fluid carousel-image"
                      />
                    </div>
                  </Slider>
                </div>
              </div>
            </div>

            <h2 className="fw-bold text-dark  mt-5">Seller's Products</h2>
            <div className="categoriess-container">
              <div className={`categories-box shadow-sm ${isMobile ? "w-auto" : "w-25"}`}>
                <h6 className="text-dark fw-bold border-bottom pb-2 d-flex align-items-center">
                  {isMobile && (
                    <button
                      className="btn btn-sm btn-dark me-2"
                      onClick={() => setIsOpen(!isOpen)} // Toggle dropdown on click
                    >
                      <FaBars />
                    </button>
                  )}
                  Related Categories
                </h6>

                {/* Show categories only if it's desktop or dropdown is open */}
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

            {/* Card Section */}
            {approvals.length > 0 && userDetails && (
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

                    {/* Divider Line (Only Visible in Desktop) */}
                    <div className="approval-divider"></div>

                    {/* CONTENT SECTION */}
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
                          <strong>By:</strong>{" "}
                          {approval.postedBy?.businessProfiles[0]?.profileId}
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

export default Shredds;

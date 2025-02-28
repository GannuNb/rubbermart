import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick"; // Carousel import
import ts from "./images/ts.svg"; // Trusted Seller Image
import { FaMapMarkerAlt } from "react-icons/fa"; // Location Icon
import PyroSteelImage from './images/PyroSteel.jpeg';
import PyroSteelImage2 from './images/PyroSteel2.webp';

function PyroSteel() {
  const [approvals, setApprovals] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate(); // Hook to navigate to another route

  useEffect(() => {
    async function fetchApprovalDetails() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/approvals`, {
          params: { application: 'Pyro Steel' }
        });

        const approvalsData = response.data.approvals;
        setApprovals(approvalsData);

        if (approvalsData.length > 0 && approvalsData[0].postedBy) {
          const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${approvalsData[0].postedBy._id}`);
          setUserDetails(userResponse.data);
        }
      } catch (error) {
        console.error('Error fetching approval details:', error);
      }
    }

    fetchApprovalDetails();
  }, []);

// If approvals are empty or userDetails are unavailable, show only the image and description
if (approvals.length === 0 || !userDetails) {
  return (
    <div className='productleftside'>
    <div className="setter">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-6">
            <img src={PyroSteelImage} alt="Pyro Steel" className="img-fluid imgmore" />
          </div>
          <div className="col-md-6">
            <h2 className="text-center">Pyro Steel</h2>
            <p>
              Pyro Steel is a high-quality product made from recycled materials that meets stringent industry standards. It is widely used in various applications, including manufacturing and construction.
              This material is ideal for those seeking an environmentally friendly and cost-effective solution.
            </p>
          </div>
        </div>
      </div>
      <div className="no-stock-wrapper">
      <h1>No Stock Availble</h1>
      </div>
    </div>
    </div>
  );
}



  const handleMoreDetailsClick = (approval) => {
    // Navigate to the /moredetails page and pass the approval data
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
  

  return (
    <>
    <div className='productleftside'>
      <div className="setter ">
        <div className="container">
          <div className="container">
            {/* Centered Heading at the Top */}
            <h2 className="text-primary fw-bold text-left mt-5 btphead">Pyro Steel</h2>
            <div className="row align-items-center mt-3">
              {/* Content Section */}
              <div className="col-md-6">
                <p className="text-justify">
                Pyro Steel is a high-quality product made from recycled materials that meets stringent industry standards. 
                It is widely used in various applications, including manufacturing and construction.
                This material is ideal for those seeking an environmentally friendly and cost-effective solution.

                </p>
              </div>

              {/* Carousel Section */}
              <div className="col-md-5">
                <Slider {...carouselSettings} className="custom-carousel">
                  <div>
                    <img
                      src={PyroSteelImage}
                      alt="Baled Tyres PCR Image 1"
                      className="img-fluid carousel-image"
                    />
                  </div>
                  <div>
                    <img
                      src={PyroSteelImage2}
                      alt="Baled Tyres PCR Image 2"
                      className="img-fluid carousel-image"
                    />
                  </div>
                </Slider>
              </div>
            </div>
          </div>

          <h2 className="fw-bold text-dark  mt-5">Seller's Products</h2>
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

export default PyroSteel;

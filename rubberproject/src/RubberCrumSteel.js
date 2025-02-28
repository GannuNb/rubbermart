import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import rubbercrumimg1 from './images/rubbercrumbtw3.jpg'; // Rubber Crumb Image
import './Mulch.css';
import Slider from "react-slick"; // Carousel import
import ts from "./images/ts.svg"; // Trusted Seller Image
import { FaMapMarkerAlt } from "react-icons/fa"; // Location Icon

function RubberCrumSteel() {
  const [approvals, setApprovals] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchApprovalDetails() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/approvals`, {
          params: { application: 'Rubber Crum Steel' }
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

  // If no approvals or user details are available, show the image and description
  if (approvals.length === 0 || !userDetails) {
    return (
      <div className='productleftside'>
      <div className='setter'>
                <div className="container">
            {/* Centered Heading at the Top */}
            <h2 className="text-primary fw-bold text-left mt-5 btphead">Rubber Crumb Steel</h2>
            <div className="row align-items-center mt-3">
              {/* Content Section */}
              <div className="col-md-6">
                <p className="text-justify">
                Rubber Crumb Steel is an advanced material made by combining rubber crumb and steel. 
                It is widely used for various applications, including in construction and manufacturing. This product is durable, cost-effective, 
                and an environmentally friendly alternative to conventional materials.

                </p>
              </div>

              {/* Carousel Section */}
              <div className="col-md-5">
                <Slider {...carouselSettings} className="custom-carousel">
                  <div>
                    <img
                      src={rubbercrumimg1}
                      alt="Baled Tyres PCR Image 1"
                      className="img-fluid carousel-image"
                    />
                  </div>
                  <div>
                    <img
                      src={rubbercrumimg1}
                      alt="Baled Tyres PCR Image 2"
                      className="img-fluid carousel-image"
                    />
                  </div>
                </Slider>
              </div>
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
      <div className="setter ">
        <div className="container">
          <div className="container">
            {/* Centered Heading at the Top */}
            <h2 className="text-primary fw-bold text-left mt-5 btphead">Rubber Crumb Steel</h2>
            <div className="row align-items-center mt-3">
              {/* Content Section */}
              <div className="col-md-6">
                <p className="text-justify">
                Rubber Crumb Steel is an advanced material made by combining rubber crumb and steel. 
                It is widely used for various applications, including in construction and manufacturing. This product is durable, cost-effective, 
                and an environmentally friendly alternative to conventional materials.

                </p>
              </div>

              {/* Carousel Section */}
              <div className="col-md-5">
                <Slider {...carouselSettings} className="custom-carousel">
                  <div>
                    <img
                      src={rubbercrumimg1}
                      alt="Baled Tyres PCR Image 1"
                      className="img-fluid carousel-image"
                    />
                  </div>
                  <div>
                    <img
                      src={rubbercrumimg1}
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

export default RubberCrumSteel;

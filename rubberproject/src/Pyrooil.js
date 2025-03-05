import React, { useState, useEffect } from 'react';
import axios from 'axios';
import pyrooilImage from './images/pyro_oil2.jpeg'; // Ensure the image path is correct
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './Mulch.css';
import Slider from "react-slick"; // Carousel import
import ts from "./images/ts.svg"; // Trusted Seller Image
import { FaMapMarkerAlt } from "react-icons/fa"; // Location Icon
import { FaBars } from "react-icons/fa";

function Pyrooil() {
  const [approvals, setApprovals] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // New state to track loading status

  useEffect(() => {
    async function fetchApprovalDetails() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/approvals`, {
          params: { application: 'Pyro Oil' }
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
                   <div className="container">
              {/* Centered Heading at the Top */}
              <h2 className="text-primary fw-bold text-left mt-5 btphead">Pyro Oil</h2>
              <div className="row align-items-center mt-3">
                {/* Content Section */}
                <div className="col-md-6">
                  <p className="text-justify">
                  Pyro Oil is a premium by-product obtained from the pyrolysis of rubber. It is used in various industrial applications,
                   offering both cost savings and environmental benefits. This product is ideal for those seeking a sustainable energy solution.
                  </p>
                </div>
  
                {/* Carousel Section */}
                <div className="col-md-5">
                  <Slider {...carouselSettings} className="custom-carousel">
                    <div>
                      <img
                        src={pyrooilImage}
                        alt="Baled Tyres PCR Image 1"
                        className="img-fluid carousel-image"
                      />
                    </div>
                    <div>
                      <img
                        src={pyrooilImage}
                        alt="Baled Tyres PCR Image 2"
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

  // If approvals or user details are unavailable, show the image and description only
  if (approvals.length === 0 || !userDetails) {
    return (
      <div className='productleftside'>
      <div className="setter">
                 <div className="container">
            {/* Centered Heading at the Top */}
            <h2 className="text-primary fw-bold text-left mt-5 btphead">Pyro Oil</h2>
            <div className="row align-items-center mt-3">
              {/* Content Section */}
              <div className="col-md-6">
                <p className="text-justify">
                Pyro Oil is a premium by-product obtained from the pyrolysis of rubber. It is used in various industrial applications,
                 offering both cost savings and environmental benefits. This product is ideal for those seeking a sustainable energy solution.
                </p>
              </div>

              {/* Carousel Section */}
              <div className="col-md-5">
                <Slider {...carouselSettings} className="custom-carousel">
                  <div>
                    <img
                      src={pyrooilImage}
                      alt="Baled Tyres PCR Image 1"
                      className="img-fluid carousel-image"
                    />
                  </div>
                  <div>
                    <img
                      src={pyrooilImage}
                      alt="Baled Tyres PCR Image 2"
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
    navigate('/moredetails', { state: { approval } });
  };

  return (
    <>

<div className='productleftside'>
      <div className="setter ">
        <div className="container">
          <div className="container">
            {/* Centered Heading at the Top */}
            <h2 className="text-primary fw-bold text-left mt-5 btphead">Pyro Oil</h2>
            <div className="row align-items-center mt-3">
              {/* Content Section */}
              <div className="col-md-6">
                <p className="text-justify">
                Pyro Oil is a premium by-product obtained from the pyrolysis of rubber. It is used in various industrial applications,
                 offering both cost savings and environmental benefits. This product is ideal for those seeking a sustainable energy solution.
                </p>
              </div>

              {/* Carousel Section */}
              <div className="col-md-5">
                <Slider {...carouselSettings} className="custom-carousel">
                  <div>
                    <img
                      src={pyrooilImage}
                      alt="Baled Tyres PCR Image 1"
                      className="img-fluid carousel-image"
                    />
                  </div>
                  <div>
                    <img
                      src={pyrooilImage}
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

export default Pyrooil;

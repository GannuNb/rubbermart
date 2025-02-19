import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "./Mulch.css";
import ts from "./images/ts.svg"; // Trusted Seller Image
import { FaMapMarkerAlt } from "react-icons/fa"; // Location Icon

function MultipleBaledTyresPCR() {
  const [approvals, setApprovals] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchApprovalDetails() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/approvals`,
          {
            params: { application: "Baled Tyres PCR" },
          }
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
        console.error("Error fetching approval details:", error);
      }
    }

    fetchApprovalDetails();
  }, []);

  if (approvals.length === 0 || !userDetails) {
    return (
      <div className="setter">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-6">
              <h2> Baled Tyres PCR</h2>
              <p>
                 Baled Tyres PCR (Pre-Crushed Rubber) is a versatile
                material derived from recycled tyres. It is commonly used in
                various industries such as construction and automotive,
                providing an eco-friendly and cost-efficient alternative.
              </p>
            </div>
          </div>
        </div>
        <div className="no-stock-wrapper">
          <h1>No Stock Available</h1>
        </div>
      </div>
    );
  }

  const handleMoreDetailsClick = (approval) => {
    navigate("/moredetails", { state: { approval } });
  };

  return (
    <>
      <div className="setter">
        <div className="container">
          <div className="row py-5">
            <div className="col-md-12">
              <h2 className="text-primary">Baled Tyres PCR</h2>
              <p className="text-justify">
                Baled Tyres PCR (Pre-Crushed Rubber) is a **versatile and
                eco-friendly material** derived from recycled tyres. It is
                widely used in **construction, automotive, sports, and
                agriculture** due to its **durability, shock absorption, and
                cost-effectiveness**. In construction, it enhances road quality
                and reduces noise, while in the automotive industry, it is used
                for **tyres, mats, and coatings**. Sports fields and playgrounds
                benefit from its cushioning properties, and in agriculture, it
                is used as **rubber mulch** to retain moisture and prevent
                weeds. By recycling tyres, this material helps **reduce landfill
                waste, lower carbon emissions, and promote sustainability**
                across industries.
              </p>
            </div>
          </div>
            <h2 > Sellers Product</h2>
          {/* CARD SECTION */}
          {approvals.length > 0 && userDetails && (
            <div className="row mt-3 g-3 cards-container">
              {" "}
              {/* Added Bootstrap's g-3 for spacing */}
              {approvals.map((approval) => (
                <div
                  key={approval._id}
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 d-flex justify-content-center"
                >
                  <div
                    className="card shadow-sm border p-2 w-100"
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      maxWidth: "320px", // Increased width for laptop screens
                      minWidth: "270px", // Ensures it doesn’t get too small
                      borderColor: "#ddd", // Light border color
                      margin: "10px", // Extra margin to avoid overlap
                    }}
                  >
                    {/* IMAGE */}
                    {approval.images?.[0] && (
                      <div
                        style={{
                          borderBottom: "1px solid #ddd",
                          paddingBottom: "10px",
                        }}
                      >
                        <img
                          src={approval.images[0]}
                          alt="Approval Image"
                          className="card-img-top"
                          style={{
                            maxHeight: "150px",
                            objectFit: "cover",
                            width: "100%",
                            transition: "none", // Disables hover animations
                            transform: "none", // Ensures no scaling effect
                          }}
                        />
                      </div>
                    )}

                    {/* CARD BODY (LEFT-ALIGNED) */}
                    <div className="card-body text-start">
                      {/* application */}
                      <h5 className="text-dark fw-semibold">
                        {approval.application}
                      </h5>

                      {/* material */}
                      <h6  style={{ fontSize: "93%" }} className="text-secondary">{approval.material}</h6>

                      {/* PRICE (Smaller Font) */}
                      <p className="mb-1" style={{ fontSize: "86%" }}>
                        <strong>Price:</strong>{" "}
                        <span >
                          {approval.price} INR/Unit
                        </span>
                      </p>

                      {/* SELLER DETAILS (Smaller Font & Gray) */}
                      {userDetails?.businessProfiles?.[0] && (
                        <p
                          className="mb-2 text-secondary"
                          style={{ fontSize: "86%" }}
                        >
                          <strong>By:</strong>{" "}
                          {approval.postedBy?.businessProfiles[0]?.profileId}
                        </p>
                      )}

                      {/* LOADING LOCATION (Smaller Font) */}
                      <p className="mb-1" style={{ fontSize: "86%" }}>
                      <FaMapMarkerAlt className="me-1 text-danger" />{" "}
                        <strong>Loading Location:</strong>{" "}
                        {approval.loadingLocation}
                      </p>
                     
                     
                    <img src={ts} alt="Trusted Seller" className="trusted-seller-icon mt-3" />
                 


                      {/* BUTTON - Full width, smaller size */}
                      <button
                        className="btn btn-primary w-100 fw-bold shadow-sm mt-2"
                        style={{
                          borderRadius: "6px",
                          padding: "8px",
                          fontSize: "12px",
                        }}
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
    </>
  );
}

export default MultipleBaledTyresPCR;

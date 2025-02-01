import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import PyroSteelImage from './images/PyroSteel.jpeg'; // Ensure the image path is correct

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
    <div className="setter">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-6">
            <img src={PyroSteelImage} alt="Pyro Steel" className="img-fluid" />
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
  );
}



  const handleMoreDetailsClick = (approval) => {
    // Navigate to the /moredetails page and pass the approval data
    navigate('/moredetails', { state: { approval } });
  };

  return (
    <>
      <div className="setter">
        <div className="container">
          <div className="row py-5">
            <div className="col-md-6">
              <img src={PyroSteelImage} alt="Pyro Steel" className="img-fluid" />
            </div>
            <div className="col-md-6">
              <h2 className="text-center">Pyro Steel</h2>
              <p>
                Pyro Steel is a high-quality product made from recycled materials that meets stringent industry standards. It is widely used in various applications, including manufacturing and construction.
                This material is ideal for those seeking an environmentally friendly and cost-effective solution.
              </p>
            </div>
          </div>

          <div className="container mt-5 d-flex justify-content-center">
            <div className="w-100">
              <h3 className="mb-4 text-primary fw-bold text-center">Approval Details</h3>

              {approvals.map((approval) => (
                <div
                  key={approval._id}
                  className="card mb-3 shadow-sm border-0 p-2"
                  style={{
                    backgroundColor: "#f9f9f9",
                    borderRadius: "12px",
                    width: "85%", // Maintain width
                    margin: "0 auto",
                  }}
                >
                  <div className="card-body p-3">
                    <div className="row align-items-center">
                      {/* Left: Image Section */}
                      <div className="col-md-4 text-center">
                        {approval.images?.[0] && (
                          <img
                            src={approval.images[0]}
                            alt="Approval Image"
                            className="img-fluid rounded shadow-sm"
                            style={{
                              maxHeight: "200px", // Reduced image height
                              maxWidth: "100%",
                              borderRadius: "10px",
                            }}
                          />
                        )}
                      </div>

                      {/* Right: Details Section */}
                      <div className="col-md-8">
                        <div className="row">
                          {/* Scrap Details */}
                          <div className="col-md-6">
                            <h5 className="mb-1 text-dark fw-semibold">{approval.material}</h5>
                            <h6 className="text-secondary mb-1">{approval.application}</h6>
                            <p className="mb-1">
                              <strong>Price:</strong> <span className="text-success">{approval.price} INR</span>
                            </p>
                            <p className="mb-1">
                              <strong>Loading Location:</strong> {approval.loadingLocation}
                            </p>
                            <p className="mb-1">
                              <strong>Country of Origin:</strong> {approval.countryOfOrigin}
                            </p>
                          </div>

                          {/* User Details */}
                          {userDetails?.businessProfiles?.[0] && (
                            <div className="col-md-6">
                              <h6 className="text-primary">Seller Details:</h6>
                              <p className="mb-1">
                                <strong>Seller ID:</strong> {userDetails.businessProfiles[0].profileId}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Buttons Section */}
                        <div className="mt-3 d-flex gap-2">
                          <button
                            className="btn btn-primary px-3 py-1 fw-bold shadow-sm"
                            style={{ borderRadius: "8px" }}
                            onClick={() => handleMoreDetailsClick(approval)}
                          >
                            More Details
                          </button>
                        </div>
                      </div>
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

export default PyroSteel;

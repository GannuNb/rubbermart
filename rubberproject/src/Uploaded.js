import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sell.css";
import Adminnav from "./Adminnav";
import { useNavigate } from "react-router-dom";

const Uploaded = () => {
  const [scrapItems, setScrapItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const tokenKey = `admin_token`; // Check if any valid token exists
    if (localStorage.getItem(tokenKey)) {
      setIsAuthenticated(true); // If the token is found, user is authenticated
    } else {
      // If no token, navigate to the login page
      navigate("/admin"); // Adjust this path to match your actual login page route
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchScrapData = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/getuploadedscrap`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            },
          }
        );
        setScrapItems(response.data.uploadedScrapItems);
      } catch (error) {
        console.error("Error fetching scrap items:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScrapData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/approveScrap/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setScrapItems(scrapItems.filter((item) => item._id !== id));
      alert(response.data.message || "Scrap item approved.");
    } catch (error) {
      console.error("Error approving scrap item:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to approve the scrap item."
      );
    }
  };

  const handleDeny = async (id) => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/denyScrap/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setScrapItems(scrapItems.filter((item) => item._id !== id));
      alert(response.data.message || "Scrap item denied.");
    } catch (error) {
      console.error("Error denying scrap item:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to deny the scrap item."
      );
    }
  };

  // Loading and error handling
  if (loading)
    return <div className="text-center mt-5">Loading scrap items...</div>;

  return (
    <>
      <Adminnav />
      <div className="container my-5">
        <h2 className="text-center mb-4">Uploaded Scrap Items</h2>
        {scrapItems.length === 0 ? (
          <p className="text-center">No scrap items uploaded yet.</p>
        ) : (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="table table-striped table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Material</th>
                  <th>Application</th>
                  <th>Quantity</th>
                  <th>Company Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Country of origin</th>
                  <th>Loading Location</th>
                  <th>Price</th>
                  <th>Uploaded At</th>
                  <th>Images</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scrapItems.map((scrap) => (
                  <tr key={scrap._id}>
                    <td>{scrap.material}</td>
                    <td>{scrap.application}</td>
                    <td>{scrap.quantity}</td>
                    <td>{scrap.companyName}</td>
                    <td>{scrap.phoneNumber}</td>
                    <td>{scrap.email}</td>
                    <td>{scrap.countryOfOrigin}</td>
                    <td>{scrap.loadingLocation}</td>
                    <td>{scrap.price}</td>
                    <td>{new Date(scrap.uploadedAt).toLocaleString()}</td>
                    <td>
                      {scrap.imagesBase64 && scrap.imagesBase64.length > 0 ? (
                        <div className="d-flex">
                          {scrap.imagesBase64.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Scrap Image ${index + 1}`}
                              style={{
                                width: "100px",
                                height: "100px",
                                marginRight: "10px",
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <p>No images</p>
                      )}
                    </td>
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <button
                        className="btn btn-success btn-custom me-2"
                        onClick={() => handleApprove(scrap._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-custom"
                        onClick={() => handleDeny(scrap._id)}
                      >
                        Deny
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {error && <div className="text-center text-danger mt-4">{error}</div>}
      </div>
    </>
  );
  
};

export default Uploaded;

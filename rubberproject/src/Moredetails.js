import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Moredetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { approval } = location.state || {}; 
  const [mainImage, setMainImage] = useState(approval?.images?.[0] || ""); 
  const [requiredQuantity, setRequiredQuantity] = useState(""); 

  if (!approval) {
    return <div>No approval data available.</div>;
  }

  const handleImageClick = (image) => {
    setMainImage(image); 
  };

  const handleOrderClick = () => {
    navigate("/Order", {
      state: {
        name: approval.application,
        available_quantity: approval.quantity,
        price: approval.price, 
        required_quantity: requiredQuantity,
        selected_location: approval.loadingLocation, 
        hsn: "40040000", 
        id: approval.postedBy?._id,
        scrapid: approval._id,
      },
    });
  };

  const isOrderButtonDisabled = requiredQuantity <= 0 || requiredQuantity > approval.quantity;

  return (
    <div className="setter">
      <div className="container mt-5">
        <h1 className="mb-4 text-center">Specifications</h1>
        <div className="row">
          
          <div className="col-md-6 d-flex flex-column align-items-center">
            <img
              src={mainImage}
              alt="Main Image"
              className="img-fluid mb-4"
              style={{
                width: "80%",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
            <div className="d-flex flex-wrap justify-content-start">
              {approval.images &&
                approval.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Approval Image ${index + 1}`}
                    className="img-thumbnail me-2 mb-2"
                    style={{
                      maxWidth: "80px",
                      height: "auto",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                      cursor: "pointer",
                    }}
                    onClick={() => handleImageClick(image)}
                  />
                ))}
            </div>
          </div>

          <div className="col-md-6">
            <table className="table table-bordered">
            <tbody>
    <tr>
        <th style={{ fontWeight: 'bold' }}>Material</th>
        <td>{approval.material}</td>
    </tr>
    <tr>
        <th style={{ fontWeight: 'bold' }}>Application</th>
        <td>{approval.application}</td>
    </tr>
    <tr>
        <th style={{ fontWeight: 'bold' }}>Available Quantity</th>
        <td>{approval.quantity}</td>
    </tr>
    {/* <tr>
        <th style={{ fontWeight: 'bold' }}>Company Name</th>
        <td>{approval.companyName}</td>
    </tr>
    <tr>
        <th style={{ fontWeight: 'bold' }}>Email</th>
        <td>{approval.email}</td>
    </tr> */}
    <tr>
        <th style={{ fontWeight: 'bold' }}>Price</th>
        <td>{approval.price}</td>
    </tr>
    <tr>
        <th style={{ fontWeight: 'bold' }}>Loading Location</th>
        <td>{approval.loadingLocation}</td>
    </tr>
    <tr>
        <th style={{ fontWeight: 'bold' }}>Hsn</th>
        <td>40040000</td>
    </tr>
    <tr>
        <th style={{ fontWeight: 'bold' }}>Country of Origin</th>
        <td>{approval.countryOfOrigin}</td>
    </tr>
    <tr>
        <th colSpan="2" className="text-center" style={{ fontWeight: 'bold' }}>
            Seller Details
        </th>
    </tr>
    


    {/* <tr>
        <th style={{ fontWeight: 'bold' }}>Name</th>
        <td>{approval.postedBy?.name}</td>
    </tr> */}
    <tr>
        <th style={{ fontWeight: 'bold' }}>Seller ID</th>
        <td>{approval.postedBy?.businessProfiles[0]?.profileId}</td>
    </tr>
    {/* <tr>
        <th style={{ fontWeight: 'bold' }}> ID</th>
        <td>{approval.postedBy?._id}</td>
    </tr> */}
    {/* <tr>
        <th style={{ fontWeight: 'bold' }}>Company Name</th>
        <td>{approval.postedBy?.businessProfiles[0]?.companyName}</td>
    </tr>
    <tr>
        <th style={{ fontWeight: 'bold' }}>Email</th>
        <td>{approval.postedBy?.email}</td>
    </tr> */}
</tbody>

            </table>
            
            <div className="mb-3">
              <label htmlFor="requiredQuantity" className="form-label">
                Required Quantity
              </label>
              <input
                type="number"
                id="requiredQuantity"
                className="form-control"
                value={requiredQuantity}
                onChange={(e) => setRequiredQuantity(e.target.value)}
                min="1"
                max={approval.quantity} 
                required
              />
            </div>

            {requiredQuantity > approval.quantity && (
              <div className="alert alert-danger" role="alert">
                Required quantity cannot be greater than the available quantity.
              </div>
            )}

            <button
              onClick={handleOrderClick}
              className="btn btn-primary w-100 mt-3"
              disabled={isOrderButtonDisabled}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Moredetails;

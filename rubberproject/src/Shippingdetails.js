import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ShippingDetails() {
  const [shippingDetails, setShippingDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  // Check user authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to view shipping details.');
      navigate('/Login');
    }
  }, [navigate]);

  // Fetch shipping details
  useEffect(() => {
    const fetchShippingDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/shippinguser`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.shippingDetails) {
          setShippingDetails(response.data.shippingDetails);
        }
      } catch (err) {
        console.error('Error fetching shipping details:', err);
        setError('Failed to fetch shipping details.');
      } finally {
        setLoading(false);
      }
    };
    fetchShippingDetails();
  }, []);

  // Fetch business profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/business-profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.profileExists) {
          setProfile(response.data.businessProfile);
        }
      } catch (err) {
        console.error('Error fetching business profile:', err);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  // Group the shipping details by Order ID
  const groupedByOrder = shippingDetails.reduce((acc, detail) => {
    const orderId = detail.orderId?._id;
    if (orderId) {
      if (!acc[orderId]) {
        acc[orderId] = [];
      }
      acc[orderId].push(detail);
    } else {
      console.warn('Missing orderId for detail:', detail);
    }
    return acc;
  }, {});

  return (
    <div className="setter">
      <div className="container mt-5">
        <h2 className="text-center mb-4">Shipping Details</h2>
        {Object.keys(groupedByOrder).length === 0 ? (
          <p className="text-center">No shipping details available.</p>
        ) : (
          <div>
            {Object.keys(groupedByOrder).map((orderId) => (
              <div key={orderId} className="order-group">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Vehicle Number</th>
                        <th>Product</th>
                        <th>Shipped Quantity</th>
                        <th>Total Required Quantity</th>
                        <th>Remaining Quantity</th>
                        <th>Email</th>
                        <th>Item Prices</th>
                        <th>Subtotal</th>
                        <th>GST</th>
                        <th>Total Price</th>
                        <th>Shipping Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedByOrder[orderId].map((detail, index) => (
                        <tr key={detail._id}>
                          <td>{detail.orderId?._id || 'N/A'}</td>
                          <td>{detail.vehicleNumber}</td>
                          <td>{detail.selectedProduct}</td>
                          <td>{detail.quantity}</td>
                          <td>
                            {detail.itemDetails?.find((item) => item.name === detail.selectedProduct)?.quantity || 'N/A'}
                          </td>
                          <td>
                            {detail.itemDetails?.find((item) => item.name === detail.selectedProduct)
                              ? detail.itemDetails.find((item) => item.name === detail.selectedProduct).quantity -
                                groupedByOrder[orderId]
                                  .filter((ship) => ship.selectedProduct === detail.selectedProduct)
                                  .reduce((sum, ship) => sum + ship.quantity, 0)
                              : 'N/A'}
                          </td>
                          <td>{detail.email}</td>
                          <td>
                            ₹
                            {detail.itemDetails
                              ?.filter((item) => item.name === detail.selectedProduct)
                              .map((item) => item.price.toFixed(2))
                              .join(', ')}
                          </td>
                          <td>₹{detail.subtotal.toFixed(2)}</td>
                          <td>₹{detail.gst.toFixed(2)}</td>
                          <td>₹{detail.totalPrice.toFixed(2)}</td>
                          <td>{new Date(detail.shippingDate).toLocaleDateString()}</td>
                          <td>
                            {detail.billPdf?.base64 ? (
                              <button
                                className="btn btn-info"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = `data:${detail.billPdf.contentType};base64,${detail.billPdf.base64}`;
                                  link.download = `bill_${orderId}_${index}.pdf`;
                                  link.click();
                                }}
                              >
                                E-Way Bill
                              </button>
                            ) : (
                              <p>No Bill PDF</p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShippingDetails;

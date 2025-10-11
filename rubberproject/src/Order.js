import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Sell.css";
import "./Order.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./images/logo3.png";
import logo1 from "./images/logo.png";
import seal from "./images/seal1.png";
import { generatePDF } from "./utils/pdfGenerator";
import BusinessProfileDetails from "./Components//BusinessProfileDetails";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    sellerid,
    name,
    available_quantity,
    price,
    required_quantity,
    hsn,
    selected_location,
    id,
    scrapid,
  } = location.state || {};

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [orderAdded, setOrderAdded] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Redirect if required data missing
  useEffect(() => {
    if (!name || !price || !required_quantity || !hsn) {
      navigate("/", { replace: true });
    }
  }, [name, price, required_quantity, hsn, navigate]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated.");
          setLoading(false);
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/business-profile`,
          config
        );
        if (response.data.profileExists) {
          setProfile(response.data.businessProfile);
        } else {
          navigate("/BusinessProfile", { replace: true });
        }
      } catch (err) {
        setError("Failed to fetch profile.");
        console.error("Error fetching business profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/applications`,
          { params: { id } }
        );
        setApplications(response.data);
        setLoadingApplications(false);
      } catch (err) {
        setError("Failed to load applications");
        setLoadingApplications(false);
      }
    };
    if (id) fetchApplications();
  }, [id]);

  const handleApplicationChange = (e) => setSelectedApplication(e.target.value);
  const handleQuantityChange = (e) => setQuantity(e.target.value);

  // Add selected application to order
  const addToOrder = () => {
    if (!selectedApplication || !quantity) {
      alert("Please select an application and enter a quantity.");
      return;
    }

    const selectedApp = applications.find(
      (app) => app.application === selectedApplication
    );

    if (selectedApp && parseFloat(quantity) > selectedApp.quantity) {
      alert(`Required quantity exceeds available quantity of ${selectedApp.quantity} tons.`);
      return;
    }

    if (selectedApp) {
      const item = {
        sellerid,
        name: selectedApp.application,
        price: selectedApp.price,
        hsn: selectedApp.hsn || "40040000",
        quantity: parseFloat(quantity),
        loading_location: selectedApp.loadingLocation,
        total: selectedApp.price * parseFloat(quantity),
        scrapid: selectedApp.scrapid,
      };
      setOrderItems([...orderItems, item]);
      setSelectedApplication("");
      setQuantity("");
    }
  };

  // Render order summary
  const renderOrderSummary = () => {
    if (loadingApplications) return <div>Loading applications...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    const baseItems = [
      { sellerid, name, price, hsn, quantity: required_quantity, loading_location: selected_location, total: price * required_quantity }
    ];
    const allItems = [...baseItems, ...orderItems];
    const subtotal = allItems.reduce((sum, item) => sum + item.total, 0);
    const isSGSTCGST = (profile?.gstNumber || "").startsWith("27");

    const sgst = isSGSTCGST ? subtotal * 0.09 : 0;
    const cgst = isSGSTCGST ? subtotal * 0.09 : 0;
    const igst = !isSGSTCGST ? subtotal * 0.18 : 0;
    const total = subtotal + sgst + cgst + igst;

    const addedApplications = allItems.map((item) => item.name);

    return (
      <div className="border p-4 rounded bg-white mt-4">
        <h4>Order Details</h4>
        <div className="table-responsive" style={{ overflowX: 'scroll', display: 'block', whiteSpace: 'nowrap' }}>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Seller ID</th>
                <th>Item</th>
                <th>Price/Ton</th>
                <th>Loading Location</th>
                <th>HSN</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {allItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.sellerid}</td>
                  <td>{item.name}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>{item.loading_location}</td>
                  <td>{item.hsn}</td>
                  <td>{item.quantity} tons</td>
                  <td>₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="text-right"><strong>Subtotal:</strong></td>
                <td>₹{subtotal.toFixed(2)}</td>
              </tr>
              {isSGSTCGST ? (
                <>
                  <tr>
                    <td colSpan="4" className="text-right"><strong>SGST (9%):</strong></td>
                    <td>₹{sgst.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="text-right"><strong>CGST (9%):</strong></td>
                    <td>₹{cgst.toFixed(2)}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan="4" className="text-right"><strong>IGST (18%):</strong></td>
                  <td>₹{igst.toFixed(2)}</td>
                </tr>
              )}
              <tr>
                <td colSpan="4" className="text-right"><strong>Total:</strong></td>
                <td>₹{total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          {/* Application Dropdown and Quantity */}
          {!orderAdded && (
            <>
              <button
                className="btn btn-success rounded-circle p-4 mt-3"
                style={{ width: '60px', height: '60px', fontSize: '36px', lineHeight: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black', border: 'none' }}
                onClick={() => setDropdownVisible(true)}
              >
                +
              </button>

              {dropdownVisible && (
                <div className="mb-3 mt-4">
                  <label htmlFor="applicationDropdown" className="text-black">Add Applications from this Seller</label>
                  <select
                    id="applicationDropdown"
                    className="form-select"
                    value={selectedApplication}
                    onChange={handleApplicationChange}
                  >
                    <option value="">Select Application</option>
                    {applications.map((app, idx) => (
                      <option key={idx} value={app.application} disabled={addedApplications.includes(app.application)}>
                        {app.application} - ₹{app.price} - Available {app.quantity} - ({app.loadingLocation})
                      </option>
                    ))}
                  </select>
                  {selectedApplication && (
                    <div className="mb-3 mt-2">
                      <label htmlFor="quantity" className="form-label">Required Quantity</label>
                      <input
                        type="number"
                        id="quantity"
                        className="form-control"
                        value={quantity}
                        onChange={handleQuantityChange}
                      />
                      <div className="text-end mt-2">
                        <button className="btn btn-primary" onClick={addToOrder}>
                          Add to Order
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Place order
  const handleOrder = async () => {
    try {
      setLoadingButton(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated.");
        navigate("/", { replace: true });
        return;
      }

      const gstRate = 0.18;
      const baseItems = [{ sellerid, name, price, hsn, quantity: required_quantity, loading_location: selected_location, total: price * required_quantity, gst: price * required_quantity * gstRate, scrapid }];
      const combinedItems = [...baseItems, ...orderItems.map(item => ({ ...item, gst: item.total * gstRate }))];

      // Validate items
      const isValidOrder = combinedItems.every(item => item.name && item.quantity > 0 && item.total > 0 && item.price > 0 && item.hsn && item.scrapid);
      if (!isValidOrder) {
        alert("Order validation failed.");
        setLoadingButton(false);
        return;
      }

      const orderData = {
        items: combinedItems,
        billingAddress: profile?.billAddress || "",
        shippingAddress: shippingAddress,
        id,
        gstNumber: profile?.gstNumber || "",
      };

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/Adminorder`, orderData, { headers: { Authorization: `Bearer ${token}` } });

      if (response.status === 200) {
        // Generate PDF
        const pdfBlob = generatePDF(baseItems, orderItems, profile, true, shippingAddress, logo, seal);

        const formData = new FormData();
        formData.append("pdf", pdfBlob, "order-summary.pdf");
        formData.append("userEmail", profile?.email || "");

        const emailResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload-pdf`, formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });

        if (emailResponse.status === 200) {
          alert("Order placed and invoice emailed!");
          navigate("/Getorders");
        } else alert("Failed to send invoice email.");
      } else alert("Failed to store order.");
    } catch (err) {
      console.error("Error placing order:", err);
      alert("An error occurred while placing the order.");
    } finally {
      setLoadingButton(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

  return (
    <div className="setter">
      <div className="container mt-5">
        <div className="border p-4 rounded bg-light shadow-lg">
          <div className="row align-items-center mb-4">
            <div className="col-md-2 col-sm-3">
              <img src={logo} alt="Logo" className="img-fluid" style={{ maxHeight: "60px" }} />
            </div>
            <div className="col-md-10 col-sm-9" style={{ paddingLeft: "21.5%" }}>
              <h2 className="text-primary font-weight-bold">Order Summary</h2>
            </div>
          </div>

          <div className="row">
            {/* Business Profile & Shipping */}
            <BusinessProfileDetails
              profile={profile}
              shippingAddress={shippingAddress}
              setShippingAddress={setShippingAddress}
            />
          </div>

          <hr className="my-4" />

          {/* Order Summary Table */}
          {renderOrderSummary()}

          <button
            className="btn btn-success mt-4"
            onClick={handleOrder}
            disabled={loadingButton}
            style={{ width: "100%" }}
          >
            {loadingButton ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;

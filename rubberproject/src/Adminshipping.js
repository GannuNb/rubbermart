import React, { useEffect, useState } from 'react';  // 'useState' is already being imported here
import axios from 'axios';
import Adminnav from './Adminnav';
import './Adminshipping.css'; // Import CSS for custom styles
import { jsPDF } from 'jspdf'; // Import jsPDF
import { useNavigate } from 'react-router-dom';

function Adminshipping() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Updated search filter state to include companyId and orderId
  const [searchFilters, setSearchFilters] = useState({
    companyName: '',
    companyId: '',
    orderId: '',
    startDate: '',
    endDate: '',
  });

  const [showOrderDetails, setShowOrderDetails] = useState({});
  const [fileNames, setFileNames] = useState({}); // State to store file names
  const [errorMessages, setErrorMessages] = useState({});

  // Toggle visibility for specific order
  const toggleOrderDetails = (orderId) => {
    setShowOrderDetails((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId], // Toggle the visibility state
    }));
  };


  useEffect(() => {
    // Directly set the scroll position to the top of the page
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;  // For compatibility with older browsers
  }, []); // Empty dependency array ensures it runs only once on page load

  useEffect(() => {
    const tokenKey = `admin_token`; // Check if any valid token exists
    if (localStorage.getItem(tokenKey)) {
      setIsAuthenticated(true);  // If the token is found, user is authenticated
    } else {
      // If no token, navigate to the login page
      navigate('/admin');  // Adjust this path to match your actual login page route
    }
  }, [navigate]); // Make sure to include `navigate` in the dependency array

  const [filteredCompanies, setFilteredCompanies] = useState([]);

  // Handle changes in filter input fields
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  }

  // Filter the orders based on company name and date range
  const filteredOrders = orders.filter((order) => {
    const isCompanyNameMatch = order.user?.businessProfiles[0]?.companyName
      .toLowerCase()
      .includes(searchFilters.companyName.toLowerCase());

    const isDateInRange =
      (!searchFilters.startDate ||
        new Date(order.orderDate) >= new Date(searchFilters.startDate)) &&
      (!searchFilters.endDate || new Date(order.orderDate) <= new Date(searchFilters.endDate));

    return isCompanyNameMatch && isDateInRange;
  });

  // Handle searching for company names and updating dropdown
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchFilters((prevFilters) => ({
      ...prevFilters,
      companyName: query,
    }));

    if (query) {
      const filtered = orders
        .map(order => {
          const companyName = order.user?.businessProfiles[0]?.companyName;
          const companyId = order.user?.businessProfiles[0]?.profileId;
          return companyName && companyId ? { companyName, companyId } : null;
        })
        .filter(item => item && item.companyName.toLowerCase().includes(query.toLowerCase()))
        .filter((value, index, self) => self.findIndex(v => v.companyId === value.companyId) === index); // Remove duplicates by company ID

      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies([]);
    }
  };

  // Handle company selection from the dropdown
  const handleCompanySelect = (company) => {
    setSearchFilters((prevFilters) => ({
      ...prevFilters,
      companyName: company,
    }));
    setFilteredCompanies([]); // Close the dropdown after selection
  };

  useEffect(() => {
    const fetchOrdersWithShipping = async () => {
      try {
        // Fetch all orders
        const ordersResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/orders`
        );

        // Fetch shipping details for each order concurrently
        const ordersWithShipping = await Promise.all(
          ordersResponse.data.map(async (order) => {
            try {
              const shippingResponse = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/shipping/${order._id}`
              );
              return {
                ...order,
                shippingDetails: shippingResponse.data,
              };
            } catch (err) {
              console.error(`Error fetching shipping details for order ${order._id}:`, err);
              return {
                ...order,
                shippingDetails: [], // Default to empty array if shipping details fail to load
              };
            }
          })
        );

        setOrders(ordersWithShipping);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersWithShipping();
  }, []);

  const handleInputChange = (orderId, e) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [orderId]: {
        ...prevValues[orderId],
        [name]: value,
      },
    }));
  };

  const handleShipmentFromDropdownChange = (orderId, e) => {
    const selectedShipmentFrom = e.target.value;

    setInputValues((prevValues) => ({
      ...prevValues,
      [orderId]: {
        ...prevValues[orderId],
        shipmentFrom: selectedShipmentFrom, // Set the value to shipmentFrom input
      },
    }));
  };

  // Handle file change (e.g., e-way bill & invoice)
  const handleFileChange = (orderId, e) => {
    const file = e.target.files[0];
    const fileType = e.target.name;

    // Check if the file is selected and validate its size (limit to 1024 KB)
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // Check if file is larger than 1 MB (1024 KB)
        setFileErrors((prevErrors) => ({
          ...prevErrors,
          [orderId]: `The ${fileType} file size should be less than 1024 KB.`,
        }));
        return; // Prevent further processing if the file is too large
      }

      // Reset error message if the file size is valid
      setFileErrors((prevErrors) => ({
        ...prevErrors,
        [orderId]: null, // Reset the error message for this orderId
      }));

      // Update selected files state
      setSelectedFiles((prevFiles) => ({
        ...prevFiles,
        [orderId]: {
          ...prevFiles[orderId],
          [fileType]: file,
        },
      }));

      // Update file name to display below the input field
      setFileNames((prevFileNames) => ({
        ...prevFileNames,
        [orderId]: file.name, // Save the file name
      }));
    }
  };




  const handleShip = async (orderId) => {
    const orderInput = inputValues[orderId] || {};
    const { vehicleNumber, quantity, selectedProduct, shipmentFrom } = orderInput;

    // Explicit validation check for each field
    if (!vehicleNumber || vehicleNumber.trim() === '') {
      alert('Please enter a valid vehicle number.');
      return;
    }

    if (!quantity || quantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    if (!selectedProduct || selectedProduct.trim() === '') {
      alert('Please select a product.');
      return;
    }

    if (!shipmentFrom || shipmentFrom.trim() === '') {
      alert('Please enter shipment source (Shipment From).');
      return;
    }

    // Proceed with form submission if validation passes
    const shippingData = new FormData();
    shippingData.append('vehicleNumber', vehicleNumber);
    shippingData.append('quantity', quantity);
    shippingData.append('selectedProduct', selectedProduct);
    shippingData.append('orderId', orderId);
    shippingData.append('shipmentFrom', shipmentFrom);  // Include shipmentFrom

    // Append files if selected
    if (selectedFiles[orderId]) {
      if (selectedFiles[orderId].bill) {
        shippingData.append('billPdf', selectedFiles[orderId].bill);
      }
      if (selectedFiles[orderId].invoice) {
        shippingData.append('invoicePdf', selectedFiles[orderId].invoice);
      }
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/shipping`,
        shippingData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      console.log('Shipping data stored:', response.data);
      alert('Shipping data stored successfully!');

      // Refresh the page after successful submission
      window.location.reload();
    } catch (err) {
      // Error handling based on the response from the backend
      if (err.response && err.response.data && err.response.data.message) {
        const errorMessage = err.response.data.message;
        console.error('Error during shipping:', errorMessage);
        setError(errorMessage);
      } else {
        const errorMessage = 'Failed to store shipping information. File size should be below  MB.';
        console.error('Error during shipping:', errorMessage);
        setError(errorMessage);
      }
    }
  };

  const isProductShipped = (order, productName) => {
    const shippedDetails = order.shippingDetails.filter(
      (shipping) => shipping.selectedProduct === productName
    );
    const shippedQuantity = shippedDetails.reduce(
      (total, shipping) => total + shipping.quantity,
      0
    );
    const product = order.items.find(item => item.name === productName);
    return product && shippedQuantity >= product.quantity;
  };

  // 2. Check if all products are shipped
  const isAllProductsShipped = (order) => {
    return order.items.every(item => {
      const shippedDetails = order.shippingDetails.filter(
        (shipping) => shipping.selectedProduct === item.name
      );
      const shippedQuantity = shippedDetails.reduce(
        (total, shipping) => total + shipping.quantity,
        0
      );
      return shippedQuantity >= item.quantity;
    });
  };


  const generatePDF = (order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title Section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Shipping Details Report", pageWidth / 2, 15, { align: "center" });

    // Order Information
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${order._id}`, 10, 30);
    doc.text(`Customer Name: ${order.user?.name || "N/A"}`, 10, 40);
    doc.text(`Customer Email: ${order.user?.email || "N/A"}`, 10, 50);

    // Table Header
    let y = 60;
    doc.setFont("helvetica", "bold");
    doc.text("Product", 10, y);
    doc.text("Quantity", 60, y);
    doc.text("Shipped Details", 100, y);

    // Horizontal line
    y += 5;
    doc.line(10, y, pageWidth - 10, y);

    // Table Content
    y += 10;
    doc.setFont("helvetica", "normal");

    order.items.forEach((item, index) => {
      const shippedDetails = order.shippingDetails.filter(
        (shipping) => shipping.selectedProduct === item.name
      );

      doc.text(`${index + 1}. ${item.name}`, 10, y);
      doc.text(`${item.quantity}`, 60, y);

      if (shippedDetails.length > 0) {
        shippedDetails.forEach((shipping, idx) => {
          doc.text(
            `Vehicle: ${shipping.vehicleNumber} - Qty: ${shipping.quantity}`,
            100,
            y
          );
          y += 10;
        });
      } else {
        doc.text("No shipment details available.", 100, y);
        y += 10;
      }

      y += 5; // Extra spacing between products
    });

    // Footer
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Generated on: " + new Date().toLocaleString(), 10, y + 20);

    doc.save(`Order_${order._id}_ShippingDetails.pdf`);
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-fluid">
      <Adminnav />
      <div className="mt-5">
        <h3>All Orders</h3>
        {/* Search Filters */}
        <div className="mb-4">
          <div className="row">
            <div className="col-md-4 mb-2">
              <label htmlFor="companyName" className="form-label fs-4 fw-bold text-primary">Search with Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                placeholder="Search for Company"
                value={searchFilters.companyName}
                onChange={handleSearchChange}
                className="form-control"
                autoComplete="off"
              />
              {filteredCompanies.length > 0 && (
                <ul className="dropdown-list shadow p-2">
                  {filteredCompanies.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleCompanySelect(item.companyName)}
                      className="dropdown-item"
                    >
                      {item.companyName} ({item.companyId})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="col-md-4 mb-2">
              <label htmlFor="startDate" className="form-label fs-4 fw-bold text-primary">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={searchFilters.startDate}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>

            <div className="col-md-4 mb-2">
              <label htmlFor="endDate" className="form-label fs-4 fw-bold text-primary">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={searchFilters.endDate}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          {filteredOrders.map((order, index) => (
            <div key={order._id} className="mb-4">
              <table className="table table-bordered table-hover table-striped">
                {/* Order Headers */}
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th>
                    <th>Order ID</th>
                    <th>Company Id</th>
                    <th>Company Name</th>
                    <th>Loading Location</th>
                    <th>Subtotal</th>
                    <th>GST</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Order Date</th>
                    <th>Vehicle Number</th>
                    <th>Select  Product</th>
                    <th>Shipping Quantity</th>
                    <th>E-way Bill & Invoice</th>
                    <th>Shipment From</th>
                    <th>Ship</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td><b>{index + 1}</b></td>
                    <td>{order._id}</td>
                    <td>{order.user?.businessProfiles[0]?.profileId || 'N/A'}</td>
                    <td>{order.user?.businessProfiles[0]?.companyName || 'N/A'}</td>
                    <td>{order.items?.[0]?.loading_location || 'N/A'}</td>
                    <td>{order.subtotal}</td>
                    <td>{order.gst}</td>
                    <td>{order.totalPrice}</td>
                    <td>{order.status}</td>
                    <td>{new Date(order.orderDate).toLocaleString()}</td>

                    <td>
                      <input
                        type="text"
                        name="vehicleNumber"
                        value={inputValues[order._id]?.vehicleNumber || ''}
                        onChange={(e) => handleInputChange(order._id, e)}
                        placeholder="Enter vehicle number"
                        className="form-control"
                      />
                    </td>

                    <td>
                      <select
                        name="selectedProduct"
                        value={inputValues[order._id]?.selectedProduct || ''}
                        onChange={(e) => handleInputChange(order._id, e)}
                        className="form-control"
                      >
                        <option value="">Select Product</option>
                        {order.items.map((item) => {
                          const shippedDetails = order.shippingDetails.filter(
                            (shipping) => shipping.selectedProduct === item.name
                          );
                          const shippedQuantity = shippedDetails.reduce(
                            (total, shipping) => total + shipping.quantity,
                            0
                          );
                          const remainingQuantity = item.quantity - shippedQuantity;

                          // Disable product if it is fully shipped
                          const isProductFullyShipped = remainingQuantity <= 0;
                          return (
                            <option key={item.name} value={item.name} disabled={isProductFullyShipped}>
                              {item.name} {isProductFullyShipped ? "(Fully Shipped)" : ""}
                            </option>
                          );
                        })}
                      </select>
                    </td>

                    <td>
                      <input
                        type="number"
                        name="quantity"
                        value={inputValues[order._id]?.quantity || ''}
                        onChange={(e) => {
                          const selectedProduct = inputValues[order._id]?.selectedProduct;
                          const selectedItem = order.items.find(item => item.name === selectedProduct);
                          const shippedDetails = order.shippingDetails.filter(
                            (shipping) => shipping.selectedProduct === selectedProduct
                          );
                          const shippedQuantity = shippedDetails.reduce(
                            (total, shipping) => total + shipping.quantity,
                            0
                          );
                          const remainingQuantity = selectedItem ? selectedItem.quantity - shippedQuantity : 0;

                          // Convert the input value to a number
                          let inputQuantity = parseInt(e.target.value, 10);

                          // If the quantity is less than 1, set it to 1
                          if (inputQuantity < 1) {
                            inputQuantity = 1;
                          }

                          // If the entered quantity exceeds remaining quantity, show a message and reset
                          if (inputQuantity > remainingQuantity) {
                            alert(`Quantity cannot exceed the remaining quantity of ${remainingQuantity}`);
                            inputQuantity = remainingQuantity; // Reset to remaining quantity if the value exceeds it
                          }

                          // Update the input value with the valid quantity
                          handleInputChange(order._id, {
                            target: { name: 'quantity', value: inputQuantity },
                          });
                        }}
                        placeholder="Enter quantity"
                        className="form-control"
                      />
                    </td>


                    <td>
                      <input
                        type="file"
                        name="bill" // Replace with the relevant file type if necessary
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(order._id, e)} // Handle file change
                        className="form-control"
                      />
                      {fileNames[order._id] && ( // Conditionally display the file name if available
                        <small className="text-muted">
                          Selected File: {fileNames[order._id]}
                        </small>
                      )}
                      {fileErrors[order._id] && ( // Conditionally show error message if file size is exceeded
                        <div className="text-danger">
                          {fileErrors[order._id]}
                        </div>
                      )}
                    </td>



                    <td>
                      <select
                        name="shipmentFromDropdown"
                        onChange={(e) => handleShipmentFromDropdownChange(order._id, e)}
                        className="form-select mb-2"
                      >
                        <option value="">Select Shipment From</option>
                        <option value="Ground Floor,Office No-52/ Plot No-44, Sai Chamber CHS, Wing A, Sector 11,Sai Chambers, CBD Belapur, Navi Mumbai, Thane, Maharashtra -400614">
                          Ground Floor,Office No-52/ Plot No-44, Sai Chamber CHS, Wing A, Sector 11,Sai Chambers, CBD Belapur, Navi Mumbai, Thane, Maharashtra -400614
                        </option>
                      </select>
                      <textarea
                        name="shipmentFrom"
                        value={inputValues[order._id]?.shipmentFrom || ''}
                        onChange={(e) => handleInputChange(order._id, e)}
                        placeholder="Enter Shipment From"
                        className="form-control"
                        style={{ resize: 'both', minHeight: '40px', minWidth: '200px' }}
                      />
                    </td>

                    <td>
                      <button
                        onClick={() => handleShip(order._id)}
                        className="btn btn-success"
                        disabled={order.items.every((item) => {
                          const shippedDetails = order.shippingDetails.filter(
                            (shipping) => shipping.selectedProduct === item.name
                          );
                          const shippedQuantity = shippedDetails.reduce(
                            (total, shipping) => total + shipping.quantity,
                            0
                          );
                          return shippedQuantity >= item.quantity;
                        })}
                      >
                        Ship
                      </button>
                    </td>
                  </tr>
                </tbody>

              </table>

              {/* Button to Show/Hide Order Item Details */}
              <button
                onClick={() => toggleOrderDetails(order._id)}
                className="btn btn-info mb-2"
              >
                {showOrderDetails[order._id] ? 'Hide' : 'Show'} Order Product Details
              </button>

              {/* Sub-table for Order Items */}
              {showOrderDetails[order._id] && (
                <table className="table table-bordered mt-2">
                  <thead className="table text-center">
                    <tr>
                      <th>Seller Id</th>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Shipped Quantity</th>
                      <th>Remaining Quantity</th>
                      <th>Vehicle Numbers</th>
                      <th>Shipping Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => {
                      const shippedDetails = order.shippingDetails.filter(
                        (shipping) => shipping.selectedProduct === item.name
                      );
                      const shippedQuantity = shippedDetails.reduce(
                        (total, shipping) => total + shipping.quantity,
                        0
                      );
                      const remainingQuantity = item.quantity - shippedQuantity;

                      return (
                        <tr key={index}>
                          <td className="text-center align-middle">{item.sellerid}</td>
                          <td className="text-center align-middle">{item.name}</td>
                          <td className="text-center align-middle">{item.quantity}</td>
                          <td className="text-center align-middle">{shippedQuantity}</td>
                          <td className="text-center align-middle">{remainingQuantity}</td>
                          <td className="text-center align-middle">
                            <small className="text-muted">
                              {shippedDetails.map((shipping) => shipping.vehicleNumber).join(", ")}
                            </small>
                          </td>
                          {index === 0 && (
                            <td className="text-center align-middle">
                              <button
                                onClick={() => generatePDF(order)}
                                className="btn btn-primary btn-sm"
                              >
                                PDF
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Adminshipping;

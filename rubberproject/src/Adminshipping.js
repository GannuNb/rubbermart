import React, { useEffect, useState } from 'react';  // 'useState' is already being imported here
import axios from 'axios';
import Adminnav from './Adminnav';
import './Adminshipping.css'; // Import CSS for custom styles
import { jsPDF } from 'jspdf'; // Import jsPDF


function Adminshipping() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [searchFilters, setSearchFilters] = useState({
    companyName: '',
    startDate: '',
    endDate: '',
  });

  const [filteredCompanies, setFilteredCompanies] = useState([]);

  // Handle changes in filter input fields
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

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
        .map(order => order.user?.businessProfiles[0]?.companyName)
        .filter(companyName => companyName?.toLowerCase().includes(query.toLowerCase()))
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
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

  const handleFileChange = (orderId, e) => {
    const file = e.target.files[0];
    const fileType = e.target.name;

    if (file && file.size > 4 * 1024 * 1024) {
      setFileErrors((prevErrors) => ({
        ...prevErrors,
        [orderId]: `The ${fileType} file size should be less than 5 MB.`,
      }));
      return;
    }

    setFileErrors((prevErrors) => ({
      ...prevErrors,
      [orderId]: null,
    }));

    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [orderId]: {
        ...prevFiles[orderId],
        [fileType]: file,
      },
    }));
  };



  const handleShip = async (orderId) => {
    const orderInput = inputValues[orderId] || {};
    const { vehicleNumber, quantity, selectedProduct } = orderInput;

    if (!vehicleNumber || !quantity || !selectedProduct) {
      alert('Please enter vehicle number, quantity, and select a product.');
      return;
    }

    const shippingData = new FormData();
    shippingData.append('vehicleNumber', vehicleNumber);
    shippingData.append('quantity', quantity);
    shippingData.append('selectedProduct', selectedProduct);
    shippingData.append('orderId', orderId);

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
    } catch (err) {
      // Check if error response exists and handle accordingly
      if (err.response && err.response.data && err.response.data.message) {
        const errorMessage = err.response.data.message;  // Get the message from the backend
        console.error('Error during shipping:', errorMessage);
        setError(errorMessage);  // Display the error message from backend
      } else {
        const errorMessage = 'Failed to store shipping information,File too large keep below 5 mb.';  // Generic error
        console.error('Error during shipping:', errorMessage);
        setError(errorMessage);  // Display generic error message
      }
    }
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
              />
              {filteredCompanies.length > 0 && (
                <ul className="dropdown-list shadow p-2">
                  {filteredCompanies.map((company, index) => (
                    <li
                      key={index}
                      onClick={() => handleCompanySelect(company)}
                      className="dropdown-item"
                    >
                      {company}
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


        {/* Filtered Orders Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Company Name</th>
                <th>Subtotal</th>
                <th>GST</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Vehicle Number</th>
                <th>Quantity</th>
                <th>Product</th>
                <th>E-way Bill & Invoice</th>
                <th>Ship</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="custom-row">
                    <td>{order._id}</td>
                    <td>{order.user?.businessProfiles[0]?.companyName || 'N/A'}</td>
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
                        className="form-control vehicle-input"
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        name="quantity"
                        value={inputValues[order._id]?.quantity || ''}
                        onChange={(e) => handleInputChange(order._id, e)}
                        placeholder="Enter quantity"
                        className="form-control quantity-input"
                      />
                    </td>

                    <td>
                      <select
                        name="selectedProduct"
                        value={inputValues[order._id]?.selectedProduct || ''}
                        onChange={(e) => handleInputChange(order._id, e)}
                        className="form-control product-select"
                      >
                        <option value="">Select Product</option>
                        {order.items.map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <input
                        type="file"
                        name="bill"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(order._id, e)}
                        className="form-control file-input"
                      />
                      {fileErrors[order._id] && (
                        <small className="text-danger">{fileErrors[order._id]}</small>
                      )}
                    </td>

                    <td>
                      <button
                        onClick={() => handleShip(order._id)}
                        className="btn btn-success ship-button"
                      >
                        Ship
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="13">
                      <table className="table table-bordered mt-2">
                        <thead className="text-center">
                          <tr className="table-light">
                            <th className="p-1" style={{ fontSize: '0.85rem' }}>Item Name</th>
                            <th className="p-1" style={{ fontSize: '0.85rem' }}>Quantity</th>
                            <th className="p-1" style={{ fontSize: '0.85rem' }}>Shipped Quantity</th>
                            <th className="p-1" style={{ fontSize: '0.85rem' }}>Remaining Quantity</th>
                            <th className="p-1" style={{ fontSize: '0.85rem' }}>Vehicle Numbers</th>
                            <th className="p-1" style={{ fontSize: '0.85rem' }}>Shipping Details</th>
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
                              <td className="p-0 text-center align-middle" style={{ lineHeight: '2', fontSize: '0.85rem', width: '100px' }}>{item.name}</td>
                              <td className="p-0 text-center align-middle" style={{ lineHeight: '2', fontSize: '0.85rem', width: '10%' }}>{item.quantity}</td>
                              <td className="p-0 text-center align-middle" style={{ lineHeight: '2', fontSize: '0.85rem', width: '10%' }}>{shippedQuantity}</td>
                              <td className="p-0 text-center align-middle" style={{ lineHeight: '2', fontSize: '0.85rem', width: '10%' }}>{remainingQuantity}</td>
                              <td className="p-0 text-center align-middle" style={{ lineHeight: '2', fontSize: '0.85rem', width: '150px' }}>
                                <small className="text-muted">
                                  {shippedDetails
                                    .map((shipping) => shipping.vehicleNumber)
                                    .join(", ")}
                                </small>
                              </td>
                              {/* Render the PDF button only for the first product in the order */}
                              {index === 0 && (
                                <td className="p-0 text-center align-middle" style={{ lineHeight: '1.2', fontSize: '0.85rem', width: '120px' }}>
                                  <button
                                    onClick={() => generatePDF(order)}
                                    className="btn btn-primary btn-sm ms-2"
                                    style={{ padding: '0.5rem 0.7rem', fontSize: '0.75rem' }}
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
                    </td>
                  </tr>

                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>



  );

}

export default Adminshipping;

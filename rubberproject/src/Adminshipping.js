import React, { useEffect, useState } from 'react';
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

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/orders`);
        const ordersWithShipping = await Promise.all(
          response.data.map(async (order) => {
            const shippingResponse = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/shipping/${order._id}`
            );
            return {
              ...order,
              shippingDetails: shippingResponse.data,
            };
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

    fetchOrders();
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
      console.error('Error during shipping:', err.response?.data || err.message);
      setError('Failed to store shipping information.');
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
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Name</th>
                <th>User Email</th>
                <th>Subtotal</th>
                <th>GST</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Vehicle Number</th>
                <th>Quantity</th>
                <th>Product</th>
                <th>E-way bill and invoice</th>
                
                <th>Ship</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr>
                    <td>{order._id}</td>
                    <td>{order.user?.name || 'N/A'}</td>
                    <td>{order.user?.email || 'N/A'}</td>
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
      <thead>
        <tr className="table-light">
          <th>Item Name</th>
          <th>Quantity</th>
          <th>Shipped Quantity</th>
          <th>Remaining Quantity</th> {/* Added Remaining Quantity column */}
          <th>Vehicle Numbers</th>
          <th>Shipping Details</th>


        </tr>
      </thead>
      <tbody>
        {order.items.map((item, index) => {
          const shippedDetails = order.shippingDetails.filter(
            (shipping) => shipping.selectedProduct === item.name
          );

          const shippedQuantity = shippedDetails.reduce((total, shipping) => total + shipping.quantity, 0);
          const remainingQuantity = item.quantity - shippedQuantity;  // Calculate remaining quantity

          return (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{shippedQuantity}</td>
              <td>{remainingQuantity}</td> {/* Display Remaining Quantity */}
              <td>
  <small className="text-muted">
    {shippedDetails.map((shipping) => shipping.vehicleNumber).join(", ")}
  </small>
</td>

              <td>

              <button onClick={() => generatePDF(order)} className="btn btn-primary ms-2">
          Download PDF
        </button>
        </td>
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

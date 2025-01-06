import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router-dom';
import logo from './images/logo.png';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo1 from './images/logo.png';

function ShippingDetails() {
  const [shippingDetails, setShippingDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();
    const location = useLocation(); // Get current route location

  // Check user authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        setTimeout(() => {
            // Create a custom alert with inline styling or a class
            const alertDiv = document.createElement('div');
            alertDiv.className = 'custom-alert';

            // Create an image element for the logo
            const logoImg = document.createElement('img');
            logoImg.src = logo1;  // Use the imported logo here
            logoImg.alt = 'Company Logo';
            logoImg.className = 'alert-logo';  // Add a class for logo styling

            // Create a text message for the alert
            const alertMessage = document.createElement('span');
            alertMessage.textContent = 'Please log in for Shipping Details.';
            alertMessage.className = 'alert-message';  // Class for message styling

            // Append logo and message to the alert div
            alertDiv.appendChild(logoImg);
            alertDiv.appendChild(alertMessage);

            // Append alert div to the body
            document.body.appendChild(alertDiv);

            // Remove the alert after 5 seconds
            setTimeout(() => {
                alertDiv.remove();
            }, 5000);

            navigate('/Login', { state: { from: location.pathname } }); // Navigate to login if no token
        }, 0);
        return;
    }
}, [navigate, location]);

  // Fetch shipping details
  useEffect(() => {
    const fetchShippingDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setTimeout(() => {
            navigate('/Login'); // Redirect to login if no token
          }, 0);
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/shippinguser`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.shippingDetails) {
          // Assuming the backend populates shippingAddress when fetching shipping details
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
  }, [navigate]);


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
      <div className='setter'>
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
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


  const numberToWords = (num) => {
    if (num === 0) return 'zero rupees only';
  
    const a = [
      '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
      'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
    ];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
    const numToWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + numToWords(n % 100) : '');
      return '';
    };
  
    const units = ['crore', 'lakh', 'thousand', 'hundred'];
    const divisors = [10000000, 100000, 1000, 100];
  
    let result = '';
    let wholePart = Math.floor(num);
    let fractionalPart = Math.round((num - wholePart) * 100); // Convert fractional part to paise
  
    // Convert the whole part
    for (let i = 0; i < divisors.length; i++) {
      const quotient = Math.floor(wholePart / divisors[i]);
      wholePart %= divisors[i];
      if (quotient > 0) {
        result += numToWords(quotient) + ' ' + units[i] + ' ';
      }
    }
  
    // Handle any remaining whole part
    if (wholePart > 0) {
      result += numToWords(wholePart);
    }
  
    // Add fractional part (paise)
    if (fractionalPart > 0) {
      result += ` and ${numToWords(fractionalPart)} paise`;
    }
  
    return result.trim() + ' rupees only';
  };
  
  const generatePDF = (order) => {
    const doc = new jsPDF();
  
    // Add logo
    if (logo) {
      doc.addImage(logo, 'JPEG', 10, 10, 40, 20);
    }
  
    // Add heading and other details
   // Add heading and other details
doc.setFontSize(20);
doc.setFont('helvetica', 'bold');
doc.text('INVOICE', 105, 20, { align: 'center' });

// Add Invoice ID and Date on the right
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
const invoiceId = order.invoiceId || 'N/A';
const formattedDate = order.shippingDate
  ? new Date(order.shippingDate).toLocaleDateString()
  : 'N/A';

// Align to the right side
doc.text(`Invoice ID: ${invoiceId}`, 190, 25, { align: 'right' });
doc.text(`Date: ${formattedDate}`, 190, 30, { align: 'right' });

  
    // Billing and shipping info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Billing Information', 14, 45);
    doc.text('Shipping Information', 110, 45);
    doc.line(10, 48, 200, 48);
  
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (profile) {
      doc.text(`Company: ${profile.companyName || 'N/A'}`, 14, 55);
      doc.text(`Email: ${profile.email || 'N/A'}`, 14, 60);
      doc.text(`Billing Address: ${profile.billAddress || 'N/A'}`, 14, 65);
  
      const shippingAddress = order.orderId.shippingAddress || 'N/A';  // Access the populated shippingAddress
      doc.text(`Address: ${shippingAddress}`, 110, 55);
    }
  
    // Add order details table
    doc.autoTable({
      startY: 85,
      head: [
        ['Order ID', 'Vehicle Number', 'Product', 'Shipped Quantity', 'Total Quantity', 'Remaining Quantity', 'Price Per Ton', 'Subtotal', 'GST', 'Total Price'],
      ],
      body: [
        [
          order.orderId ? order.orderId._id : 'N/A',
          order.vehicleNumber || 'N/A',
          order.selectedProduct || 'N/A',
          `${order.quantity || 0}`,  // Shipped Quantity
          `${order.itemDetails?.find(item => item.name === order.selectedProduct)?.quantity || 0}`,  // Total Quantity
          `${order.itemDetails?.find(item => item.name === order.selectedProduct)
            ? order.itemDetails.find(item => item.name === order.selectedProduct).quantity -
              groupedByOrder[order.orderId._id]
                .filter((ship) => ship.selectedProduct === order.selectedProduct)
                .reduce((sum, ship) => sum + ship.quantity, 0)
            : 0}`,  // Remaining Quantity
          `${order.itemDetails?.find(item => item.name === order.selectedProduct)?.price.toFixed(2) || 0}`,
          `${order.subtotal?.toFixed(2) || 0}`,
          `${order.gst?.toFixed(2) || 0}`,
          `${order.totalPrice?.toFixed(2) || 0}`,
        ],
      ],
      theme: 'striped',
      styles: { fontSize: 9 },
    });
  
    const finalY = doc.lastAutoTable.finalY + 10;
    const totalAmountInWords = numberToWords(order.totalPrice || 0);
    doc.text(`Total Amount (in words): ${totalAmountInWords}`, 14, finalY);
  
    // Address Details Section
    doc.setFontSize(12);
    doc.setFont('helvetica');
    const addressY = finalY + 15;
    doc.text('Address Details', 14, addressY);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, addressY + 3, 200, addressY + 3); // Underline
  
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
  
    // "From" Section
    doc.text('From:', 14, addressY + 10);
    doc.text('VIKAH RUBBERS', 14, addressY + 15);
    doc.text('Hyderabad', 14, addressY + 20);
    doc.text('Dispatch From:', 14, addressY + 25);
    doc.text('#406, 4th Floor, Patel Towers,', 14, addressY + 30);
    doc.text('Above EasyBuy Beside Nagole RTO Office,', 14, addressY + 35);
    doc.text('Nagole Hyderabad, Telangana-500035', 14, addressY + 40);
    doc.text('Hyderabad.', 14, addressY + 45);
  
    
  
    // Terms and Conditions
    const termsY = addressY + 55;
    doc.setFont('helvetica', 'bold');
    doc.text('Terms and Conditions:', 14, termsY);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, termsY + 3, 200, termsY + 3); // Underline
  
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(
      '1. The Seller shall not be liable to the Buyer for any loss or damage.',
      14,
      termsY + 10
    );
    doc.text(
      '2. The Seller warrants the product for one (1) year from the date of shipment.',
      14,
      termsY + 15
    );
    doc.text(
      '3. The purchase order will be interpreted as acceptance of this offer.',
      14,
      termsY + 20
    );
  
    // Save the PDF
    doc.save(`Invoice_${order._id}.pdf`);
  };
  
  

  

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
                        <th>Invoice ID</th>
                        <th>Vehicle Number</th>
                        <th>Product</th>
                        <th>Shipped Quantity</th>
                        <th>Total  Quantity</th>
                        <th>Remaining Quantity</th>
                        <th>Email</th>
                        <th>Item Prices</th>
                        <th>Subtotal</th>
                        <th>GST</th>
                        <th>Total Price</th>
                        <th>Shipping Date</th>
                        <th>E-Way Bill</th>
                        <th>Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedByOrder[orderId].map((detail, index) => (
                        <tr key={detail._id}>
                          <td>{detail.orderId?._id || 'N/A'}</td>
                          <td>{detail.invoiceId || 'N/A'}</td>
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
                                pdf
                              </button>
                            ) : (
                              <p>No Bill PDF</p>
                            )}
                          </td>
                          <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => generatePDF(detail)}
                          >
                            Download PDF
                          </button>
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

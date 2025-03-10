import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router-dom';
import logo from './images/logo.png';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo1 from './images/logo.png';
import { FaFilePdf } from 'react-icons/fa';
import seal from './images/seal.png';



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
          <span style={{ marginTop: '12%' }} className="visually-hidden">Loading...</span>
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
      doc.addImage(logo, 'JPEG', 5, 9, 30, 15); // Position logo at the top left
    }
  
    // Add Address Details to the right of the logo
    doc.setFontSize(7); // Reduced font size further
    doc.setFont('helvetica', 'normal');
  
    const addressDetails = `Rubberscrapmart\nGround Floor, Office No-52/ Plot No-44,\nSai Chamber CHS Wing A, Sector -11,\nSai Chambers, CBD Belapur, Navi Mumbai,\nThane, Maharashtra, 400614`;

    const addressLines = doc.splitTextToSize(addressDetails, 130); // Increased width to 140 for more room
    addressLines.forEach((line, index) => {
      doc.text(line, 34, 12 + index * 3); // Adjusted left margin and line height
    });
  
    // Add heading and other details
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 110, 12, { align: 'center' });
  
    // Add Invoice ID and Date on the right, aligning colons
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const invoiceId = order.invoiceId || 'N/A';
    const formattedDate = order.shippingDate
      ? new Date(order.shippingDate).toLocaleDateString()
      : 'N/A';
  
    // Define starting X positions for labels and values
    const labelXPosition = 150; // Position for the labels ("Invoice ID:", "Order Date:")
    const valueXPosition = 175; // Position for the values (Invoice ID and Order Date)
    const labelYPosition = 15;  // Start Y position
    const lineHeight = 7; // Space between lines (for vertical alignment)
  
    // Add "Invoice ID:" and value
    doc.text('Invoice ID', labelXPosition, labelYPosition); // Add the label
    doc.text(':', labelXPosition + 20, labelYPosition);   // Add the colon after the label
    doc.text(invoiceId, valueXPosition, labelYPosition);    // Add the value
  
    // Add "Order Date:" and value
    doc.text('Order Date', labelXPosition, labelYPosition + lineHeight); // Add the label for "Order Date"
    doc.text(':', labelXPosition + 20, labelYPosition + lineHeight);  // Add the colon after the label
    doc.text(formattedDate, valueXPosition, labelYPosition + lineHeight);  // Add the value
  
    // Draw a horizontal line below the header
    doc.setDrawColor(0, 0, 0); // Set line color (black)
    doc.line(10, 25, 200, 25);
  
 // Billing, Shipping, and Shipment From Information
doc.setFontSize(10);
doc.setFont('helvetica', 'bold');

// Column headers
doc.text('Bill To', 14, 35);
doc.text('Ship To', 90, 35); // Adjusted position to the left
doc.text('Ship From', 150, 35); // Adjusted position to the left

// Set the font for the details
doc.setFontSize(8);
doc.setFont('helvetica', 'normal');

let billingY = 45;
let shippingY = 45;
let shipmentFromY = 45;

const labelX = 14; // Starting X-position for labels in the first column
const colonX = 30; // Reduced space closer to the label
const valueX = 32; // Reduced space closer to the colon

const shippingOffsetX = 90; // Adjusted Ship To horizontal offset
const shipmentFromOffsetX = 150; // Adjusted Shipment From horizontal offset

// Billing Info (updated order)
if (profile) {
  doc.text('Company', labelX, billingY);
  doc.text(':', colonX, billingY);
  doc.text(`${profile.companyName || 'N/A'}`, valueX, billingY);

  const billingAddress = profile.billAddress || 'N/A';
  const billingAddressLines = doc.splitTextToSize(billingAddress, 50);
  doc.text('Address', labelX, billingY + 5);
  doc.text(':', colonX, billingY + 5);
  doc.text(billingAddressLines, valueX, billingY + 5);

  doc.text('Phone', labelX, billingY + 5 + billingAddressLines.length * 5);
  doc.text(':', colonX, billingY + 5 + billingAddressLines.length * 5);
  doc.text(`${profile.phoneNumber || 'N/A'}`, valueX, billingY + 5 + billingAddressLines.length * 5);

  doc.text('E-mail', labelX, billingY + 10 + billingAddressLines.length * 5);
  doc.text(':', colonX, billingY + 10 + billingAddressLines.length * 5);
  doc.text(`${profile.email || 'N/A'}`, valueX, billingY + 10 + billingAddressLines.length * 5);

  doc.text('GSTN', labelX, billingY + 15 + billingAddressLines.length * 5);
  doc.text(':', colonX, billingY + 15 + billingAddressLines.length * 5);
  doc.text(`${profile.gstNumber || 'N/A'}`, valueX, billingY + 15 + billingAddressLines.length * 5);

  billingY += (15 + billingAddressLines.length * 5 + 20);
}

  
    // Shipping Info
    const shippingAddress = order.orderId.shippingAddress || 'N/A';
    const shippingAddressLines = doc.splitTextToSize(shippingAddress, 55);
    doc.text(shippingAddressLines, shippingOffsetX, shippingY); // Adjusted column position
  
    shippingY += shippingAddressLines.length * 5 + 20;
  
    // Shipment From Info
    const shipmentFrom = order.shipmentFrom || 'N/A';
    const shipmentFromLines = doc.splitTextToSize(shipmentFrom, 50);
    doc.text(shipmentFromLines, shipmentFromOffsetX, shipmentFromY); // Adjusted column position
    shipmentFromY += shipmentFromLines.length * 5 + 20;
  
    const contentY = Math.max(billingY, shippingY, shipmentFromY + shipmentFromLines.length * 5 + 5);
  
    // Adjusted startY to reduce space above the table
    doc.autoTable({
      startY: contentY + 1, // Further reduced from contentY + 5 to contentY + 1
      head: [
        ['Order ID', 'Vehicle Number', 'Product', 'Shipped Quantity', 'Total Quantity', 'Remaining Quantity', 'Price Per Ton', 'Subtotal', 'GST', 'Total Price'],
      ],
      body: [
        [
          order.orderId ? order.orderId._id : 'N/A',
          order.vehicleNumber || 'N/A',
          order.selectedProduct || 'N/A',
          `${order.quantity || 0}`,
          `${order.itemDetails?.find(item => item.name === order.selectedProduct)?.quantity || 0}`,
          `${order.itemDetails?.find(item => item.name === order.selectedProduct)
            ? order.itemDetails.find(item => item.name === order.selectedProduct).quantity -
              groupedByOrder[order.orderId._id]
                .filter((ship) => ship.selectedProduct === order.selectedProduct)
                .reduce((sum, ship) => sum + ship.quantity, 0)
            : 0}`,
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
  
    // Adjust the positions for labels and values
    const totalAmountLabelX = 14; // Consistent left margin for label
    const totalAmountColonX = 60; // Position for the colon
    const totalAmountValueX = 65; // Position for the value
  
    doc.text('Total Amount (in words)', totalAmountLabelX, finalY);
    doc.text(':', totalAmountColonX, finalY);
  
    // Split the "Total Amount in Words" into multiple lines if it's too long
    const totalAmountInWordsLines = doc.splitTextToSize(totalAmountInWords, 120); // Width for wrapping
    totalAmountInWordsLines.forEach((line, index) => {
      doc.text(line, totalAmountValueX, finalY + index * 5); // Increment Y-coordinate for each line
    });
  
    // Banking Details Section
    const bankingDetailsStartY = finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Banking Details', 14, bankingDetailsStartY);
    doc.line(10, bankingDetailsStartY + 3, 200, bankingDetailsStartY + 3);
  
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
  
    const columnLabelX = 14; // Consistent column for labels
    const columnColonX = 60; // Position for colons
    const columnValueX = 65; // Position for values
  
    doc.text('Bank Name', columnLabelX, bankingDetailsStartY + 10);
    doc.text(':', columnColonX, bankingDetailsStartY + 10);
    doc.text('IDFC FIRST BANK', columnValueX, bankingDetailsStartY + 10);
  
    doc.text('Account Name', columnLabelX, bankingDetailsStartY + 15);
    doc.text(':', columnColonX, bankingDetailsStartY + 15);
    doc.text('VIKAH RUBBERS', columnValueX, bankingDetailsStartY + 15);
  
    doc.text('Account Number', columnLabelX, bankingDetailsStartY + 20);
    doc.text(':', columnColonX, bankingDetailsStartY + 20);
    doc.text('10113716761', columnValueX, bankingDetailsStartY + 20);
  
    doc.text('IFSC CODE', columnLabelX, bankingDetailsStartY + 25);
    doc.text(':', columnColonX, bankingDetailsStartY + 25);
    doc.text('IDFB0040132', columnValueX, bankingDetailsStartY + 25);
  
    doc.text('ACCOUNT TYPE', columnLabelX, bankingDetailsStartY + 30);
    doc.text(':', columnColonX, bankingDetailsStartY + 30);
    doc.text('CURRENT A/C', columnValueX, bankingDetailsStartY + 30);
  
    doc.text('BRANCH', columnLabelX, bankingDetailsStartY + 35);
    doc.text(':', columnColonX, bankingDetailsStartY + 35);
    doc.text('NERUL BRANCH', columnValueX, bankingDetailsStartY + 35);
  
    // Terms and Conditions Section
    const termsY = bankingDetailsStartY + 45;
    doc.setFont('helvetica', 'bold');
    doc.text('Terms and Conditions:', labelX, termsY);
    doc.line(10, termsY + 3, 200, termsY + 3);
  
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('1. The Seller shall not be liable to the Buyer for any loss or damage.', 14, termsY + 10);
    doc.text('2. The Seller warrants the product for one (1) year from the date of shipment.', 14, termsY + 15);
    doc.text('3. The purchase order will be interpreted as acceptance of this offer.', 14, termsY + 20);
  
    // Image at the bottom
    const imageY = termsY + 20;
    doc.addImage(seal, 'PNG', 120, imageY, 80, 80); // Moved the image left by changing the x-coordinate to 120
  
    // Save the PDF
    doc.save(`Invoice_${order._id}.pdf`);
  };
  
  
  
  
  
  
  
  
  
  
  

  

  return (
    <div className="setter">
      <div className="container mt-5">
        <h2 className="text-center mb-4">Shipping Details</h2>
        {Object.keys(groupedByOrder).length === 0 ? (
          <p style={{ marginTop: '12%' }} className="text-center mt-5">No shipping details available.</p>
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
                          {/* <td>{detail.shipmentFrom ? detail.shipmentFrom : 'N/A'}</td>   */}
                         
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
                          
                              <button className="btn btn-primary" onClick={() => generatePDF(detail)}>
                                <FaFilePdf /> {/* Display PDF icon */}
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

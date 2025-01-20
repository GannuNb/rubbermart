import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate,useLocation } from 'react-router-dom';
import logo from './images/logo.png';
import logo1 from './images/logo.png';
import seal from './images/seal.png';
import { FaFilePdf } from 'react-icons/fa';



const Getorders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [itemNameFilter, setItemNameFilter] = useState('');
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [files, setFiles] = useState({}); // to store uploaded file data



  


  const location = useLocation();

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
            alertMessage.textContent = 'Please log in for Orders.';
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


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/adminorders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/business-profile`, config);
        if (response.data.profileExists) {
          setProfile(response.data.businessProfile);
        }
      } catch (err) {
        console.error('Error fetching business profile:', err);
      }
    };

    fetchOrders();
    fetchProfile();
  }, []);

  const filterOrders = () => {
    let filtered = orders;

    if (startDate && endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    if (itemNameFilter) {
      filtered = filtered.filter((order) =>
        order.items.some(item =>
          item.name.toLowerCase().includes(itemNameFilter.toLowerCase())
        )
      );
    }

    setFilteredOrders(filtered);
    alert("filters applied")
  };

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

    // Logo - Adjusted size and position
    if (logo) {
        doc.addImage(logo, 'JPEG', 10, 13, 30, 15); // Positioned logo with size adjustment
    }

    // Vikah Rubbers Address - Adjusted font size and decreased line spacing
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    const companyAddress = [
        'VIKAH RUBBERS',
        '#406, 4th Floor, Patel Towers,',
        'Above EasyBuy Beside Nagole RTO Office,',
        'Nagole Hyderabad, Telangana-500035',
    ];

    let addressY = 12; // Adjusted starting Y to align with logo
    doc.text(companyAddress[0], 40, addressY+4); // Company Name
    
    doc.text(companyAddress[1], 40, addressY + 8); // Street Address
    doc.text(companyAddress[2], 40, addressY + 12); // Additional Address
    doc.text(companyAddress[3], 40, addressY + 16); // City, State, and Postal Code

// PROFORMA INVOICE Heading - Slightly adjusted Y-position to move it down
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text('PROFORMA INVOICE', 115, addressY + 1, { align: 'center' }); // Moved down slightly


    // Order ID and Date - Positioned to the left
    doc.setFontSize(8);
    const formattedDate = new Date(order.orderDate).toLocaleDateString();
    const orderLabelX = 160;  // Renamed X position for Order ID and Date section
    const colonX = 175;  // X position for colons, directly under each other (moved left)
    const valueX = 180;  // X position for values, reduced space after the colon (moved left)
    const padding = 5;   // Adjust padding between Order ID and Order Date

    // Aligning colons vertically with reduced space after them, shifted left
    doc.text(`Order ID`, orderLabelX, addressY + 5); // Label for Order ID
    doc.text(`:`, colonX, addressY + 5); // Colon for Order ID

    doc.text(`${order._id}`, valueX, addressY + 5); // Right-aligned Order ID value

    doc.text(`Order Date`, orderLabelX, addressY + 5 + padding); // Label for Order Date
    doc.text(`:`, colonX, addressY + 5 + padding); // Colon for Order Date (aligned with the previous colon)
    doc.text(`${formattedDate}`, valueX, addressY + 5 + padding); // Right-aligned Order Date value

    // Line separating header and content
    doc.setDrawColor(0, 0, 0);
    doc.line(10, addressY + 25, 200, addressY + 25); // Line separating header and content

    // Billing and Shipping Information
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To', 14, addressY + 30); // Title for billing info
    doc.text('Ship To', 140, addressY + 30); // Title for shipping info
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    let billingY = addressY + 36;
    let shippingY = addressY + 36;

    if (profile) {
        const billingLabelX = 14; // Renamed for billing section
        const billingColonX = 40; // Renamed for billing section
        const billingValueX = 45; // Renamed for billing section
        const maxAddressLength = 60; // Increased max characters per line before wrapping (set to 60)

        // Billing Info
        doc.text('Company', billingLabelX, billingY);
        doc.text(':', billingColonX, billingY);
        doc.text(profile.companyName || 'N/A', billingValueX, billingY);

        doc.text('Email', billingLabelX, billingY + 5);
        doc.text(':', billingColonX, billingY + 5);
        doc.text(profile.email || 'N/A', billingValueX, billingY + 5);

        doc.text('Address', billingLabelX, billingY + 10);
        doc.text(':', billingColonX, billingY + 10);
        const billingAddress = profile.billAddress || 'N/A';
        const billingAddressLines = doc.splitTextToSize(billingAddress, maxAddressLength);
        billingAddressLines.forEach((line, index) => {
            doc.text(line, billingValueX, billingY + 15 + (index * 5));
        });

        billingY += 15 + (billingAddressLines.length * 5); // Adjust Y after billing address

        // Shipping Info
        const shippingLabelX = 110; // Renamed for shipping section
        const shippingValueX = 140;

        const shippingAddress = order.shippingAddress || 'N/A';

        // Split the address into multiple lines if it's too long
        const shippingAddressLines = doc.splitTextToSize(shippingAddress, maxAddressLength);

        // Add the shipping address directly under the Shipping Info
        shippingAddressLines.forEach((line, index) => {
            doc.text(line, shippingValueX, shippingY + (index * 5)); // Adjusted Y for line spacing
        });

        shippingY += (shippingAddressLines.length * 5); // Adjust Y after shipping address
    }

    const contentY = Math.max(billingY, shippingY);

    // Order Details Section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Details', 14, contentY);
    doc.line(10, contentY + 3, 200, contentY + 3); // Line after Order Details section

    // Calculate totals
    let subtotal = 0;
    order.items.forEach((item) => {
        subtotal += item.quantity * item.price;
    });
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    // Table for order details
    doc.autoTable({
        startY: contentY + 5,
        head: [['Order ID', 'Item Name', 'Qty (tons)', 'Price/Ton', 'Subtotal', 'GST', 'Total']],
        body: order.items.map((item) => [
            order._id,
            item.name,
            `${item.quantity} tons`,
            `${item.price.toFixed(2)}`,
            `${(item.quantity * item.price).toFixed(2)}`,
            `${(item.quantity * item.price * 0.18).toFixed(2)}`,
            `${(item.quantity * item.price * 1.18).toFixed(2)}`,
        ]),
        theme: 'striped',
        styles: {
            fontSize: 7,
            cellPadding: 1,
        },
        columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 35 },
            2: { cellWidth: 30 },
            3: { cellWidth: 25 },
            4: { cellWidth: 25 },
            5: { cellWidth: 25 },
            6: { cellWidth: 30 },
        },
        margin: { top: 30, left: 14, right: 14 },
        tableWidth: 'wrap',
    });

    const firstTableFinalY = doc.lastAutoTable.finalY;

    doc.autoTable({
        startY: firstTableFinalY + 5,
        head: [['', 'Total']],
        body: [
            ['Taxable Value', subtotal.toFixed(2)],
            ['Total GST', gst.toFixed(2)],
            ['Total', total.toFixed(2)],
        ],
        theme: 'grid',
        styles: { fontSize: 10 },
        columnStyles: {
            0: { cellWidth: 100, halign: 'left' },
            1: { cellWidth: 40, halign: 'right' },
        },
        headStyles: { fontSize: 10, fontStyle: 'bold', fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    });

    const totalsTableFinalY = doc.lastAutoTable.finalY;

    const totalAmountInWords = numberToWords(total);
    doc.setFontSize(10);
    doc.text(`Total Amount (in words): ${totalAmountInWords}`, 14, totalsTableFinalY + 10);
    doc.text(`Total Balance: Rs ${total.toFixed(2)}`, 14, totalsTableFinalY + 18);

    // Banking Details Section
const bankingY = totalsTableFinalY + 30;

// Title
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.text('Banking Details:', 14, bankingY);
doc.line(10, bankingY + 3, 200, bankingY + 3);

// Content
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');

// Define label positions and corresponding values
const bankingLabelX = 14; // Label X position
const bankingColonX = 70; // Colon X position
const bankingValueX = 80; // Value X position
let currentY = bankingY + 10; // Start slightly below the title

// Adjust each label and value spacing
doc.text('Bank Name', bankingLabelX, currentY);
doc.text(':', bankingColonX, currentY);
doc.text('IDFC FIRST BANK', bankingValueX, currentY);
currentY += 6; // Move Y down for the next line

doc.text('Account Name', bankingLabelX, currentY);
doc.text(':', bankingColonX, currentY);
doc.text('VIKAH RUBBERS', bankingValueX, currentY);
currentY += 6; // Move Y down for the next line

doc.text('Account Number', bankingLabelX, currentY);
doc.text(':', bankingColonX, currentY);
doc.text('10113716761', bankingValueX, currentY);
currentY += 6; // Move Y down for the next line

doc.text('IFSC CODE', bankingLabelX, currentY);
doc.text(':', bankingColonX, currentY);
doc.text('IDFB0040132', bankingValueX, currentY);
currentY += 6; // Move Y down for the next line

doc.text('Branch', bankingLabelX, currentY);
doc.text(':', bankingColonX, currentY);
doc.text('NERUL BRANCH', bankingValueX, currentY);


    // Terms and Conditions Section
    const termsY = bankingY + 50;
    doc.setFont('helvetica', 'bold');
    doc.text('Terms and Conditions:', 14, termsY);
    doc.line(10, termsY + 3, 200, termsY + 3);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('1. The Seller shall not be liable to the Buyer for any loss or damage.', 14, termsY + 10);
    doc.text('2. The Seller warrants the product for one (1) year from the date of shipment.', 14, termsY + 15);
    doc.text('3. The purchase order will be interpreted as acceptance of this offer.', 14, termsY + 20);

    // Seal Section - Moved up
    const sealY = termsY + 20; // Moved up by adjusting Y position
    if (seal) {
        doc.addImage(seal, 'PNG', 120, sealY, 80, 80); // Seal position adjusted
    }

    // Save the PDF
    doc.save(`Invoice_${order._id}.pdf`);
};





























  


  const handleFileChange = (orderId, e) => {
    const newFiles = { ...files };
    newFiles[orderId] = { file: e.target.files[0], fileName: e.target.files[0]?.name };
    setFiles(newFiles);
  };


  
  const handleFileUpload = async (orderId) => {
    const file = files[orderId]?.file;
  
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('orderId', orderId); // Pass orderId to the backend
  
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          displayAlert('No authentication token found', 'danger');
          return;
        }
        
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/payment/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        const { fileUrl, orderId: uploadedOrderId } = response.data;
        const newFiles = { ...files };
        newFiles[uploadedOrderId] = { fileUrl }; // Store the file URL with order ID
  
        setFiles(newFiles); // Update state with the uploaded file URL
  
        displayAlert('File uploaded successfully', 'success');
        window.location.reload();
      } catch (err) {
        console.error('Error uploading file:', err.response ? err.response.data : err.message);
        displayAlert('Error uploading file, file should be less than 1 MB', 'danger');
      }
    } else {
      displayAlert('Please select a file to upload', 'warning');
    }
  };
  
  // Helper function to display alerts
  const displayAlert = (message, type) => {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
      alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show alert-fade" role="alert">
          <img src="${logo1}" alt="Logo" class="mr-2" style="width: 100px;">
          ${message}
        </div>
      `;
      setTimeout(() => {
        alertContainer.innerHTML = '';
      }, 5000); // Alert disappears after 5 seconds
    }
  };
  
  
  
  

  

  
  return (
    <div className="setter">
      <div className="container">
        <h2>ALL ORDERS</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Order ID</th>
                <th>Item Name</th>
                <th>Total Ordered Quantity (tons)</th>
                <th>Price Per Ton (₹)</th>
                <th>Loading Location</th>
                <th>Subtotal (₹)</th>
                <th>GST (₹)</th>
                <th>Total Price (₹)</th>
                <th>Order Date</th>
                <th>Invoice</th>
                <th>Upload Payment Receipt</th>

              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <>
                  {order.items.map((item, index) => {
                    const itemSubtotal = item.quantity * item.price;
                    const itemGST = itemSubtotal * 0.18;
                    const itemTotal = itemSubtotal + itemGST;
  
                    return (
                      <tr key={item._id}>
                        {index === 0 && (
                          <td rowSpan={order.items.length}>{order._id}</td>
                        )}
                        <td>{item.name}</td>
                        <td>{item.quantity} tons</td>
                        <td>₹{item.price.toFixed(2)}</td>
                        <td>{item.loading_location}</td>
                        <td>₹{itemSubtotal.toFixed(2)}</td>
                        <td>₹{itemGST.toFixed(2)}</td>
                        <td>₹{itemTotal.toFixed(2)}</td>
                        {index === 0 && (
                          <td rowSpan={order.items.length}>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>
                        )}
                        {index === 0 && (
                          <td rowSpan={order.items.length}>
                           
                            <button className="btn btn-primary" onClick={() => generatePDF(order)}>
                                                            <FaFilePdf />
                                                          </button>
                          </td>
                        )}
                        {/* File Upload Section */}
                        {index === 0 && (
                          <td rowSpan={order.items.length}>
                            <input
                              type="file"
                              onChange={(e) => handleFileChange(order._id, e)}
                              className="form-control"
                              accept="image/jpeg, image/png, application/pdf"
                            />
                            {files[order._id] && files[order._id].fileName && (
                              <div>{files[order._id].fileName}</div>
                            )}
                            <button
                              className="btn btn-sm btn-success mt-2"
                              onClick={() => handleFileUpload(order._id)}
                            >
                              Upload File
                            </button>
                          </td>
                        )}

                      </tr>
                    );
                  })}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export default Getorders;
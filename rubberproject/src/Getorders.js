import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate,useLocation } from 'react-router-dom';
import logo from './images/logo.png';
import logo1 from './images/logo.png';



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
    if (logo) {
      doc.addImage(logo, 'JPEG', 11, 6, 40, 20); // Adjust the width and height of the logo
    }

    // Header
    doc.setFontSize(20);
    doc.text('PROFORMA INVOICE', 70, 20);
    doc.setFontSize(10);
    const formattedDate = new Date(order.orderDate).toLocaleDateString();
    doc.setFontSize(10);

   
    doc.text(`PA ID: ${order._id}`, 188, 15, { align: 'right' }); // Display Order ID
    doc.text(`Invoice Date: ${formattedDate}`, 190, 20, { align: 'right' });
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 25, 200, 25); // Underline

    // Billing and Shipping Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Billing Information', 14, 35);
    doc.text('Shipping Information', 110, 35);
    doc.setDrawColor(0, 0, 0);
   

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (profile) {
      // Billing Info
      doc.text(`Company: ${profile.companyName || 'N/A'}`, 14, 45);
      
      doc.text(`Email: ${profile.email || 'N/A'}`, 14, 50);

      doc.text(`Address: ${profile.billAddress || 'N/A'}`, 14, 55);
      // Shipping Info
      doc.text(`Address: ${profile.shipAddress || 'N/A'}`, 110, 45);
    }

    // Order Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Order Details', 14, 70);
  doc.line(10, 73, 200, 73); // Underline

  // Calculate totals
  let subtotal = 0;
  order.items.forEach(item => {
    subtotal += item.quantity * item.price;
  });
  const gst = subtotal * 0.18; // GST is 18%
  const total = subtotal + gst;

  // Table
  doc.autoTable({
    startY: 75,
    head: [['Order ID', 'Item Name', 'Required Quantity (tons)', 'Price Per Ton', 'Subtotal', 'GST', 'Total Price']],
    body: order.items.map(item => [
      order._id,
      item.name,
      `${item.quantity} tons`,
      `${item.price.toFixed(2)}`,
      `${(item.quantity * item.price).toFixed(2)}`,
      `${(item.quantity * item.price * 0.18).toFixed(2)}`,
      `${(item.quantity * item.price * 1.18).toFixed(2)}`,
    ]),
    theme: 'striped',
    styles: { fontSize: 8 },
  });

  const finalY = doc.lastAutoTable.finalY + 10;

// Total Amount in Words
const totalAmountInWords = numberToWords(total);
doc.setFontSize(10);
doc.text(`Total Amount (in words): ${totalAmountInWords}`, 14, finalY);

// Total Amount in Numbers
doc.text(`Total Balanace : Rs ${total.toFixed(2)}`, 14, finalY + 8); 


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

// Shipping Info Section
// doc.setFont('helvetica', 'bold');
// doc.text('Shipping Information', 110, addressY + 10);
// doc.setFont('helvetica', 'normal');
// doc.text('To:', 110, addressY + 15);

// const shipAddress = profile?.shipAddress || 'N/A';
// const shipAddressLines = shipAddress.split(',');
// let shipAddressY = addressY + 20;
// shipAddressLines.forEach((line, index) => {
//   doc.text(line, 110, shipAddressY + (index * 5));
// });

// Banking Details Section in Horizontal Layout
const bankingY = addressY + 55; // Position for Banking Section
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.text('Banking Details:', 14, bankingY);
doc.setDrawColor(0, 0, 0);
doc.line(10, bankingY + 3, 200, bankingY + 3); // Underline

// Using autoTable for horizontal banking details
doc.autoTable({
  startY: bankingY + 10,
  head: [['Bank Name', 'Name of Firm', 'Account Number', 'IFSC CODE', 'Account Type', 'Branch']],
  body: [
    [
      'IDFC FIRST BANK',
      'VIKAH RUBBERS',
      '10113716761',
      'IDFB0040132',
      'CURRENT A/C',
      'NERUL BRANCH'
    ]
  ],
  theme: 'grid',
  styles: { fontSize: 8, cellPadding: 2 }, // Reduced font size and padding
  columnStyles: { 
    0: { cellWidth: 30 }, 
    1: { cellWidth: 35 }, 
    2: { cellWidth: 40 }, 
    3: { cellWidth: 30 }, 
    4: { cellWidth: 25 }, 
    5: { cellWidth: 30 } 
  },
  headStyles: { fontSize: 9, fontStyle: 'bold', fillColor: [240, 240, 240], textColor: [0, 0, 0] },
  margin: { top: 10, left: 10, right: 10 }
});


// Terms and Conditions
const termsY = bankingY + 50;
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
      } catch (err) {
        console.error('Error uploading file:', err.response ? err.response.data : err.message);
        displayAlert('Error uploading file', 'danger');
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
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => generatePDF(order)}
                            >
                              <i className="bi bi-download"></i> Invoice
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
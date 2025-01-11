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

    // Logo
    if (logo) {
        doc.addImage(logo, 'JPEG', 11, 6, 40, 20);
    }

    // Header
    doc.setFontSize(16);
    doc.text('PROFORMA INVOICE', 70, 20);
    doc.setFontSize(8);
    const formattedDate = new Date(order.orderDate).toLocaleDateString();
    doc.text(`Order ID: ${order._id}`, 194, 15, { align: 'right' });
    doc.text(`Order Date: ${formattedDate}`, 190, 20, { align: 'right' });
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 25, 200, 25);

    // Billing and Shipping Information
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Billing Information', 14, 35);
    doc.text('Shipping Information', 110, 35);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    let billingY = 45;
    let shippingY = 45;

    if (profile) {
        // Billing Info
        doc.text(`Company: ${profile.companyName || 'N/A'}`, 14, billingY);
        doc.text(`Email: ${profile.email || 'N/A'}`, 14, billingY + 5);
        doc.setFont('helvetica', 'bold');
        doc.text('Address:', 14, billingY + 10);
        doc.setFont('helvetica', 'normal');

        const billingAddress = profile.billAddress || 'N/A';
        const billingAddressLines = doc.splitTextToSize(billingAddress, 80);
        doc.text(billingAddressLines, 14, billingY + 15);

        // Shipping Info
        doc.setFont('helvetica', 'bold');
        doc.text('Address:', 110, shippingY);
        doc.setFont('helvetica', 'normal');
        const shippingAddress = order.shippingAddress || 'N/A';
        const shippingAddressLines = doc.splitTextToSize(shippingAddress, 80);
        doc.text(shippingAddressLines, 110, shippingY + 5);

        billingY += billingAddressLines.length * 5 + 20;
        shippingY += shippingAddressLines.length * 5 + 20;
    }

    const contentY = Math.max(billingY, shippingY);

    
    // Order Details Section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Details', 14, contentY);
    doc.line(10, contentY + 3, 200, contentY + 3);

    // Calculate totals
    let subtotal = 0;
    order.items.forEach(item => {
        subtotal += item.quantity * item.price;
    });
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    // Table for order details
    doc.autoTable({
        startY: contentY + 5,
        head: [['Order ID', 'Item Name', 'Qty (tons)', 'Price/Ton', 'Subtotal', 'GST', 'Total']],
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
    const secondTableStartX = 140;

    doc.autoTable({
        startY: firstTableFinalY + 5,
        startX: 30,
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

    // Address Details Section
    const addressY = totalsTableFinalY + 30;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Address Details', 14, addressY);
    doc.line(10, addressY + 3, 200, addressY + 3);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('From:', 14, addressY + 10);
    doc.text('VIKAH RUBBERS', 14, addressY + 15);
    doc.text('Hyderabad', 14, addressY + 20);
    doc.text('Dispatch From:', 14, addressY + 25);
    doc.text('#406, 4th Floor, Patel Towers,', 14, addressY + 30);
    doc.text('Above EasyBuy Beside Nagole RTO Office,', 14, addressY + 35);
    doc.text('Nagole Hyderabad, Telangana-500035', 14, addressY + 40);

    // Banking Details Section
    const bankingY = addressY;
    const bankingStartX = 120;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Banking Details:', bankingStartX, bankingY);
    doc.line(bankingStartX - 5, bankingY + 3, bankingStartX + 85, bankingY + 3);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Bank Name:', bankingStartX, bankingY + 10);
    doc.text('IDFC FIRST BANK', bankingStartX + 30, bankingY + 10);

    doc.text('Name of Firm:', bankingStartX, bankingY + 15);
    doc.text('VIKAH RUBBERS', bankingStartX + 30, bankingY + 15);

    doc.text('Account Number:', bankingStartX, bankingY + 20);
    doc.text('10113716761', bankingStartX + 30, bankingY + 20);

    doc.text('IFSC CODE:', bankingStartX, bankingY + 25);
    doc.text('IDFB0040132', bankingStartX + 30, bankingY + 25);

    doc.text('Branch:', bankingStartX, bankingY + 30);
    doc.text('NERUL BRANCH', bankingStartX + 30, bankingY + 30);

    // Terms and Conditions Section
    const termsY = bankingY + 60;
    doc.setFont('helvetica', 'bold');
    doc.text('Terms and Conditions:', 14, termsY);
    doc.line(10, termsY + 3, 200, termsY + 3);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('1. The Seller shall not be liable to the Buyer for any loss or damage.', 14, termsY + 10);
    doc.text('2. The Seller warrants the product for one (1) year from the date of shipment.', 14, termsY + 15);
    doc.text('3. The purchase order will be interpreted as acceptance of this offer.', 14, termsY + 20);

// Increase the size and move the image to the left
const imageY = termsY + 20;
doc.addImage(seal, 'PNG', 120, imageY, 80, 80); // Moved the image left by changing the x-coordinate to 120



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
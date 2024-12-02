import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import logo from './images/logo.png';

const BuyReport = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [itemNameFilter, setItemNameFilter] = useState('');
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setTimeout(() => {
        alert('Please log in to view Buy reports');
        navigate('/Login');
      }, 0);
      return;
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, {
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
    doc.text('INVOICE', 86, 20);
    doc.setFontSize(10);
    const formattedDate = new Date(order.orderDate).toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Invoice Date: ${formattedDate}`, 190, 20, { align: 'right' });
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 25, 200, 25); // Underline

    // Billing and Shipping Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Billing Information', 14, 35);
    doc.text('Shipping Information', 110, 35);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 38, 200, 38); // Underline

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
doc.setFont('helvetica', 'bold');
doc.text('Shipping Information', 110, addressY + 10);
doc.setFont('helvetica', 'normal');
doc.text('To:', 110, addressY + 15);

// Split the shipping address into multiple lines (assuming it could be long)
const shipAddress = profile?.shipAddress || 'N/A';
const shipAddressLines = shipAddress.split(','); // Split address by commas to create multiple lines
let shipAddressY = addressY + 20;
shipAddressLines.forEach((line, index) => {
  doc.text(line, 110, shipAddressY + (index * 5)); // Adjust line spacing
});


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
    <>
    <div className='setter'>
<div className='container'>

      <h2>Buy Report</h2>
      <div className="row mb-4">
    <div className="col-md-3">
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Start Date"
        className="form-control"
      />
    </div>
    <div className="col-md-3">
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        placeholderText="End Date"
        className="form-control"
      />
    </div>
    <div className="col-md-3">
      <input
        type="text"
        placeholder="Filter by Item Name"
        value={itemNameFilter}
        onChange={(e) => setItemNameFilter(e.target.value)}
        className="form-control"
      />
    </div>
    <div className="col-md-3 d-flex align-items-end">
      <button
        className="btn btn-primary w-100"
        onClick={filterOrders}
      >
        Apply Filters
      </button>
    </div>
  </div>


      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
<div className="table-responsive">
<table className="table table-striped table-bordered table-hover">
  <thead className="thead-dark">
    <tr>
      <th>Order ID</th>
      <th>Item Name</th>
      <th>Required Quantity (tons)</th>
      <th>Price Per Ton (₹)</th>
      <th>Subtotal (₹)</th>
      <th>GST (₹)</th>
      <th>Total Price (₹)</th>
      <th>Order Date</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {filteredOrders.map(order => (
      <>
        {order.items.map((item, index) => {
          // Calculate totals for each item separately
          const itemSubtotal = item.quantity * item.price;
          const itemGST = itemSubtotal * 0.18; // Assuming 18% GST
          const itemTotal = itemSubtotal + itemGST;

          return (
            <tr key={item._id}>
              {/* Show Order ID for the first item only, with rowSpan equal to the number of items */}
              {index === 0 && (
                <td rowSpan={order.items.length}>{order._id}</td>
              )}

              {/* Display Item Name */}
              <td>{item.name}</td>
              
              {/* Display Required Quantity for each item */}
              <td>{item.quantity} tons</td>
              
              {/* Display Price Per Ton */}
              <td>₹{item.price.toFixed(2)}</td>
              
              {/* Display Subtotal for each item */}
              <td>₹{itemSubtotal.toFixed(2)}</td>
              
              {/* Display GST for each item */}
              <td>₹{itemGST.toFixed(2)}</td>
              
              {/* Display Total Price for each item */}
              <td>₹{itemTotal.toFixed(2)}</td>
              
              {/* Show Order Date for the first item only */}
              {index === 0 && (
                <td rowSpan={order.items.length}>{new Date(order.orderDate).toLocaleDateString()}</td>
              )}

              {/* Show the Download Invoice button for the first item only */}
              {index === 0 && (
                <td rowSpan={order.items.length}>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => generatePDF(order)}
                  >
                    <i className="bi bi-download"></i> Download Invoice
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






      )}
  </div>
     </div></>
  );
};

export default BuyReport;

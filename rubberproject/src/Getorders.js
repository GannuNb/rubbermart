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
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';



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
        // Directly set the scroll position to the top of the page
        document.documentElement.scrollTop = 0; 
        document.body.scrollTop = 0;  // For compatibility with older browsers
      }, []); // Empty dependency array ensures it runs only once on page load
  
      
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
    if (num === 0) return 'zero Rupees Only';
  
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
      'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen','Nineteen',
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
    const numToWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + numToWords(n % 100) : '');
      return '';
    };
  
    const units = ['Crore', 'Lakh', 'Thousand', 'Hundred'];
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
      result += ` and ${numToWords(fractionalPart)} Paise`;
    }
  
    return result.trim() + ' Rupees Only';
  };
  
  const generatePDF = (order) => {
    const doc = new jsPDF();

    if (logo) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Rubberscrapmart", 5, 24);
    }

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    const companyAddress = [
        'Rubberscrapmart',
        'Ground Floor, Office No-52/ Plot No-44,',
        'Sai Chamber CHS Wing A, Sector -11',
        'Sai Chambers, CBD Belapur, Navi Mumbai,',
        'Thane, Maharashtra, 400614',
        'GSTN : 27AAVFV4635R1ZY',
    ];

    let addressY = 12;
    doc.text(companyAddress[0], 40, addressY + 4);
    doc.text(companyAddress[1], 40, addressY + 8);
    doc.text(companyAddress[2], 40, addressY + 12);
    doc.text(companyAddress[3], 40, addressY + 16);
    doc.text(companyAddress[4], 40, addressY + 20);
    doc.text(companyAddress[5], 40, addressY + 24);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFORMA INVOICE', 105, addressY + 1, { align: 'center' });

    doc.setFontSize(8);
    const formattedDate = new Date(order.orderDate).toLocaleDateString();
    const orderLabelX = 160, colonX = 175, valueX = 180;

    doc.text(`Order ID`, orderLabelX, addressY + 5);
    doc.text(`:`, colonX, addressY + 5);
    doc.text(`${order._id}`, valueX, addressY + 5);

    doc.text(`Order Date`, orderLabelX, addressY + 10);
    doc.text(`:`, colonX, addressY + 10);
    doc.text(`${formattedDate}`, valueX, addressY + 10);

    doc.line(10, addressY + 25, 200, addressY + 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To', 14, addressY + 30);
    doc.text('Ship To', 140, addressY + 30);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    let billingY = addressY + 36;
    let shippingY = addressY + 36;
    const maxAddressLength = 60;

    if (profile) {
        // Billing Info
        const billingLabelX = 14, billingColonX = 40, billingValueX = 45;
        doc.text('Company', billingLabelX, billingY);
        doc.text(':', billingColonX, billingY);
        doc.text(profile.companyName || 'N/A', billingValueX, billingY);

        doc.text('Address', billingLabelX, billingY + 5);
        doc.text(':', billingColonX, billingY + 5);
        const billingAddressLines = doc.splitTextToSize(profile.billAddress || 'N/A', maxAddressLength);
        billingAddressLines.forEach((line, index) => {
            doc.text(line, billingValueX, billingY + 5 + (index * 5));
        });

        let adjustedBillingY = billingY + 5 + (billingAddressLines.length * 5);

        doc.text('Phone', billingLabelX, adjustedBillingY);
        doc.text(':', billingColonX, adjustedBillingY);
        doc.text(profile.phoneNumber || 'N/A', billingValueX, adjustedBillingY);

        doc.text('E-mail', billingLabelX, adjustedBillingY + 5);
        doc.text(':', billingColonX, adjustedBillingY + 5);
        doc.text(profile.email || 'N/A', billingValueX, adjustedBillingY + 5);

        doc.text('GSTN', billingLabelX, adjustedBillingY + 10);
        doc.text(':', billingColonX, adjustedBillingY + 10);
        doc.text(profile.gstNumber || 'N/A', billingValueX, adjustedBillingY + 10);

        billingY = adjustedBillingY + 15;

        // Shipping Info
        const shippingLabelX = 110, shippingColonX = 135, shippingValueX = 140;
        doc.text('Company', shippingLabelX, shippingY);
        doc.text(':', shippingColonX, shippingY);
        doc.text(profile.companyName || 'N/A', shippingValueX, shippingY);

        doc.text('Address', shippingLabelX, shippingY + 5);
        doc.text(':', shippingColonX, shippingY + 5);
        const shippingAddressLines = doc.splitTextToSize(order.shippingAddress || 'N/A', maxAddressLength);
        shippingAddressLines.forEach((line, index) => {
            doc.text(line, shippingValueX, shippingY + 5 + (index * 5));
        });

        let adjustedShippingY = shippingY + 5 + (shippingAddressLines.length * 5);

        doc.text('Phone', shippingLabelX, adjustedShippingY);
        doc.text(':', shippingColonX, adjustedShippingY);
        doc.text(profile.phoneNumber || 'N/A', shippingValueX, adjustedShippingY);

        doc.text('E-mail', shippingLabelX, adjustedShippingY + 5);
        doc.text(':', shippingColonX, adjustedShippingY + 5);
        doc.text(profile.email || 'N/A', shippingValueX, adjustedShippingY + 5);

        doc.text('GSTN', shippingLabelX, adjustedShippingY + 10);
        doc.text(':', shippingColonX, adjustedShippingY + 10);
        doc.text(profile.gstNumber || 'N/A', shippingValueX, adjustedShippingY + 10);

        shippingY = adjustedShippingY + 20;
    }

    const contentY = Math.max(billingY, shippingY);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Details', 14, contentY);
    doc.line(10, contentY + 3, 200, contentY + 3);

    // Initialize totalGST and subtotal
    let totalGST = 0;
    let subtotal = 0;

    order.items.forEach((item) => {
        subtotal += item.quantity * item.price;
    });

    // GST calculation based on GST number
    let gstRate = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    let taxHeading = '';

    if (profile.gstNumber && profile.gstNumber.startsWith('27')) {
        // Apply CGST + SGST if GST number starts with 27 (9% each)
        gstRate = 0.18; // Total GST is 18%
        cgstAmount = subtotal * 0.09;  // 9% CGST
        sgstAmount = subtotal * 0.09;  // 9% SGST
        taxHeading = 'CGST + SGST';
    } else {
        // Apply IGST (18%)
        gstRate = 0.18;  // Total GST is 18%
        igstAmount = subtotal * 0.18;
        taxHeading = 'IGST';
    }

    // Calculate GST for each item and accumulate the totalGST
    let accumulatedGST = 0;

    order.items.forEach((item) => {
        const itemSubtotal = item.quantity * item.price;
        let gstAmount = 0;

        if (gstRate === 0.18) {
            // For CGST + SGST (9% + 9% = 18%)
            const cgst = itemSubtotal * 0.09;
            const sgst = itemSubtotal * 0.09;
            gstAmount = cgst + sgst;  // Total GST is 18% of the subtotal
        } else {
            // For IGST (18%)
            gstAmount = itemSubtotal * 0.18;
        }

        accumulatedGST += gstAmount;  // Accumulate the GST
    });

    const total = subtotal + accumulatedGST;

    // Table for order details
    doc.autoTable({
        startY: contentY + 5,
        head: [['Order ID', 'Item Name', 'Qty (tons)', 'Price/Ton', 'Subtotal', taxHeading, 'Total']],
        body: order.items.map((item) => {
            const itemSubtotal = item.quantity * item.price;

            let gstAmount = 0;
            let totalWithTax = 0;

            if (gstRate === 0.18) {
                // For CGST + SGST (9% + 9% = 18%)
                const cgst = itemSubtotal * 0.09;
                const sgst = itemSubtotal * 0.09;
                gstAmount = cgst + sgst;  // Total GST is 18% of the subtotal
                totalWithTax = itemSubtotal + gstAmount;
            } else {
                // For IGST (18%)
                gstAmount = itemSubtotal * 0.18;
                totalWithTax = itemSubtotal + gstAmount;
            }

            return [
                order._id,
                item.name,
                `${item.quantity} tons`,
                `${item.price.toFixed(2)}`,
                `${itemSubtotal.toFixed(2)}`,
                gstRate === 0.18 ? `${gstAmount.toFixed(2)}` : `${gstAmount.toFixed(2)}`,
                `${totalWithTax.toFixed(2)}`,
            ];
        }),
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
            ['Total GST', accumulatedGST.toFixed(2)],  // Corrected to accumulate GST for all items
            ['Total', (subtotal + accumulatedGST).toFixed(2)],
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
    doc.text(`Total Amount (In Words): ${totalAmountInWords}`, 14, totalsTableFinalY + 10);
    doc.text(`Total Balance: Rs ${total.toFixed(2)}`, 14, totalsTableFinalY + 18);

   // Banking Details Section
    const bankingY = totalsTableFinalY + 30;

    // Title
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Banking Details:', 14, bankingY);
    doc.line(10, bankingY + 3, 200, bankingY + 3);

    // Content
    doc.setFontSize(8);
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
    // Generate the PDF
    doc.save('order_invoice.pdf');
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
      <div className="container-fluid">
<h2 style={{ textAlign: "center", }}>ALL ORDERS</h2>
        <div className="table-responsive mt-3">
          <table className="table table-striped table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Order ID</th>
                <th>Item Name</th>
                <th>Total Ordered Quantity (tons)</th>
                <th>Price Per Ton (₹)</th>
                <th>Loading Location</th>
                <th>Subtotal (₹)</th>
                {/* Conditional GST heading based on GST number */}
                <th>{profile?.gstNumber?.startsWith('27') ? 'CGST + SGST (₹)' : 'IGST (₹)'}</th>
                <th>Total Price (₹)</th>
                <th>Order Date</th>
                <th>Invoice</th>
                <th><b>Upload Payment Receipt</b></th>
                <th>Shipping Info</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <>
                  {order.items.map((item, index) => {
                    const itemSubtotal = item.quantity * item.price;
  
                    // Fetch GST number from profile and check the first two characters
                    const gstNumber = profile?.gstNumber || ''; // Ensure you have the gstNumber in profile
  
                    // Check if the GST number starts with '27' for CGST + SGST, else apply IGST
                    const isCGSTSGST = gstNumber.startsWith('27');
                    const gstRate = isCGSTSGST ? 0.09 : 0.18;
  
                    // Calculate GST
                    const itemGST = isCGSTSGST
                      ? (itemSubtotal * 0.09) + (itemSubtotal * 0.09) // 9% CGST + 9% SGST
                      : itemSubtotal * 0.18; // 18% IGST
  
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
                        {/* Display the GST value */}
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
                        <td>
                          <Link to="/ShippingDetails" >
                            <button className="btn btn-primary">
                              <FaArrowRight />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
  
  
}


export default Getorders;
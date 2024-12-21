import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import logo1 from './images/logo.png';
import { useNavigate,useLocation } from 'react-router-dom';
import logo from './images/logo.png';
import { jsPDF } from "jspdf";




function Buyreport() {
  const [mergedData, setMergedData] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();  // Correctly use the hook to get the location
      const [shippingDetails, setShippingDetails] = useState([]);
        const [profile, setProfile] = useState(null);
      
    

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
  
  const generatePDF = (order, index) => {
    const doc = new jsPDF();
    
    // Add logo
    if (logo) {
      doc.addImage(logo, 'JPEG', 10, 10, 40, 20);
    }
    
    // Add heading and other details
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    // Draw horizontal line
    doc.line(10, 30, 200, 30);
    const formattedDate = order.shippingDate
      ? new Date(order.shippingDate).toLocaleDateString()
      : 'N/A';
    doc.setFontSize(10);
    doc.text(`Date: ${formattedDate}`, 190, 35, { align: 'right' });
  
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
      
      doc.text(`Shipping Address: ${profile.shipAddress || 'N/A'}`, 110, 55);
    }
    
    // Add order details table
    doc.autoTable({
      startY: 85,
      head: [
        ['Order ID', 'Total Order Quantity', 'Shipped Quantity', 'Remaining Quantity', 'Email', 'GST', 'Total Price'],
      ],
      body: [
        [
          order.orderId ? order.orderId : 'N/A',
          Object.entries(order.totalRequiredQuantity).map(([product, totalQty]) => `${product}: ${totalQty}`).join(", "),
          Object.entries(order.shippedQuantity).map(([product, shippedQty]) => `${product}: ${shippedQty}`).join(", "),
          Object.entries(order.remainingQuantity).map(([product, remainingQty]) => `${product}: ${remainingQty}`).join(", "),
          order.email || 'N/A',
          `₹${order.gst.toFixed(2)}`,
          `₹${order.totalPrice.toFixed(2)}`,
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
    
    // Save the PDF with dynamic invoice ID
    const invoiceId = `VRI_24-25_${index + 1}`; // Example invoice ID format
    doc.save(`Invoice_${invoiceId}.pdf`);
  };
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
           alertMessage.textContent = 'Please log in to Check Buy Reports.';
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
     }, [navigate, location]);


  useEffect(() => {
    const fetchAndMergeShippingDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/shippinguser`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const shippingDetails = response.data.shippingDetails;

        // Group data by orderId
        const groupedData = shippingDetails.reduce((acc, detail) => {
          const orderId = detail.orderId?._id || 'Unknown Order ID';

          if (!acc[orderId]) {
            acc[orderId] = {
              orderId,
              totalRequiredQuantity: {},
              shippedQuantity: {},
              remainingQuantity: {},
              email: detail.email || 'N/A',
              gst: 0,
              totalPrice: 0,
              itemDetails: [],
              pdfs: [],
            };
          }

          acc[orderId].gst += detail.gst;
          acc[orderId].totalPrice += detail.totalPrice;

          // Merge shipped quantities for each product and calculate remaining quantity
          if (detail.itemDetails) {
            detail.itemDetails.forEach((item) => {
              const productName = item.name;
              const totalRequiredQty = item.quantity;
              const selectedProductQty = detail.selectedProduct === item.name ? detail.quantity : 0;

              acc[orderId].totalRequiredQuantity[productName] = totalRequiredQty;
              acc[orderId].shippedQuantity[productName] =
                (acc[orderId].shippedQuantity[productName] || 0) + selectedProductQty;
              acc[orderId].remainingQuantity[productName] =
                totalRequiredQty - acc[orderId].shippedQuantity[productName];
            });
          }

          if (detail.billPdf && detail.billPdf.base64) {
            acc[orderId].pdfs.push({
              base64: detail.billPdf.base64,
              contentType: detail.billPdf.contentType,
            });
          }

          return acc;
        }, {});

        setMergedData(Object.values(groupedData));
      } catch (error) {
        console.error('Error fetching and merging shipping details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndMergeShippingDetails();
  }, []);

  const mergePDFs = async (pdfs) => {
    const mergedPdf = await PDFDocument.create();

    for (const pdf of pdfs) {
      const existingPdf = await PDFDocument.load(
        Uint8Array.from(atob(pdf.base64), (char) => char.charCodeAt(0))
      );
      const copiedPages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'merged_report.pdf';
    link.click();
  };

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

  return (
    <div className="setter">
      <div className="container mt-5">
        <h2 className="text-center mb-4">Buy Reports</h2>
        {mergedData.length === 0 ? (
          <p className="text-center">No data available.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total Order Quantity</th>
                  <th>Shipped Quantity</th>
                  <th>Remaining Quantity</th>
                  <th>Email</th>
                  <th>GST</th>
                  <th>Total Price</th>
                  <th>Buy Report</th>
                  {/* <th>Invoice</th> */}
                </tr>
              </thead>
              <tbody>
                {mergedData.map((data) => (
                  <tr key={data.orderId}>
                    <td>{data.orderId}</td>
                    <td>
                      {Object.entries(data.totalRequiredQuantity).map(([product, totalQty], index) => (
                        <div key={index}>
                          <strong>{product}</strong>: {totalQty}
                        </div>
                      ))}
                    </td>
                    <td>
                      {Object.entries(data.shippedQuantity).map(([product, quantity], index) => (
                        <div key={index}>
                          <strong>{product}</strong>: {quantity}
                        </div>
                      ))}
                    </td>
                    <td>
                      {Object.entries(data.remainingQuantity).map(([product, remainingQty], index) => (
                        <div key={index}>
                          <strong>{product}</strong>: {remainingQty}
                        </div>
                      ))}
                    </td>
                    <td>{data.email}</td>
                    <td>₹{data.gst.toFixed(2)}</td>
                    <td>₹{data.totalPrice.toFixed(2)}</td>
                    <td>
                      {data.pdfs.length > 0 ? (
                        <>
                          <button
                            className="btn btn-info me-2"
                            onClick={() => mergePDFs(data.pdfs)}
                          >
                            PDFs
                          </button>
                        </>
                      ) : (
                        <span>No PDFs</span>
                      )}
                    </td>
                    {/* <td>
                    <button className="btn btn-primary" onClick={() => generatePDF(data)}>Invoice PDF</button>
                  </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Buyreport;

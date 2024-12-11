import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './images/logo.png';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function ShippingDetails() {
  const [shippingDetails, setShippingDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [pdfUrls, setPdfUrls] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to view shipping details.");
      navigate('/Login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchShippingDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/shippinguser`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.shippingDetails) {
          setShippingDetails(response.data.shippingDetails);

          // Generate PDF URLs for all records
          const urls = response.data.shippingDetails.map((record) => {
            if (record.pdf?.data) {
              const binary = new Uint8Array(record.pdf.data.data);
              const blob = new Blob([binary], { type: record.pdf.contentType });
              return URL.createObjectURL(blob);
            }
            return null;
          });

          setPdfUrls(urls);
        }
      } catch (error) {
        console.error('Error fetching shipping details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShippingDetails();
  }, []);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/business-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.profileExists) {
          setProfile(response.data.businessProfile);
        }
      } catch (err) {
        console.error('Error fetching business profile:', err);
      }
    };

    fetchProfile();
  }, []);

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
        ['Order ID', 'Vehicle Number', 'Product', 'Quantity (tons)', 'Price Per Ton', 'Subtotal', 'GST', 'Total Price'],
      ],
      body: [
        [
          order.orderId ? order.orderId._id : 'N/A',
          order.vehicleNumber || 'N/A',
          order.selectedProduct || 'N/A',
          `${order.quantity || 0} tons`,
          // Find the price of the selected product from the itemDetails array
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

  const downloadOrderPDFs = async (orderId) => {
    const zip = new JSZip();

    // Filter the details for the specific Order ID
    const orderDetails = shippingDetails.filter(detail => detail.orderId._id === orderId);

    // Create an array of promises to generate PDFs
    const pdfPromises = orderDetails.map(async (detail) => {
      try {
        const pdfBlob = await generatePDF(detail); // Generate PDF blob for each detail
        zip.file(`Invoice_${detail._id}.pdf`, pdfBlob); // Add the PDF blob to the zip file
      } catch (error) {
        console.error(`Error generating PDF for order ${detail._id}:`, error);
      }
    });

    // Wait for all PDFs to be generated and added to the ZIP
    await Promise.all(pdfPromises);

    // After all PDFs are added to the ZIP, generate the ZIP file and trigger download
    try {
      const zipContent = await zip.generateAsync({ type: 'blob' });
      saveAs(zipContent, `Invoices_${orderId}.zip`); // Save the ZIP file
    } catch (error) {
      console.error("Error generating ZIP file:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  // Group the shipping details by Order ID
  const groupedByOrder = shippingDetails.reduce((acc, detail) => {
    if (!acc[detail.orderId._id]) {
      acc[detail.orderId._id] = [];
    }
    acc[detail.orderId._id].push(detail);
    return acc;
  }, {});

  return (
    <div className="setter">
      <div className="container mt-5">
        <h2 className="text-center mb-4">Shipping Details</h2>
        {shippingDetails.length === 0 ? (
          <p className="text-center">No shipping details available.</p>
        ) : (
          <div>
            {Object.keys(groupedByOrder).map((orderId) => (
              <div key={orderId} className="order-group">
                <button
                  className="btn btn-success mb-4"
                  onClick={() => downloadOrderPDFs(orderId)}
                >
                  Download All PDFs for this Order
                </button>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Vehicle Number</th>
                        <th>Product</th>
                        <th> Shipped Quantity</th>
                        <th>Req quantity</th>
                        <th>Remaining Quantity</th>
                        <th>Email</th>
                        <th>Item Prices</th>
                        
                        <th>Subtotal</th>
                        <th>GST</th>
                        <th>Total Price</th>
                        <th>Shipping Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
  {groupedByOrder[orderId].map((detail, index) => (
    <tr key={detail._id}>
      <td>{detail.orderId ? detail.orderId._id : 'N/A'}</td>
      <td>{detail.vehicleNumber}</td>
      <td>{detail.selectedProduct}</td>
      <td>{detail.quantity}</td>
      <td>
        {detail.itemDetails && detail.itemDetails.length > 0 ? (
          detail.itemDetails
            .filter((item) => item.name === detail.selectedProduct)
            .map((item, index) => (
              <div key={index}>
                {item.quantity}
              </div>
            ))
        ) : (
          <span>No items</span>
        )}
      </td>
      <td>
        {detail.itemDetails && detail.itemDetails.length > 0 ? (
          detail.itemDetails
            .filter((item) => item.name === detail.selectedProduct)
            .map((item, index) => (
              <div key={index}>
                {item.quantity-detail.quantity}
              </div>
            ))
        ) : (
          <span>No items</span>
        )}
      </td>
      
      <td>{detail.email}</td>
      <td>
        {detail.itemDetails && detail.itemDetails.length > 0 ? (
          detail.itemDetails
            .filter((item) => item.name === detail.selectedProduct)
            .map((item, index) => (
              <div key={index}>
                ₹{item.price.toFixed(2)}
              </div>
            ))
        ) : (
          <span>No items</span>
        )}
      </td>

      <td>₹{detail.subtotal.toFixed(2)}</td>
      <td>₹{detail.gst.toFixed(2)}</td>
      <td>₹{detail.totalPrice.toFixed(2)}</td>
      <td>{new Date(detail.shippingDate).toLocaleDateString()}</td>
      <td>
  {/* Bill PDF */}
  {detail.billPdf && detail.billPdf.base64 ? (
    <button
      className="btn btn-info"
      onClick={() => {
        const link = document.createElement('a');
        link.href = `data:${detail.billPdf.contentType};base64,${detail.billPdf.base64}`;
        link.download = `bill_${index}.pdf`;
        link.click();
      }}
    >
      E-WAY Bill PDF
    </button>
  ) : (
    <p>No Bill PDF</p>
  )}
  
  {/* Invoice PDF */}
  {detail.invoicePdf && detail.invoicePdf.base64 ? (
    <button
      className="btn btn-primary mx-3"
      onClick={() => {
        const link = document.createElement('a');
        link.href = `data:${detail.invoicePdf.contentType};base64,${detail.invoicePdf.base64}`;
        link.download = `invoice_${index}.pdf`;
        link.click();
      }}
    >
      Invoice PDF
    </button>
  ) : (
    <p>No Invoice PDF</p>
  )}
   <button
    className="btn btn-primary mx-3"
    onClick={() => generatePDF(detail)}
  >
    Generate Invoice
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

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import logo from './images/logo.png';
import logo1 from './images/logo.png';

function GetPay() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/business-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.profileExists) {
          setProfile(response.data.businessProfile);
          setProfileExists(true);
        } else {
          setProfileExists(false);
        }
      } catch (error) {
        console.error("Error fetching business profile:", error);
        setProfileExists(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setTimeout(() => {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'custom-alert';
        const logoImg = document.createElement('img');
        logoImg.src = logo1;
        logoImg.alt = 'Company Logo';
        logoImg.className = 'alert-logo';
        const alertMessage = document.createElement('span');
        alertMessage.textContent = 'Please log in to access payment details.';
        alertMessage.className = 'alert-message';
        alertDiv.appendChild(logoImg);
        alertDiv.appendChild(alertMessage);
        document.body.appendChild(alertDiv);
        setTimeout(() => {
          alertDiv.remove();
        }, 5000);
        navigate('/Login', { state: { from: location.pathname } });
      }, 0);
      return;
    }
  }, [navigate, location]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/payment/getfiles`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch files');
        }

        const data = await response.json();
        if (data.message === 'Files fetched successfully') {
          setFiles(data.data);
        } else {
          setError('No files found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleDownload = async (paymentId, fileId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/payment/getpayment/${paymentId}/${fileId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'payment-proof';
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download Error:', error);
      alert('Failed to download file: ' + error.message);
    }
  };

  const generatePDFForUser = (payment) => {
    const totalPrice = payment.order?.items.reduce((sum, item) => sum + item.total, 0) || 0;
    const paidAmount = payment.paid || 0;
    const remainingAmount = totalPrice - paidAmount;
  
    const doc = new jsPDF();
  
    // Add logo with padding, positioning it at the top-left corner
    if (logo) {
      doc.addImage(logo, 'JPEG', 10, 10, 30, 15);
    }
  
    // Title Section: "Approval Details" in bold and centered
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 0);
    doc.text('Approval Details', 105, 15, { align: 'center' });
  
    // Order ID: Positioning it at the far right in the same row
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    doc.text(`Order ID: ${payment.order?._id || 'Unknown'}`, 200, 15, { align: 'right' });
  
    // Add a horizontal line below the header
    doc.setDrawColor(0);
    doc.line(10, 25, 200, 25);
  
    // Add Company Name in the PDF
    const companyName = profile ? profile.companyName : 'Loading...';
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Company Name: ${companyName}`, 10, 35);
  
    // Add a horizontal line separating the sections
    doc.setDrawColor(0);
    doc.line(10, 40, 200, 40);
  
    // Product Details Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 0);
    doc.text('Product Details', 10, 50);
  
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    const productDetails = payment.order?.items
      .map((item, index) => `${index + 1}. ${item.name} (Quantity: ${item.quantity})`)
      .join('\n');
    doc.text(productDetails || 'No products found', 10, 60);
  
    let startY = 80;
  
    // Message if no approval history exists
    if (!payment.approval || payment.approval.length === 0) {
      const message = `Dear ${profile.companyName || 'Company'}, your payment receipt has been received successfully. Our accounting team will verify the details and update you shortly. Thank you for your patience and cooperation.`;
  
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0);
      doc.setFillColor(240, 240, 240); // Light grey background for message box
      const messageHeight = 35;
      doc.rect(10, startY, 190, messageHeight, 'F'); // Message background
  
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 51, 102); // Dark blue for message text
      doc.text(message, 15, startY + 10, { maxWidth: 180, align: 'justify' });
  
      startY += messageHeight + 10;
    }
  
    // Approval Table if approval history exists
    if (payment.approval && payment.approval.length > 0) {
      const approvalTableData = payment.approval.map((approval) => [
        approval.approvalDate ? new Date(approval.approvalDate).toLocaleDateString() : 'N/A',
        `${approval.amountPaid.toFixed(2)}`,
      ]);
  
      // Adding table with green header for grid style
      doc.autoTable({
        startY,
        head: [['Date', 'Amount Paid']],
        body: approvalTableData,
        theme: 'grid',
        styles: { fontSize: 12, cellPadding: 5, textColor: [0, 0, 0] },
        headStyles: { fillColor: [0, 102, 0], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [240, 240, 240] }, // Light grey for alternate rows
      });
  
      startY = doc.previousAutoTable.finalY + 15; // Update startY after table
    }
  
    // Summary Section with orange background and padding
    const summaryTextLines = [
      `Total Price: Rs ${totalPrice.toFixed(2)}`,
      `Paid Amount: Rs ${paidAmount.toFixed(2)}`,
      `Remaining Amount:Rs ${remainingAmount.toFixed(2)}`,
    ];
  
    const lineHeight = 8;
    const padding = 5;
    const summaryHeight = summaryTextLines.length * lineHeight + padding * 2;
  
    doc.setFillColor(255, 239, 213); // Light orange for summary box
    doc.rect(10, startY, 190, summaryHeight, 'F'); // Background for summary
  
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 0);
    doc.text('Summary', 15, startY + padding + 4);
  
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    summaryTextLines.forEach((line, index) => {
      doc.text(line, 15, startY + padding + 12 + index * lineHeight);
    });
  
    // Footer with centered text in italics
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100);
    doc.text('Generated by User Payment System', 105, 290, { align: 'center' });
  
    doc.save(`payment-details-${payment.order?._id || 'unknown'}.pdf`);
  };
  
  

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (files.length === 0) {
    return (
      <div className='setter'>
      

      <div className=" text-center my-5">
        <p>No payment history available.</p>
      </div>
      </div>
    );
  }
  
  return (
    <div className="setter">
      <div className="container mt-5">
        <h2 className="text-center mb-4">Uploaded Payment Proof</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>File Names</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Paid Amount</th>
                <th>Remaining Amount</th>
                <th>Uploaded Files</th>
                <th>Payment History</th>
              </tr>
            </thead>
            <tbody>
              {files.map((payment) => {
                const totalPrice = payment.order?.items.reduce((sum, item) => sum + item.total, 0) || 0;
                const remainingAmount = totalPrice - payment.paid;
                return (
                  <tr key={payment._id}>
                    <td>{payment.order?._id || 'Unknown Order'}</td>
                    <td>
                      {payment.files.map((file) => (
                        <div key={file._id}>{file.fileName}</div>
                      ))}
                    </td>
                    <td>
                      {payment.order?.items.map((item, index) => (
                        <div key={index}>{item.name}</div>
                      ))}
                    </td>
                    <td>
                      {payment.order?.items.map((item, index) => (
                        <div key={index}>{item.quantity}</div>
                      ))}
                    </td>
                    <td>₹{totalPrice.toFixed(2)}</td>
                    <td>₹{payment.paid.toFixed(2)}</td>
                    <td>₹{remainingAmount.toFixed(2)}</td>
                    <td>
                      {payment.files.map((file) => (
                        <button
                          key={file._id}
                          className="btn btn-primary btn-sm mb-2 mx-2"
                          onClick={() => handleDownload(payment._id, file._id, file.fileName)}
                        >
                          {file.fileName || 'File'}
                        </button>
                      ))}
                    </td>
                    <td>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => generatePDFForUser(payment)}
                      >
                        History
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GetPay;

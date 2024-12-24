import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './images/logo.png';

function GetPay() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setTimeout(() => {
        alert('Please log in to access payment files.');
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
  
    // Add logo
    if (logo) {
      doc.addImage(logo, 'JPEG', 10, 10, 30, 15);
    }
  
    // Centered Title and Order ID
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 0);
    doc.text('Approval Details', 105, 20, { align: 'center' });
  
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Order ID: ${payment.order?._id || 'Unknown'}`, 200, 20, { align: 'right' });
  
    // Line below the header
    doc.setDrawColor(0);
    doc.line(10, 28, 200, 28);
  
    // User Name and Other Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    doc.text(`User Name: ${payment.user || 'Unknown'}`, 10, 35);
  
    // Product Details
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 0);
    doc.text('Product Details', 10, 45);
  
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    const productDetails = payment.order?.items
      .map((item, index) => `${index + 1}. ${item.name} (Quantity: ${item.quantity})`)
      .join('\n');
    doc.text(productDetails || 'No products found', 10, 51);
  
    // Approval Table
    const approvalTableData = payment.approval.map((approval) => [
      approval.approvalDate ? new Date(approval.approvalDate).toLocaleDateString() : 'N/A',
      `${approval.amountPaid.toFixed(2)}`,
    ]);
  
    doc.autoTable({
      startY: 70,
      head: [['Date', 'Amount Paid']],
      body: approvalTableData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 4, textColor: [0, 0, 0] },
      headStyles: { fillColor: [0, 102, 0], textColor: [255, 255, 255] },
    });
  
    // Summary Section with Fully Fitted Background Color
    const finalY = doc.previousAutoTable.finalY + 10;
    const summaryTextLines = [
      `Total Price: ${totalPrice.toFixed(2)}`,
      `Paid Amount: ${paidAmount.toFixed(2)}`,
      `Remaining Amount: ${remainingAmount.toFixed(2)}`,
    ];
    const lineHeight = 8; // Space between lines
    const padding = 5; // Padding around the text
    const summaryHeight = summaryTextLines.length * lineHeight + padding * 2;
  
    doc.setFillColor(255, 239, 213); // Light orange background color
    doc.rect(10, finalY, 190, summaryHeight, 'F'); // Fully spans the page width
  
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 0);
    doc.text('Summary', 15, finalY + padding + 4);
  
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    summaryTextLines.forEach((line, index) => {
      doc.text(line, 15, finalY + padding + 12 + index * lineHeight);
    });
  
    // Footer
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

  if (error) {
    return <div className="alert alert-danger text-center my-5">{error}</div>;
  }

  return (
    <div className='setter'>
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
                <th>Payment Receipts</th>
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
                        PDF
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

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Adminnav from './Adminnav'; // Navigation component for admin
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Adminshipping.css'; // Custom CSS for styling
import logo from './images/logo.png';

function AdminPayment() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState({});

  // Fetch payment files from the backend
  const fetchFiles = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/payment/getallfiles`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment data');
      }

      const data = await response.json();

      if (data.message === 'Files fetched successfully') {
        setFiles(data.data);

        const initialNotes = data.data.reduce((acc, file) => {
          acc[file.order._id] = {
            notes: '',
            paid: parseFloat(file.paid) || 0,
            additionalPaid: 0,
          };
          return acc;
        }, {});
        setApprovalNotes(initialNotes);
      } else {
        setError('No files found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleApproval = async (orderId) => {
    try {
      const { notes, paid, additionalPaid } = approvalNotes[orderId] || {};
      
      // Make sure we're adding the additional paid to the current paid amount
      const updatedPaid = parseFloat(paid || 0) + parseFloat(additionalPaid || 0);
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/payment/approve/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvalNotes: notes,
          additionalPaid: additionalPaid, // Only send the additionalPaid to the backend
        }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Unknown error occurred');
      }
  
      const data = await response.json();
      alert(data.message);
  
      // Re-fetch files to update the UI
      fetchFiles();
  
      // Reset the approval notes and additionalPaid amount
      setApprovalNotes((prev) => ({
        ...prev,
        [orderId]: { notes: '', paid: updatedPaid, additionalPaid: 0 },
      }));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDownload = async (paymentId, fileId, fileName) => {
    try {
      const downloadUrl = `${process.env.REACT_APP_API_URL}/payment/getpayment/${paymentId}/${fileId}`;
  
      const response = await fetch(downloadUrl, {
        method: 'GET',
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
  
      window.URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      alert('Failed to download file: ' + error.message);
    }
  };

  const generatePDF = (file) => {
    const totalOrderPrice = file.order.items.reduce((sum, item) => sum + item.total, 0);
    const totalPaid = file.approval.reduce((sum, approval) => sum + approval.amountPaid, 0);
    const remainingAmount = totalOrderPrice - totalPaid;
  
    const doc = new jsPDF();
  
    // Add Logo (if available)
   if (logo) {
         doc.addImage(logo, 'JPEG', 11, 6, 40, 20); // Adjust the width and height of the logo
       }
  
    // Header Section with Styling
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 45, 65); // Darker color for the title
    doc.text('Approval Details', 105, 20, { align: 'center' }); // Centered header title
    doc.setFontSize(10);
    doc.setDrawColor(34, 45, 65); // Line color
    doc.line(10, 25, 200, 25); // Horizontal line below header
  
    // Order and User Details (Row-wise format)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    const orderAndUserDetails = `Order ID: ${file.order._id}    |    User Name: ${file.user?.name || 'N/A'}`;
    doc.text(orderAndUserDetails, 14, 35);
  
    // Product Details Section
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 160, 133); // Stylish heading color
    doc.text('Product Details', 14, 45);
  
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    const productDetails = file.order.items
      .map((item, index) => `${index + 1}. ${item.name} (Quantity: ${item.quantity})`)
      .join(' | '); // Join items with a separator for row-wise format
    doc.text(productDetails, 14, 51, { maxWidth: 180 }); // Ensure text wraps if too long
  
    // Approval Table Section
    const startY = 60;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 160, 133);
    doc.text('Approval Table', 14, startY);
  
    doc.autoTable({
      startY: startY + 6,
      head: [['Date', 'Amount Paid']],
      body: file.approval.map((approval) => [
        new Date(approval.approvalDate).toLocaleDateString(),
        `${approval.amountPaid.toFixed(2)}`,
      ]),
      theme: 'striped', // Stylish table theme
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 248, 255] }, // Light blue row background
    });
  
    // Summary Section with Background
    const finalY = doc.autoTable.previous.finalY + 10;
  
    doc.setFillColor(255, 248, 220); // Light beige background
    doc.rect(14, finalY, 182, 40, 'F'); // Draw rectangle for summary section
  
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Summary', 16, finalY + 8); // Add heading
  
    // Summary Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Price: ${totalOrderPrice.toFixed(2)}`, 16, finalY + 16);
    doc.text(`Paid Amount: ${totalPaid.toFixed(2)}`, 16, finalY + 24);
    doc.text(`Remaining Amount: ${remainingAmount.toFixed(2)}`, 16, finalY + 32);
  
    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100);
    doc.text('Generated by Admin Payment System', 105, 290, { align: 'center' }); // Center-aligned footer
  
    // Save PDF
    doc.save(`approval-details-${file._id}.pdf`);
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
    <>
      <Adminnav />
      <div className="container mt-5 contmax">
        <h2 className="text-center mb-4">All Uploaded Payment Proofs</h2>
        <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                {/* <th>Payment ID</th> */}
                <th>User Name</th>
                <th>Company Name</th>
                {/* <th>User Email</th> */}
                <th>Order ID</th>
                <th>Files</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Paid Amount</th>
                <th>Add Received payment </th>
                <th>Remaining Amount</th>
                <th>Approval Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => {
                const totalOrderPrice = file.order.items.reduce((sum, item) => sum + item.total, 0);
                const totalPaid = approvalNotes[file.order._id]?.paid || 0;
                const additionalPaid = approvalNotes[file.order._id]?.additionalPaid || 0;
                const remainingAmount = totalOrderPrice - (totalPaid + additionalPaid);

                return (
                  <tr key={file.order._id}>
                    {/* <td>{file._id}</td> */}
                    <td>{file.user?.name || 'N/A'}</td>
                    <td>{file.user?.businessProfiles[0]?.companyName || 'N/A'}</td>
                    {/* <td>{file.user?.email || 'N/A'}</td> */}
                    <td>{file.order._id}</td>
                    <td>
                      {file.files.map((f) => (
                        <button
                          key={f._id}
                          className="btn btn-link p-0"
                          onClick={() => handleDownload(file._id, f._id, f.fileName)}
                        >
                          {f.fileName}
                        </button>
                      ))}
                    </td>
                    <td>
                      {file.order.items.map((item) => (
                        <div key={item._id}>{item.name}</div>
                      ))}
                    </td>
                    <td>
                      {file.order.items.map((item) => (
                        <div key={item._id}>{item.quantity}</div>
                      ))}
                    </td>
                    <td>₹{totalOrderPrice.toFixed(2)}</td>
                    <td>₹{totalPaid.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={additionalPaid || ''}
                        onChange={(e) =>
                          setApprovalNotes((prev) => ({
                            ...prev,
                            [file.order._id]: {
                              ...prev[file.order._id],
                              additionalPaid: parseFloat(e.target.value) || 0,
                            },
                          }))
                        }
                        placeholder="Enter Received amount"
                      />
                    </td>
                    <td>₹{remainingAmount.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => generatePDF(file)}
                      >
                        Details
                      </button>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          remainingAmount === 0 ? 'btn-success' : 'btn-primary'
                        }`}
                        onClick={() => handleApproval(file.order._id)}
                      >
                        {remainingAmount === 0 ? 'Approve' : 'Approve Payment'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminPayment;

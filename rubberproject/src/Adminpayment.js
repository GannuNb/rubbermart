import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Adminnav from './Adminnav'; // Navigation component for admin
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Adminshipping.css'; // Custom CSS for styling
import logo from './images/logo.png';
import { useNavigate } from 'react-router-dom';

function AdminPayment() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Directly set the scroll position to the top of the page
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;  // For compatibility with older browsers
  }, []); // Empty dependency array ensures it runs only once on page load


  useEffect(() => {
    const tokenKey = `admin_token`; // Check if any valid token exists
    if (localStorage.getItem(tokenKey)) {
      setIsAuthenticated(true);  // If the token is found, user is authenticated
    } else {
      // If no token, navigate to the login page
      navigate('/admin');  // Adjust this path to match your actual login page route
    }
  }, [navigate]); // Make sure to include `navigate` in the dependency array

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
        setError('No payment details available right now');
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

  // Handle search filter
  const filteredFiles = files.filter((file) => {
    const searchString = searchTerm.toLowerCase();
    return (
      file.user?.name?.toLowerCase().includes(searchString) ||
      file.user?.businessProfiles[0]?.companyName?.toLowerCase().includes(searchString) ||
      file.order._id?.toLowerCase().includes(searchString) ||
      file.order.items.some(item => item.name.toLowerCase().includes(searchString))
    );
  });

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
      window.location.reload();
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

    // Display products one after another
    let productY = 51; // Initial Y position for products
    file.order.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} (Quantity: ${item.quantity})`, 14, productY);
      productY += 7; // Adjust vertical spacing for each product
    });

    // Approval Table Section
    const startY = productY + 10; // Start below the last product

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

  // Render Loading or Error State
  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Adminnav />
      <div className="container mt-5 contmax">

        <div className="card shadow-lg border-0">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="m-0">All Uploaded Payment Proofs</h5>
            <input
              type="text"
              placeholder="Search by Order ID, User Name, Company Name, or Product Name"
              className="form-control w-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        {filteredFiles.length > 0 ? (
          <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
            <table className="table table-bordered">
              <thead className="text-white" style={{ backgroundColor: "#6a11cb" }}>
                <tr>
                  <th>User Name</th>
                  <th>Company Name</th>
                  <th>Order ID</th>
                  <th>Payment Files</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Paid Amount</th>
                  <th>Add Received Payment</th>
                  <th>Remaining Amount</th>
                  <th>Approval Details</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => {
                  const totalOrderPrice = file.order.items.reduce((sum, item) => sum + item.total, 0);
                  const totalPaid = approvalNotes[file.order._id]?.paid || 0;
                  const additionalPaid = approvalNotes[file.order._id]?.additionalPaid || 0;
                  const remainingAmount = totalOrderPrice - (totalPaid + additionalPaid);

                  return (
                    <tr key={file.order._id} style={{ backgroundColor: remainingAmount === 0 ? "#e8f5e9" : "#fff" }}>
                      <td className="fw-semibold">{file.user?.name || "N/A"}</td>
                      <td className="fw-semibold">{file.user?.businessProfiles[0]?.companyName || "N/A"}</td>
                      <td>{file.order._id}</td>
                      <td>
                        {file.files.map((f) => (
                          <button
                            key={f._id}
                            className="btn btn-link p-0 text-primary"
                            onClick={() => handleDownload(file._id, f._id, f.fileName)}
                          >
                            {f.fileName}
                          </button>
                        ))}
                      </td>
                      <td>{file.order.items.map((item) => <div key={item._id}>{item.name}</div>)}</td>
                      <td>{file.order.items.map((item) => <div key={item._id}>{item.quantity}</div>)}</td>
                      <td className="text-danger fw-bold">₹{totalOrderPrice.toFixed(2)}</td>
                      <td className="text-success fw-bold">₹{totalPaid.toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control border border-secondary"
                          value={additionalPaid || ""}
                          onChange={(e) =>
                            setApprovalNotes((prev) => ({
                              ...prev,
                              [file.order._id]: {
                                ...prev[file.order._id],
                                additionalPaid: parseFloat(e.target.value) || 0,
                              },
                            }))
                          }
                          placeholder="Enter Amount"
                        />
                      </td>
                      <td className={remainingAmount === 0 ? "text-success" : "text-danger"}>
                        ₹{remainingAmount.toFixed(2)}
                      </td>
                      <td>
                        <button className="btn btn-outline-primary btn-sm" onClick={() => generatePDF(file)}>
                          Details
                        </button>
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${remainingAmount === 0 ? "btn-success" : "btn-primary"}`}
                          onClick={() => handleApproval(file.order._id)}
                        >
                          {remainingAmount === 0 ? "Approved" : "Approve Payment"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-warning text-center my-5">No payment details available right now</div>
        )}
      </div>
    </>
  );



}

export default AdminPayment;

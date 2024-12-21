import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Adminnav from './Adminnav';
import './Adminshipping.css';

function AdminPayment() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState({});

  // Fetch payment files from the backend
  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/payment/getallfiles`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment data');
      }

      const data = await response.json();

      if (data.message === 'Files fetched successfully') {
        setFiles(data.data);

        // Initialize approval notes
        const initialNotes = data.data.reduce((acc, file) => {
          acc[file.order._id] = {
            notes: '',
            paid: file.totalPaid || 0, // Use total paid from backend
            additionalPaid: 0, // Placeholder for new input value
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

  // Approve payment
  const handleApproval = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const { notes, paid, additionalPaid } = approvalNotes[orderId] || {};
      const updatedPaid = parseFloat(paid || 0) + parseFloat(additionalPaid || 0);
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/payment/approve/${orderId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvalNotes: notes,
          paid: updatedPaid,
        }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('API Error:', errorResponse);
        throw new Error(errorResponse.message || 'Unknown error occurred');
      }
  
      const data = await response.json();
      alert(data.message);
      fetchFiles();
      setApprovalNotes((prev) => ({
        ...prev,
        [orderId]: { notes: '', paid: updatedPaid, additionalPaid: 0 },
      }));
    } catch (err) {
      alert('Error: ' + err.message);
      console.error('Approval Error:', err);
    }
  };
  
  // Download a file
  const handleDownload = async (fileId, fileName) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No authentication token found');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/payment/getpayment/${fileId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch the file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download the file');
    }
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
                <th>User Name</th>
                <th>User Email</th>
                <th>Order ID</th>
                <th>Files</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Approval Notes</th>
                <th>Approval Date</th>
                <th>Paid Amount</th>
                <th>Additional Paid</th>
                <th>Remaining Amount</th>
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
                    <td>{file.user?.name || 'N/A'}</td>
                    <td>{file.user?.email || 'N/A'}</td>
                    <td>{file.order._id}</td>
                    <td>
                      {file.files.map((f) => (
                        <button
                          key={f._id}
                          className="btn btn-link p-0"
                          onClick={() => handleDownload(f._id, f.fileName)}
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
                    <td>
                      <textarea
                        className="form-control"
                        value={approvalNotes[file.order._id]?.notes || ''}
                        onChange={(e) =>
                          setApprovalNotes((prev) => ({
                            ...prev,
                            [file.order._id]: {
                              ...prev[file.order._id],
                              notes: e.target.value,
                            },
                          }))
                        }
                        placeholder="Enter approval notes"
                      />
                    </td>
                    <td>{file.approval?.approvalDate || 'N/A'}</td>
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
                        placeholder="Enter additional paid amount"
                      />
                    </td>
                    <td>₹{remainingAmount.toFixed(2)}</td>
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

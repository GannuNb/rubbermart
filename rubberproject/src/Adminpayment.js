import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminPayment() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState({});

  // Fetch the files
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

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleApproval = async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      const notes = approvalNotes[paymentId] || '';

      const response = await fetch(`${process.env.REACT_APP_API_URL}/payment/approve/${paymentId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvalNotes: notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve payment');
      }

      const data = await response.json();
      alert(data.message); // Show success message

      // Re-fetch the files to update the UI with the approved details
      fetchFiles();

      // Reset approval notes for the payment ID
      setApprovalNotes((prev) => ({ ...prev, [paymentId]: '' }));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

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
      link.download = fileName; // Use the original file name for downloading
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
    <div className='setter'>
      <div className="container mt-5">
        <h2 className="text-center mb-4">All Uploaded Payment Proofs</h2>

        {/* Scrollable Table Container */}
        <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>User Name</th>
                <th>User Email</th>
                <th>Order ID</th>
                <th>File</th> {/* File column */}
                <th>Products</th>
                <th>Approval Notes</th>
                <th>Status</th> {/* Status column for Approve button */}
                <th>Approval Details</th> {/* New column for approval details */}
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file._id}>
                  <td>{file.user?.name || 'N/A'}</td>
                  <td>{file.user?.email || 'N/A'}</td>
                  <td>{file.order._id}</td>
                  <td>
                    {/* Click to trigger the download */}
                    <button
                      className="btn btn-link p-0"
                      onClick={() => handleDownload(file._id, file.fileName)}
                    >
                      {file.fileName}
                    </button>
                  </td>
                  <td>
                    {file.order.items.map((item, index) => (
                      <div key={index} className="mb-2">
                        <p className="mb-1">
                          <strong>Name:</strong> {item.name}
                        </p>
                        <p className="mb-1">
                          <strong>Quantity:</strong> {item.quantity}
                        </p>
                        <p className="mb-1">
                          <strong>Total Price:</strong> ₹{item.total}
                        </p>
                        <hr />
                      </div>
                    ))}
                  </td>
                  <td>
                    <textarea
                      className="form-control mb-2"
                      rows="3"
                      value={approvalNotes[file._id] || ''}
                      onChange={(e) =>
                        setApprovalNotes((prev) => ({
                          ...prev,
                          [file._id]: e.target.value,
                        }))
                      }
                      placeholder="Enter approval notes"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleApproval(file._id)}
                    >
                      Approve
                    </button>
                  </td>
                  <td>
                    {/* Display approval details if available */}
                    {file.approval && (
                      <div>
                        <p><strong>Status:</strong> {file.approval.approved ? 'Approved' : 'Not Approved'}</p>
                        <p><strong>Approval Notes:</strong> {file.approval.approvalNotes || 'N/A'}</p>
                        <p><strong>Approval Date:</strong> {new Date(file.approval.approvalDate).toLocaleString()}</p>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPayment;

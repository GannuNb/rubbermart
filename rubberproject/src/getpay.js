import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo1 from './images/logo.png';
import { useNavigate,useLocation } from 'react-router-dom';

function GetPay() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
    const location = useLocation(); // Get current route location

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
            alertMessage.textContent = 'Please log in for payment history.';
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

  const handleDownload = (fileId, fileName) => {
    const token = localStorage.getItem('token');

    fetch(`${process.env.REACT_APP_API_URL}/payment/getpayment/${fileId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch the file');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  if (loading) {
    return (
      <div className="setter">
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center my-5">{error}</div>;
  }

  // Group files by Order ID
  const groupedFiles = files.reduce((acc, file) => {
    const orderId = file.order._id;
    if (!acc[orderId]) {
      acc[orderId] = { order: file.order, files: [] };
    }
    acc[orderId].files.push(file);
    return acc;
  }, {});

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
                <th>Name</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedFiles).map(([orderId, { order, files }]) => (
                <tr key={orderId}>
                  <td>{orderId}</td>
                  <td>
                    {files.map((file, index) => (
                      <div key={index}>{file.fileName}</div>
                    ))}
                  </td>
                  <td>
                    {order.items.map((item, index) => (
                      <div key={index}>{item.name}</div>
                    ))}
                  </td>
                  <td>
                    {order.items.map((item, index) => (
                      <div key={index}>{item.quantity}</div>
                    ))}
                  </td>
                  <td>
                    {order.items.map((item, index) => (
                      <div key={index}>₹{item.total}</div>
                    ))}
                  </td>
                  <td>
                    {files.map((file, index) => (
                      <button
                        key={index}
                        className="btn btn-primary btn-sm mb-2 mx-3"
                        onClick={() => handleDownload(file._id, file.fileName)}
                      >
                        {file.fileName}
                      </button>
                    ))}
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

export default GetPay;

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function GetPay() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <><div className='setter'>
    <div className="container mt-5">
      <h2 className="text-center mb-4">Uploaded Payment Proof</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>File Name</th>
            <th>Products</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file._id}>
              <td>{file.order._id}</td>
              <td>{file.fileName}</td>
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
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleDownload(file._id, file.fileName)}
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div></>
  );
}

export default GetPay;

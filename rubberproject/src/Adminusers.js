import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Adminnav from './Adminnav';

const Adminusers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/allusers`);
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching all users data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (users.length === 0) return <div>No users found.</div>;

  // Function to open files in a new tab
  const openFileInNewTab = (fileData, fileType) => {
    const base64Data = `data:${fileType};base64,${fileData}`;
    const newTab = window.open();
    newTab.document.write(`<iframe src="${base64Data}" width="100%" height="100%" frameborder="0"></iframe>`);
    newTab.document.close();
  };

  return (
    <>
      <Adminnav />
      <div className="container mt-5">
        <div className="card shadow-lg">
          <div className="card-header bg-primary text-white text-center">
            <h3 style={{ fontSize: '1.5rem' }}>All Users</h3>
          </div>
          <div className="card-body">
            <div className="d-flex flex-wrap justify-content-between">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="card mb-3"
                  style={{
                    width: '30%',
                    marginBottom: '20px',
                    fontSize: '0.9rem',
                    padding: '10px',
                  }}
                >
                  <div className="row g-0">
                    <div className="col-md-8">
                      <div className="card-body" style={{ padding: '10px' }}>
                        <h5 className="card-title" style={{ fontSize: '1rem' }}>
                          <strong>Name:</strong> {user.name}
                        </h5>
                        <p className="card-text" style={{ fontSize: '0.875rem' }}>
                          <strong>Email:</strong> {user.email}
                        </p>
                        <p className="card-text" style={{ fontSize: '0.875rem' }}>
                          <strong>Location:</strong> {user.location || 'N/A'}
                        </p>

                        {/* Display Business Profile Details */}
                        {user.businessProfiles && user.businessProfiles.length > 0 ? (
                          <div className="mt-2" style={{ fontSize: '0.85rem' }}>
                            <h6 className="text-primary">Business Profiles</h6>
                            {user.businessProfiles.map((profile, idx) => (
                              <div
                                key={idx}
                                className="border rounded p-2 mb-2 bg-light"
                              >
                                <p style={{ fontSize: '0.85rem' }}>
                                  <strong>Company Name:</strong> {profile.companyName}
                                </p>
                                <p style={{ fontSize: '0.85rem' }}>
                                  <strong>Phone Number:</strong> {profile.phoneNumber}
                                </p>
                                <p style={{ fontSize: '0.85rem' }}>
                                  <strong>Company Email:</strong> {profile.email}
                                </p>
                                <p style={{ fontSize: '0.85rem' }}>
                                  <strong>GST Number:</strong> {profile.gstNumber}
                                </p>
                                <p style={{ fontSize: '0.85rem' }}>
                                  <strong>Billing Address:</strong> {profile.billAddress}
                                </p>
                                <p style={{ fontSize: '0.85rem' }}>
                                  <strong>Shipping Address:</strong> {profile.shipAddress}
                                </p>

                                {/* Handle and Open GST Certificate (PDF or other files) */}
                                {profile.gstCertificate && profile.gstCertificate.file && (
                                  <div>
                                    <h6 className="text-primary">GST Certificate</h6>
                                    <button
                                      onClick={() =>
                                        openFileInNewTab(profile.gstCertificate.file, profile.gstCertificate.fileType)
                                      }
                                    >
                                      Open GST Certificate
                                    </button>
                                  </div>
                                )}

                                {/* Handle and Open PAN Certificate (PDF or other files) */}
                                {profile.panCertificate && profile.panCertificate.file && (
                                  <div>
                                    <h6 className="text-primary">PAN Certificate</h6>
                                    <button
                                      onClick={() =>
                                        openFileInNewTab(profile.panCertificate.file, profile.panCertificate.fileType)
                                      }
                                    >
                                      Open PAN Certificate
                                    </button>
                                  </div>
                                )}

                                {/* Handle and Open Profile Image */}
                                {profile.profileImage && profile.profileImage.file && (
                                  <div>
                                    <h6 className="text-primary">Profile Image</h6>
                                    <button
                                      onClick={() =>
                                        openFileInNewTab(profile.profileImage.file, profile.profileImage.fileType)
                                      }
                                    >
                                      Open Profile Image
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                            No business profiles available.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Adminusers;

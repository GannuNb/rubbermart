import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Adminnav from './Adminnav';

const Adminusers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null); // State to track the selected user for business profile

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/allusers`);
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (users.length === 0) return <div>No users found.</div>;

  // Search filter (by name or company name)
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.businessProfiles?.some(profile =>
      profile.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Function to open files in a new tab
  const openFileInNewTab = (fileData, fileType) => {
    const base64Data = `data:${fileType};base64,${fileData}`;
    const newTab = window.open();
    newTab.document.write(`<iframe src="${base64Data}" width="100%" height="100%" frameborder="0"></iframe>`);
    newTab.document.close();
  };

  // Function to toggle the visibility of the business profile
  const handleToggleBusinessProfile = (index) => {
    if (selectedUserIndex === index) {
      setSelectedUserIndex(null); // Toggle off if the same user is clicked
    } else {
      setSelectedUserIndex(index); // Set the selected user index
    }
  };

  return (
    <>
      <Adminnav />
      <div className="container-fluid mt-4">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="m-0">All Users</h5>
            <input
              type="text"
              placeholder="Search by Name or Company"
              className="form-control w-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="card-body">
            <div className="row">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <div key={index} className="col-md-4 mb-3"> {/* Changed to col-md-4 to fit 3 per row */}
                    <div className="card p-3 shadow-sm">
                      <h6 className="text-primary mb-1">{user.name}</h6>
                      <p className="text-muted mb-1"><strong>Email:</strong> {user.email}</p>
                      <p className="text-muted mb-2"><strong>Location:</strong> {user.location || 'N/A'}</p>
  
                      {/* Button to toggle Business Profile visibility */}
                      {user.businessProfiles?.length > 0 && (
                        <button
                          className="btn btn-info btn-sm mb-2"
                          onClick={() => handleToggleBusinessProfile(index)}
                        >
                          {selectedUserIndex === index ? 'Hide Business Profile' : 'View Business Profile Details'}
                        </button>
                      )}
  
                      {/* Business Profile */}
                      {selectedUserIndex === index && user.businessProfiles?.length > 0 && (
                        <div className="border rounded p-2 bg-light">
                          <h6 className="text-success">Business Profile</h6>
                          {user.businessProfiles.map((profile, idx) => (
                            <div key={idx} className="p-2 bg-white rounded shadow-sm">
                              <table className="table table-borderless mb-2">
                                <tbody>
                                  <tr><td><strong>Company:</strong></td><td>{profile.companyName}</td></tr>
                                  <tr><td><strong>Phone:</strong></td><td>{profile.phoneNumber}</td></tr>
                                  <tr><td><strong>Email:</strong></td><td>{profile.email}</td></tr>
                                  <tr><td><strong>GST No:</strong></td><td>{profile.gstNumber}</td></tr>
                                  <tr><td><strong>Billing Address:</strong></td><td>{profile.billAddress}</td></tr>
                                  <tr><td><strong>Shipping Address:</strong></td><td>{profile.shipAddress}</td></tr>
                                </tbody>
                              </table>
  
                              {/* GST & PAN Certificates */}
                              <div className="d-flex gap-3 mt-2">
                                {profile.gstCertificate?.file && (
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() =>
                                      openFileInNewTab(profile.gstCertificate.file, profile.gstCertificate.fileType)
                                    }
                                  >
                                    View GST Certificate
                                  </button>
                                )}
                                {profile.panCertificate?.file && (
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() =>
                                      openFileInNewTab(profile.panCertificate.file, profile.panCertificate.fileType)
                                    }
                                  >
                                    View PAN Certificate
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center w-100">No matching users found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Adminusers;

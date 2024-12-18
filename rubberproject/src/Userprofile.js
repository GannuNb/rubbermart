import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/userdetails`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setBusinessProfiles(response.data.businessProfiles); // Set business profiles
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data found.</div>;

  return (
    <><div  className='setter'>
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h3>User Profile</h3>
        </div>
        <div className="card-body">
          <h5>Name: {user.name}</h5>
          <h5>Email: {user.email}</h5>
          <h5>Location: {user.location || 'N/A'}</h5>

          {/* Display Business Profile Details */}
          {businessProfiles.length > 0 ? (
            <div className="mt-4">
              <h4 className="text-primary">Business Profiles</h4>
              {businessProfiles.map((profile, index) => (
                <div key={index} className="border rounded p-3 mb-3 bg-light">
                  <h5><strong>Company Name:</strong> {profile.companyName}</h5>
                  <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
                  <p><strong>Company Email:</strong> {profile.email}</p>
                  <p><strong>GST Number:</strong> {profile.gstNumber}</p>
                  <p><strong>Billing Address:</strong> {profile.billAddress}</p>
                  <p><strong>Shipping Address:</strong> {profile.shipAddress}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No business profiles available.</p>
          )}
        </div>
      </div>
    </div>
    </div></>
  );
};

export default UserProfile;

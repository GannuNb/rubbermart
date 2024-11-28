import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Userprofile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);


  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data found.</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h3>User Profile</h3>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <h5><strong>Name:</strong> {user.name}</h5>
            </div>
            <div className="col-md-6">
              <h5><strong>Email:</strong> {user.email}</h5>
            </div>
            <div className="col-md-6">
              <h5><strong>Location:</strong> {user.location || 'N/A'}</h5>
            </div>
          </div>
          
          {user.businessProfiles && user.businessProfiles.length > 0 ? (
            <div>
              <h4 className="text-primary mb-3">Business Profiles</h4>
              {user.businessProfiles.map((profile, index) => (
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
  );
};

export default Userprofile;

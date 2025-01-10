import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios'; // Make sure to import axios
import logo1 from './images/logo.png';


const BusinessProfile = () => {
  const [profile, setProfile] = useState({
    registeredgst:"no",
    companyName: "",
    phoneNumber: "",
    email: "",
    address: "",
    gstNumber: "",
    pan:"",
    billAddress: "",  
    shipAddress: ""
  });
  
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
            alertMessage.textContent = 'Please log in to View Bussiness Profile.';
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
    window.scrollTo(0, 0);
}, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/business-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.profileExists) {
          setProfile(response.data.businessProfile);
          setProfileExists(true);
        } else {
          setProfileExists(false);
        }
      } catch (error) {
        console.error("Error fetching business profile:", error);
        setProfileExists(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/business-profile`, profile, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.success) {
            alert('Business Profile Created Successfully');
            setProfileExists(true);
            navigate('/');
        } else {
            alert(`Failed to create business profile: ${response.data.message}`);
        }
    } catch (error) {
        console.error('Error creating business profile:', error);
        const message = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : error.message;
        alert(`Error creating business profile: ${message}`);
    }
};

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (profileExists) {
    return (
      <>
        <div className="setter">
          <div className="container">
            <div className="business-profile-container">
              <h2 className="text-center mb-4  tyre-scrap-heading mr-5 ">Your Business Profile</h2>
              <div className="row">
                <div className="col-12 col-md-6 mb-3 text-black">
                  <p><strong>Company Name:</strong> {profile.companyName}</p>
                </div>
                <div className="col-12 col-md-6 mb-3 text-black">
                  <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
                </div>
                <div className="col-12 col-md-6 mb-3 text-black">
                  <p><strong>Email:</strong> {profile.email}</p>
                </div>
                <div className="col-12 col-md-6 mb-3 text-black">
                  <p><strong>GST Number:</strong> {profile.gstNumber}</p>
                </div>
                <div className="col-12 col-md-6 mb-3 text-black">
                  <p><strong>PAN:</strong> {profile.pan}</p>
                </div>
                <div className="col-12 col-md-6 mb-3 text-black">
                  <p><strong>Bill to Address:</strong> {profile.billAddress}</p>
                </div>
                <div className="col-12 col-md-6 mb-3 text-black">
                  <p><strong>Ship to Address:</strong> {profile.shipAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  

  return (
    <>
    <div className='setterbus'>
    <div className="container mt-5 "> 
      <form onSubmit={handleSubmit} className="border p-4 rounded bg-light shadow-lg">
        <h2 className="text-center mb-4">Create Business Profile</h2>

        <div className="row mb-3">
          <div className="col-sm-6">
            <label htmlFor="companyName" className="form-label">Company Name</label>
            <input
              type="text"
              className="form-control"
              id="companyName"
              name="companyName"
              value={profile.companyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-sm-6">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              id="phoneNumber"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-6">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-sm-6">
            <label htmlFor="gstNumber" className="form-label">GST Number</label>
            <input
              type="text"
              className="form-control"
              id="gstNumber"
              name="gstNumber"
              value={profile.gstNumber}
              onChange={handleChange}
              required
            />
          </div>
          </div>
          <div className="col-sm-6">
    <label htmlFor="pan" className="form-label">PAN</label>
    <input
      type="text"
      className="form-control"
      id="pan"
      name="pan"
      value={profile.pan}
      onChange={handleChange}
      required
    />
  </div>
        
   


        <div className="row mb-3">
          <div className="col-sm-6">
            <label htmlFor="billAddress" className="form-label">Bill to Address</label>
            <textarea
              className="form-control"
              id="billAddress"
              name="billAddress"
              value={profile.billAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-sm-6">
            <label htmlFor="shipAddress" className="form-label">Ship to Address</label>
            <textarea
              className="form-control"
              id="shipAddress"
              name="shipAddress"
              value={profile.shipAddress}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-gradient text-black w-100 mt-3">Create Profile</button>
      </form>
    </div>
    </div>
    </>
  );
}


export default BusinessProfile;

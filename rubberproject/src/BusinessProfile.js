import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Make sure to import axios
import logo1 from './images/logo.png';

const BusinessProfile = () => {
  const [profile, setProfile] = useState({
    registeredgst: "no",
    companyName: "",
    phoneNumber: "",
    email: "",
    address: "",
    gstNumber: "",
    pan: "",
    billAddress: "",
    shipAddress: ""
  });

  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSameAsBilling, setIsSameAsBilling] = useState(false);

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
        setProfile({ ...profile, email: response.data.user.email }); // Set email in profile state
       
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  

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
  }, [navigate, location]);

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

  // Function to display styled alerts
  const displayAlert = (message, type) => {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
      alertContainer.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert" style="display: flex; align-items: center; padding: 20px;">
          <img src="${logo1}" alt="Logo" style="width: 50px; margin-right: 10px;">
          <span>${message}</span>
      </div>
      `;
      setTimeout(() => {
        alertContainer.innerHTML = ''; // Clear the alert after 5 seconds
      }, 5000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated. Please log in.');
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/business-profile`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        displayAlert('ThankYou for Creating Bussiness Profile , WELCOME ONBOARD!', 'success');
        setProfileExists(true);
        navigate('/');
      } else {
        displayAlert(`Failed to create business profile: ${response.data.message}`, 'danger');
      }
    } catch (error) {
      console.error('Error creating business profile:', error);
      const message = error.response?.data?.message || error.message;
      displayAlert(`Error creating business profile: ${message}`, 'danger');
    }
  };

  const handleCheckboxChange = () => {
    setIsSameAsBilling((prevState) => {
      const newState = !prevState;
      if (newState) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          shipAddress: prevProfile.billAddress, // Copy bill address to ship address when checked
        }));
      } else {
        setProfile((prevProfile) => ({
          ...prevProfile,
          shipAddress: '', // Clear ship address if unchecked
        }));
      }
      return newState;
    });
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (profileExists) {
    return (
      <>
        <div className="setter">
          <div className="container mx-3">
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
      <div className="setterbus">
        <div className="container mt-5">
          <form onSubmit={handleSubmit} className="border p-5 rounded bg-white shadow-lg">
            <h2 className="text-center mb-4 text-primary">Create Business Profile</h2>
            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="companyName" className="form-label text-muted">Company Name</label>
                <input
                  type="text"
                  className="form-control shadow-sm"
                  id="companyName"
                  name="companyName"
                  value={profile.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="phoneNumber" className="form-label text-muted">Phone Number</label>
                <input
                  type="tel"
                  className="form-control shadow-sm"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="email" className="form-label text-muted">Email</label>
                <input
                  type="email"
                  className="form-control shadow-sm"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="gstNumber" className="form-label text-muted">GST Number</label>
                <input
                  type="text"
                  className="form-control shadow-sm"
                  id="gstNumber"
                  name="gstNumber"
                  value={profile.gstNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="pan" className="form-label text-muted">PAN</label>
                <input
                  type="text"
                  className="form-control shadow-sm"
                  id="pan"
                  name="pan"
                  value={profile.pan}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="billAddress" className="form-label text-muted">Bill to Address</label>
                <textarea
                  className="form-control shadow-sm"
                  id="billAddress"
                  name="billAddress"
                  value={profile.billAddress}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>
              <div className="col-md-6" style={{ marginTop: '-3.5%' }}>
                <h5 className="mb-2">Shipping Details</h5> {/* Reduced margin-bottom */}
                <div className="form-group mt-2"> {/* Reduced top margin */}
                  {/* Checkbox Section */}
                  <div className="d-flex align-items-center mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      id="sameAsBilling"
                      checked={isSameAsBilling}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="sameAsBilling" className="form-check-label text-muted">
                      Same as Billing Address
                    </label>
                  </div>

                  {/* Shipping Address Section */}
                  <textarea
                    className="form-control mt-2"
                    id="shipAddress"
                    name="shipAddress"
                    placeholder="Enter Shipping Address"
                    value={profile.shipAddress}
                    onChange={handleChange}
                    rows="4"
                    disabled={isSameAsBilling} // Disable textarea when 'Same as Billing' is checked
                    required
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-4 py-2 fs-5 fw-bold">Create Profile</button>
          </form>
        </div>
      </div>
    </>
  );
}


export default BusinessProfile;

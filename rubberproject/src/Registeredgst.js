import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router-dom';
import './Bussinessprofile.css';
import './Sell.css';



function Registeredgst() {

    const [gstNumber, setGstNumber] = useState(''); // State to hold GST number
  const [gstDetails, setGstDetails] = useState(null); // State to hold the fetched GST details
  const [error, setError] = useState(null); // State to manage errors
  const [pan, setPan] = useState(''); // State to hold extracted PAN

  const [profile, setProfile] = useState({
    registeredgst:"yes",
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
            alert("Please log in to create or view business profile.");
            navigate('/Login', { state: { from: location.pathname } }); // Navigate to login if no token
        }, 0);
        return;
    }
  }, [navigate,location]);


  const extractPanFromGst = (gstin) => {
    // Extract the PAN by removing the first two and last three characters from the GSTIN
    if (gstin && gstin.length === 15) {
      return gstin.slice(2, 12); // Extract characters from index 2 to 12 (10 characters for PAN)
    }
    return '';
  };

  const handleGstNumberChange = (event) => {
    setGstNumber(event.target.value); // Update the gstNumber as user types
  };

  const fetchGstDetails = async () => {
    if (!gstNumber) {
      alert('Please enter a GST number!');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(
        'https://gst-verification.p.rapidapi.com/v3/tasks/sync/verify_with_source/ind_gst_certificate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'gst-verification.p.rapidapi.com',
            'x-rapidapi-key': '80325c5c56msh8d18cbdb2bdf05fp1ade17jsnd91c656e77d2',
          },
          body: JSON.stringify({
            task_id: '74f4c926-250c-43ca-9c53-453e87ceacd1',
            group_id: '8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e',
            data: {
              gstin: gstNumber,
            },
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to fetch GST details');
      }
  
      const data = await response.json();
      setGstDetails(data.result.source_output);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gstDetails) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        companyName: gstDetails.trade_name || '',
        phoneNumber: '', // Add a default value or fetch if available from API
        email: '', // Add a default value or fetch if available from API
        gstNumber: gstDetails.gstin || '',
        pan: extractPanFromGst(gstDetails.gstin) || '',
        billAddress: `${gstDetails.principal_place_of_business_fields.principal_place_of_business_address.door_number}, ${gstDetails.principal_place_of_business_fields.principal_place_of_business_address.city}, ${gstDetails.principal_place_of_business_fields.principal_place_of_business_address.state_name}, ${gstDetails.principal_place_of_business_fields.principal_place_of_business_address.pincode}` || '',
        shipAddress: '', // If ship address differs and is fetched, populate here
      }));
    }
  }, [gstDetails]);
  

  
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
                  <p><strong>Pan:</strong> {profile.pan}</p>
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
        <div className="text-left mx-5 mb-4">
          <h1>GST Details</h1>
          <p>Enter a GST number to fetch details</p>
        </div>

        <div className="d-flex justify-content-center">
          <div className="input-group w-80 mx-3">
            <input
              type="text"
              className="form-control"
              value={gstNumber}
              onChange={handleGstNumberChange}
              placeholder="Enter GST Number"
            />
            <div className="input-group-append">
              <button
                onClick={fetchGstDetails}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Fetching...' : 'Get GST Details'}
              </button>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger mt-4">{error}</div>}


      </div>
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
      readOnly 
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
      readOnly // Makes the field non-editable
    />
  </div>
        </div>

        <div className="row mb-3">
        <div className="col-sm-6">
    <label htmlFor="pan" className="form-label">PAN</label>
    <input
      type="text"
      className="form-control"
      id="pan"
      name="pan"
      value={profile.pan}
      readOnly // Makes the field non-editable
    />
  </div>

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

export default Registeredgst;

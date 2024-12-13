import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to import axios

const BusinessProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/business-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Check if the profile exists and set it
        if (response.data.profileExists) {
          setProfile(response.data.businessProfile);
        } else {
          setProfile(null); // No profile found, show buttons
        }
      } catch (error) {
        console.error("Error fetching business profile:", error);
        setProfile(null); // No profile found, show buttons
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile !== null) {
      // Check if 'registeredgst' is 'yes' or 'no'
      if (profile.registeredgst === 'yes') {
        // Redirect to registered page if 'registeredgst' is 'yes'
        navigate('/registered');
      } else if (profile.registeredgst === 'no') {
        // Redirect to unregistered page if 'registeredgst' is 'no'
        navigate('/unregistered');
      }
    }
  }, [profile, navigate]);

  const handleRegisteredGSTClick = () => {
    // Handle registered GST button click
    // You can navigate to a registration page or show a form
    navigate('/registered');
  };

  const handleUnregisteredGSTClick = () => {
    // Handle unregistered GST button click
    // Navigate to the unregistered page or show a form
    navigate('/unregistered');
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while fetching the profile
  }


  return (
    <>
    <div className='setter'>
    
    <div className="container mt-5">
      {profile === null ? (
        // If no profile exists, show buttons
        <div className="text-center">
          <h4 style={{marginTop: "10% "}} className="mb-4 tyre-scrap-heading animated-heading ">
  Create your business profile with
</h4>

          <div className="d-flex justify-content-center gap-3">
            <button onClick={handleRegisteredGSTClick} className="btn btn-success btn-lg">
              Registered GST
            </button>
            <button onClick={handleUnregisteredGSTClick} className="btn btn-danger btn-lg">
              Unregistered GST
            </button>
          </div>
        </div>
      ) : (
        // If profile exists, handle the redirect logic
        <div className="text-center">
          <h4 className="mb-4">Loading Your Profile...</h4>
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
    </div>
    </>
  );
  
};

export default BusinessProfile;

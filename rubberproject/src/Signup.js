import React, { useState,useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css'; // Import the CSS file

export default function Signup() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    geolocation: ""
  });
  
  useEffect(() => {
      // Directly set the scroll position to the top of the page
      document.documentElement.scrollTop = 0; 
      document.body.scrollTop = 0;  // For compatibility with older browsers
    }, []); // Empty dependency array ensures it runs only once on page load


  const [showPassword, setShowPassword] = useState(false);

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (credentials.password !== credentials.confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/createuser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: credentials.name,
            email: credentials.email.toLowerCase(), // Normalize to lowercase
            password: credentials.password,
            location: credentials.geolocation
        })
    });

    const json = await response.json();
    console.log(json);

    if (json.success) {
        navigate("/login");
    } else {
        alert("Please youse correct credentials to signup");
    }
};


  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-container">
      <div className="form-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2 className="form-heading">Create Account</h2>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              name="name" 
              value={credentials.name} 
              onChange={onChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input 
              type="email" 
              name="email" 
              value={credentials.email} 
              onChange={onChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="geolocation">Location (optional)</label>
            <input 
              type="text" 
              name="geolocation" 
              value={credentials.geolocation} 
              onChange={onChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={credentials.password} 
                onChange={onChange} 
                required 
              />
              <button type="button" onClick={togglePasswordVisibility}>
                {showPassword ? "🙉" : "🙈"}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="confirmPassword" 
                value={credentials.confirmPassword} 
                onChange={onChange} 
                required 
              />
              <button type="button" onClick={togglePasswordVisibility}>
                {showPassword ? "🙉" : "🙈"}
              </button>
            </div>
          </div>
          <div className="button-group">
            <button type="submit" className="btn-submit">Sign Up</button>
            <Link to="/login" className="btn-link">Already a user? Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

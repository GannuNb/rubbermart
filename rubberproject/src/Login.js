import React, { useEffect,useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });
  
      if (!response.ok) throw new Error("Network response was not ok");
  
      const json = await response.json();
  
      if (json.success) {
        localStorage.setItem('userEmail', credentials.email);
        localStorage.setItem('token', json.authToken);
  
        // Check if the user has a business profile
        const profileResponse = await fetch(`${process.env.REACT_APP_API_URL}/business-profile`, {
          headers: { Authorization: `Bearer ${json.authToken}` },
        });
  
        const profileData = await profileResponse.json();
        const hasBusinessProfile = profileData.profileExists;
  
        navigate(hasBusinessProfile ? '/' : '/BusinessProfile'); // Redirect accordingly
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("An error occurred during login:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  


  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);

  return (

    <div className="signup-container">
    
      <div className='form-container'>
        <form className='signup-form' onSubmit={handleSubmit}>
        <h2 className="form-heading">Login</h2>
          <div className="m-3">
            <label htmlFor="exampleInputEmail1" className="form-label text-white">Email address</label>
            <input 
              type="email" 
              className="form-control" 
              name='email' 
              value={credentials.email} 
              onChange={onChange} 
              aria-describedby="emailHelp" 
              required 
            />
         

          </div>

          <div className="m-3">
            <label htmlFor="password" className="form-label text-white">Password</label>
            <div className="input-group">
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control" 
                name="password" 
                value={credentials.password} 
                onChange={onChange} 
                required
              />
              <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer',marginTop:'1.2%' }}>
                {showPassword ? "🙉" : "🙈"} {/* Monkey emojis for toggling */}
              </span>
            </div>
          </div>

          {error && <div className="m-3 text-danger">{error}</div>}

          <button 
            type="submit" 
            className="m-3 btn btn-success" 
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
          <Link to="/signup" className="m-3 mx-1 btn btn-danger">New User</Link>
          <div className="text-center">
  <Link to="/forgot-password" className="text-white">Forgot Password?</Link>
</div>

        </form>
      </div>
    </div>
  );
}
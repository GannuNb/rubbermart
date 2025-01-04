import React from 'react';
import logo1 from './images/logo.png'; // Update the path to your logo

function ForgetMailPass() {
    return (
        <><div className='setter'>
        <div className="container text-center my-5">
            <div className="card shadow-sm p-4 rounded">
                <img
                    src={logo1}
                    alt="Logo"
                    className="mb-4"
                    style={{ width: '100px' }}
                />
                <h2 className="mb-3 text-primary">Password Reset Email Sent!</h2>
                <p className="text-muted">
                    We've sent a password reset link to your registered email address. Please check your inbox (and spam folder) and follow the instructions to reset your password.
                </p>
                <p className="text-secondary">
                    If you didn’t receive the email, ensure you entered the correct address or try again later.
                </p>
                <a href="/login" className="btn btn-primary mt-3">
                    Back to Login
                </a>
            </div>
        </div>
        </div></>
    );
}

export default ForgetMailPass;

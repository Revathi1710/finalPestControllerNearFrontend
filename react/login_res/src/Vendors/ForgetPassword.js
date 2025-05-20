import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import forgotpassword from '../icons/forgotpassword.png';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password reset link has been sent to your email.');
      } else {
        toast.error(data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while sending the request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="container mt-4">
        <div className="row backgroundImagesignuppage">
          
          <div className="col-lg-6 d-lg-block text-center mt-5">
            <img src={forgotpassword} alt="Forgot Password" className="img-fluid" />
          </div>

          <div className="align-content-center align-items-center col-lg-6 col-md-12">
            <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
              <h3 className="mt-2 signup-title mb-4">Forget Password</h3>

              <div className="mb-3 input-group">
                <span className="input-group-text">
                  <i className="fa fa-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control signupinput"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn postbtn w-100 py-2 fs-5 rounded-pill">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;

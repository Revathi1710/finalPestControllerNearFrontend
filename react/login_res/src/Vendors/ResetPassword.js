import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import resetpass from '../icons/resetpass.png';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setMessage('Invalid or missing reset token');
        return;
      }
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify-token/${token}`);
        if (response.data.success) {
          setIsTokenValid(true);
        } else {
          setMessage('Invalid or expired reset token');
        }
      } catch (error) {
        setMessage('Invalid or expired reset token');
        console.error('Token verification error:', error);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password should be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/reset-password/${token}`, { password });
      setMessage(response.data.message);

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(response.data.message || 'Error resetting password');
      }
    } catch (error) {
      toast.error('Error resetting password. Please try again.');
      console.error('Reset password error:', error);
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
            <img src={resetpass} alt="Reset Password" className="img-fluid" />
          </div>

          <div className="col-lg-6 col-md-12 d-flex align-items-center justify-content-center">
            <div className="form-container loginform col-sm-8">

              {isTokenValid ? (
                <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
                  <h3 className="login-title text-center mt-2 mb-5">Reset Password</h3>

                  <div className="mb-3 input-group">
                    <span className="input-group-text">
                      <i className="fa fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      id="password"
                      className="form-control signupinput"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-3 input-group">
                    <span className="input-group-text">
                      <i className="fa fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control signupinput"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </div>

                  <button type="submit" className="btn btn-3d w-100" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              ) : (
                <p className="text-danger text-center">{message || 'Verifying token...'}</p>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
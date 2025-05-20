import React, { Component } from 'react';
import Navbar from '../components/navbar';
import leftsideimage from '../icons/leftsingup.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';



export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { email, password } = this.state;
  
    if (!email || !password) {
      toast.warning('Please enter both email and password.');
      return;
    }
  
    fetch(`${process.env.REACT_APP_API_URL}/Vendorlogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          const { vendortoken, vendorId } = data.data;
          toast.success('Login successful!');
          window.localStorage.setItem('vendortoken', vendortoken);
          window.localStorage.setItem('vendorId', vendorId);
          window.localStorage.setItem('loggedIn', true);
          setTimeout(() => {
            window.location.href = '/';
          }, 2000); // Delay for toast visibility
        } else {
          if (data.error === 'User not found') {
            toast.error("Account not found. Please sign up first.");
          } else if (data.error === 'Invalid password') {
            toast.error("Incorrect password. Please try again.");
          } else {
            toast.error("Login failed. Please check your credentials.");
          }
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        toast.error("Something went wrong. Please try again later.");
      });
  }
  

  render() {
  
    return (
      <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mt-4">
        <div className="row backgroundImagesignuppage">
          <div className="col-lg-6  d-lg-block text-center mt-5">
            <h4 className="signupheader mb-4">🦟 Welcome back! Log in to manage your pest control services.</h4>
          
            <img src={leftsideimage} alt="signup" className="img-fluid" />
          </div>

       

        <div className="col-lg-6 col-md-12 align-content-center">
         
              
              <form onSubmit={this.handleSubmit} className="p-4 shadow rounded bg-white">
              <h3 className='mt-2 signup-title mb-2'>Login</h3>
                <div className="mb-3 input-group">
                  <span className="input-group-text">
                    <i className="fa fa-user"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control signupinput"
                    placeholder="Enter email"
                    value={this.state.email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3 input-group">
                  <span className="input-group-text">
                    <i className="fa fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control signupinput"
                    placeholder="Enter password"
                    value={this.state.password}
                    onChange={(e) => this.setState({ password: e.target.value })}
                    required
                  />
                </div>
                <div className="text-end">
                  <Link to="/ForgetPassword">Forgot Password?</Link>
                </div>
                
                <div className="d-grid mt-3">
                <button type="submit" className="btn postbtn w-100 py-2 fs-5 rounded-pill">  Login</button>
              </div>
                <p className="text-center mt-3">
                Don't have an account? <Link to="/Signup">Create Account</Link>
              </p>
              </form>
             
            </div>
          </div>
        </div>
      </div>
    );
  }
}

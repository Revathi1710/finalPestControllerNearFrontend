import React, { useState } from 'react';
import Navbar from '../components/navbar';
import leftsideimage from '../icons/leftsingup.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
export default function SignUp() {
  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    pincode: "",
    sinceFrom: "",
    specialistIn: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    website: "",
    pesticideLicence: "",
    gstNumber: "",
    membership: "",
    branchDetails: "",
    technicalQualification: "",
    password: "",
    cpassword: "",
    declarationAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
  
    // Update form data first
    const updatedFormData = {
      ...formData,
      [name]: newValue,
    };
  
    setFormData(updatedFormData);
  
    // Start validation logic
    let error = "";
  
    switch (name) {
      case "businessName":
        if (!newValue.trim()) error = "Business name is required.";
        break;
  
      case "email":
        if (!newValue.trim()) error = "Email is required.";
        break;
  
      case "pincode":
        if (!/^\d{6}$/.test(newValue)) {
          error = "Pincode must be 6 digits.";
        }
        break;
  
      case "contactNumber":
        if (!/^\d{10}$/.test(newValue)) {
          error = "Contact number must be 10 digits.";
        }
        break;
  
      case "password":
      case "cpassword": {
        const password = name === "password" ? newValue : updatedFormData.password;
        const cpassword = name === "cpassword" ? newValue : updatedFormData.cpassword;
  
        if (!password || !cpassword) {
          error = "Password and Confirm Password are required.";
        } else if (password !== cpassword) {
          error = "Passwords do not match.";
        } else {
          error = "";
        }
  
        // Clear both errors
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: error,
          match: "",
        }));
        return; // prevent the default error setter below
      }
  
      case "declarationAccepted":
        if (!newValue) {
          error = "You must accept the declaration.";
        }
        break;
  
      default:
        break;
    }
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };
  

  const getCoordinatesFromPincode = async (pincode) => {
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      if (response.data.results?.length) {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      } else {
        throw new Error('Unable to geocode the provided pincode');
      }
    } catch (error) {
      console.error('Geocoding Error:', error);
      return null;
    }
  };

  const validate = () => {
    const newErrors = {};
    const {
      businessName,
      email,
      pincode,
      contactNumber,
      password,
      cpassword,
      declarationAccepted
    } = formData;

    if (!businessName.trim()) newErrors.businessName = "Business name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!/^\d{6}$/.test(pincode)) newErrors.pincode = "Pincode must be 6 digits.";
    if (!/^\d{10}$/.test(contactNumber)) newErrors.contactNumber = "Contact number must be 10 digits.";
    if (!password || !cpassword) newErrors.password = "Password and Confirm Password are required.";
    if (password !== cpassword) newErrors.match = "Passwords do not match.";
    if (!declarationAccepted) newErrors.declaration = "You must accept the declaration.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const coords = await getCoordinatesFromPincode(formData.pincode);
    if (!coords) {
      toast.error('Invalid  pincode');
      return;
    }

    const payload = {
      ...formData,
      latitude: coords.lat,
      longitude: coords.lng,
    };

    fetch(`${process.env.REACT_APP_API_URL}/VendorCreateAccount`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') {
          toast.success("Registration successful!");
          localStorage.setItem('vendorId', data.vendorId);
          localStorage.setItem('loggedIn', true);
          setTimeout(() => window.location.href = "/Vendorview", 2000);
        } else {
          toast.error("Registration failed: " + data.message);
        }
      })
      .catch(() => toast.error("Error occurred during registration"));
  };

  return (
      <div>
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="container mt-4">
          <div className="row backgroundImagesignuppage">
            <div className="col-lg-6  d-lg-block text-center mt-5">
              <h4 className="signupheader mb-4">🐜 Become a Verified Pest Control Partner</h4>
              <p className='text-left'>Join our network of trusted pest control professionals and grow your business with quality leads and easy job management.</p>
              <img src={leftsideimage} alt="signup" className="img-fluid" />
            </div>

         

          <div className="col-lg-6 col-md-12">
            <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
            <h3 className='mt-2 signup-title mb-2'>Provide Your Details to Register</h3>

              <div className="mb-3 input-group">
                <span className="input-group-text"><i className="fa fa-building" /></span>
                <input
                  name="businessName"
                  className="form-control"
                  placeholder="Business Name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3 input-group">
                <span className="input-group-text"><i className="fa fa-map-marker" /></span>
                <textarea
                  name="address"
                  className="form-control"
                  placeholder="Full Address "
                  onChange={handleChange}
                  required
                />
              </div>
             <div className='row'>
             <div className='col-sm-6'>
              <div className="mb-3 input-group ">
                <span className="input-group-text"><i className="	fa fa-location-arrow" /></span>
                <input
                  name="pincode"
                  className="form-control"
                  placeholder="Pincode
                  "
                  onChange={handleChange}
                  required
                />
                
              </div>   {errors.pincode && <div className="text-danger mb-2">{errors.pincode}</div>}
              
              </div>
              <div className='col-sm-6'>
              <div className="mb-3 input-group ">
                <span className="input-group-text"><i className="fa fa-calendar" /></span>
                <input
                  name="sinceFrom"
                  className="form-control"
                  placeholder="Since From (e.g., 2010)"
                  onChange={handleChange}
                />
              </div></div>
              <div className='col-sm-6'>
              <div className="mb-3 input-group">
                <span className="input-group-text"><i className="fa fa-star" /></span>
                <input
                  name="specialistIn"
                  className="form-control"
                  placeholder="Specialist In"
                  onChange={handleChange}
                />
              </div>  </div>
              <div className='col-sm-6'>
              <div className="mb-3 input-group">
                <span className="input-group-text"><i className="fa fa-user-circle" /></span>
                <input
                  name="contactPerson"
                  className="form-control"
                  placeholder="Contact Person"
                  onChange={handleChange}
                  required
                />
              </div>  </div>
              <div className='col-sm-6'>
              <div className="mb-3 input-group">
                <span className="input-group-text"><i className="fa fa-phone" /></span>
                <input
                  name="contactNumber"
                  className="form-control"
                  placeholder="Contact Number"
                  onChange={handleChange}
                  required
                />
                
               
              </div>  {errors.contactNumber && <div className="text-danger mb-2">{errors.contactNumber}</div>}
                </div>
              <div className='col-sm-6'>
              <div className="mb-3 input-group">
                <span className="input-group-text"><i className="fa fa-envelope-o" /></span>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Email Id"
                  onChange={handleChange}
                  required
                />
               
              </div> {errors.email && <div className="text-danger mb-2">{errors.email}</div>}
              
              
                </div>
              <div className='col-sm-6'>
              <div className="mb-3 input-group">
                <span className="input-group-text"><i className="fa fa-globe" /></span>
                <input
                  name="website"
                  className="form-control"
                  placeholder="Website"
                  onChange={handleChange}
                />
              </div>  </div>
              <div className='col-sm-6'>
              <div className="mb-3 input-group">
                <span className="input-group-text"><i className="fa fa-id-card" /></span>
                <input
                  name="pesticideLicence"
                  className="form-control"
                  placeholder="Licence Number"
                  onChange={handleChange}
                />
              </div>  </div>
              <div className='col-sm-6'>
              <div className="mb-3 input-group">
                <span className="input-group-text"><i className="fa fa-file-invoice" /></span>
                <input
                  name="gstNumber"
                  className="form-control"
                  placeholder="GST Number"
                  onChange={handleChange}
                />
              </div></div>
              <div className='col-sm-6'>
              <div className="mb-3 input-group">
                <span className="input-group-text"><i className="fa fa-users" /></span>
                <input
                  name="membership"
                  className="form-control"
                  placeholder="Membership of Association"
                  onChange={handleChange}
                />
              </div></div>
              <div className='col-sm-6'>
              <div className="mb-3 input-group">
                <span className="input-group-text"><i className="fa fa-map" /></span>
                <input
                  name="branchDetails"
                  className="form-control"
                  placeholder="Branch Details"
                  onChange={handleChange}
                />
              </div></div>
              <div className='col-sm-6'>
              <div className="mb-3 input-group">
                <span className="input-group-text"><i className="fa fa-graduation-cap"></i></span>
                <input
                  name="technicalQualification"
                  className="form-control"
                  placeholder="Technical Qualification"
                  onChange={handleChange}
                />
              </div></div>
              <div className='col-sm-6'>
        <div className="mb-3 input-group">
          <span className="input-group-text"><i className="fa fa-lock" /></span>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            className="form-control"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className='col-sm-6'>
        <div className="mb-3 input-group">
          <span className="input-group-text"><i className="fa fa-lock" /></span>
          <input
            type={showCPassword ? 'text' : 'password'}
            name="cpassword"
            className="form-control"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />
          <span className="input-group-text" onClick={() => setShowCPassword(!showCPassword)} style={{ cursor: 'pointer' }}>
            {showCPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

       
      </div>
      {(errors.password || errors.match) && (
          <div className="text-danger mb-2">
            {errors.password || errors.match}
          </div>
        )}
      </div>
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" name="declarationAccepted" checked={formData.declarationAccepted} onChange={handleChange} />
                <label className="form-check-label"> I hereby declare that the information provided is true.</label>
              </div>
              {errors.declaration && <div className="text-danger mb-2">{errors.declaration}</div>}
              <div className="d-grid mt-3">
                <button type="submit" className="btn postbtn w-100 py-2 fs-5 rounded-pill">Create Account</button>
              </div>

              <p className="text-center mt-3">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


             
   

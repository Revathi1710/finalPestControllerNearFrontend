import React, { useState } from 'react';
import Navbar from '../components/navbar';
import leftsideimage from '../icons/leftsingup.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AboutDetails() {
  const [aboutText, setAboutText] = useState('');

  const handleChange = (e) => {
    setAboutText(e.target.value); // Fixed: for textarea input
  };

  const vendorId = localStorage.getItem('vendorId');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vendorId) {
      alert('Vendor ID missing. Please login first.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/AboutDetails/${vendorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aboutText }),
      });

      if (response.ok) {
        toast.success("About details submitted successfully!");
        setTimeout(() => window.location.href = "/UploadImages", 2000);
        setAboutText("");
      } else {
        alert("Failed to submit details.");
      }
    } catch (error) {
      console.error("Error submitting about details:", error);
      alert("An error occurred.");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mt-4">
        <div className="row backgroundImagesignuppage">
          <div className="col-lg-6 text-center mt-5">
            <h4 className="signupheader mb-4">🐜 Become a Verified Pest Control Partner</h4>
            <p className='text-left'>Join our network of trusted pest control professionals and grow your business with quality leads and easy job management.</p>
            <img src={leftsideimage} alt="signup" className="img-fluid" />
          </div>

          <div className="col-lg-6 col-md-12">
            <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
              <label className="form-label">About Us - Your Company</label>
              <textarea
                className="form-control"
                value={aboutText}
                onChange={handleChange}
                rows={5}
              />
              <button type="submit" className="btn btn-primary mt-3">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutDetails;

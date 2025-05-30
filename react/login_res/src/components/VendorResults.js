import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import noImage from "../icons/noImage.jpg";
import "./VendorResult.css";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import axios from "axios";

const VendorResults = () => {
  const location = useLocation();
  const vendors = location.state?.vendors || []; // ✅ Correct way to access passed state
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    pincode: "",
    businessType: "Residential",
  });

  const existingUser = localStorage.getItem("UserId");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("UserId");
      if (!userId) return;

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/getUserDetails/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          console.error("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const showModel = () => setShowModal(true);
  const hideModel = () => setShowModal(false);

  const handleVendorClick = async (vendorId) => {
    const userId = localStorage.getItem("UserId");
    if (!userId || !vendorId) {
      alert("User ID or Vendor ID is missing.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/enquiry-click`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendorId, userId }),
      });

      if (response.ok) {
        console.log("Click stored successfully.");
      } else {
        console.error("Failed to store the click.");
      }
    } catch (error) {
      console.error("Error storing click:", error);
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required.";
    if (!formData.number) errors.number = "Mobile number is required.";
    if (!formData.pincode) errors.pincode = "Pincode is required.";
    return errors;
  };

  const getCoordinatesFromPincode = async (pincode) => {
      const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      } else {
        throw new Error("Unable to geocode the provided pincode");
      }
    } catch (error) {
      console.error("Geocoding Error:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      alert("Please fill in all required fields.");
      return;
    }

    const coords = await getCoordinatesFromPincode(formData.pincode);
    const latitude = coords?.lat || null;
    const longitude = coords?.lng || null;

    const payload = {
      ...formData,
      skipUserSave: existingUser,
      latitude,
      longitude,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/VSearchBuyer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        if (result.userId) {
          localStorage.setItem("UserId", result.userId);
        }
        setShowModal(false);
        navigate("/vendors", { state: { vendors: result.vendors || [] } }); // ✅ pass via state
      } else {
        alert(result.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bodyvendorresult">
        <div className="container py-5">
          <div className="backbtn mb-3">
            <button className="btn btn-primary" onClick={showModel}>
              Modify
            </button>
          </div>
          <h2 className="text-center mb-4">Verified Vendor Listings</h2>

          {vendors.length > 0 ? (
            <div className="vendor-list">
              {vendors.map((vendor) => (
                <div key={vendor._id} className="card mb-4 shadow-sm border-0 rounded-4">
                  <div className="row g-0 align-items-center">
                    <div className="col-md-3 text-center">
                      {vendor.image?.length > 0 ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL}/uploads/${vendor.image[0].replace("\\", "/")}`}
                          className="d-block w-100 rounded-start p-2 resultImages"
                          alt="Vendor"
                        />
                      ) : (
                        <img
                          src={noImage}
                          className="img-fluid rounded-start p-2"
                          alt="No Image"
                        />
                      )}
                    </div>

                    <div className="col-md-9">
                      <div className="card-body">
                        <h5 className="card-title text-primary mb-4">
                          <Link
                            to={`/pestcontrolOwner/${vendor.businessSlug}`}
                            className="resultcompanyName"
                            onClick={() => handleVendorClick(vendor._id)}
                          >
                            {vendor.businessName}
                          </Link>
                        </h5>

                        <p className="mb-3 addressresult">
                          <strong>
                            <FaMapMarkerAlt />
                          </strong>{" "}
                          {vendor.address}
                        </p>

                        {vendor.logo?.trim().length > 1 && (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/uploads/${vendor.logo.replace("\\", "/")}`}
                            alt="Vendor Logo"
                            className="logoresult"
                            width={100}
                          />
                        )}

                        <div className="mb-3">
                          <p className="ellipsis-2-lines mb-1">{vendor.aboutUs}</p>
                          <Link
                            to={`/pestcontrolOwner/${vendor.businessSlug}`}
                            className="text-primary text-decoration-none"
                            onClick={() => handleVendorClick(vendor._id)}
                          >
                            More Details →
                          </Link>
                        </div>

                        <div className="d-flex flex-wrap gap-2 mt-4">
                          <Link
                            to={`/pestcontrolOwner/${vendor.businessSlug}`}
                            className="btn btn-primary"
                            onClick={() => handleVendorClick(vendor._id)}
                          >
                            <FaPhoneAlt /> Contact Now
                          </Link>

                          <a
                            href={`https://wa.me/${vendor.contactNumber}?text=${encodeURIComponent(
                              "Hi, I am interested in your services."
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success"
                          >
                            <BsWhatsapp /> WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted">No vendors found.</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modify Search Details</h5>
                <button type="button" className="btn-close" onClick={hideModel}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-sm-6 mb-2">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                
                  <div className="col-sm-6 mb-2">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                 
                  <div className="col-sm-6 mb-2">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-sm-6 mb-2">
                    <label className="form-label d-block mb-2">Business Type</label>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="businessType"
                        value="Residential"
                        checked={formData.businessType === "Residential"}
                        onChange={handleChange}
                        id="businessTypeResidential"
                      />
                      <label className="form-check-label" htmlFor="businessTypeResidential">
                        Residential
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="businessType"
                        value="Commercial"
                        checked={formData.businessType === "Commercial"}
                        onChange={handleChange}
                        id="businessTypeCommercial"
                      />
                      <label className="form-check-label" htmlFor="businessTypeCommercial">
                        Commercial
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={hideModel}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Update & Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VendorResults;

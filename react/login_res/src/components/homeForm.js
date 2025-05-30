import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    pincode: "",
    number: "",
    businessType: "Residential"
  });

  const [errors, setErrors] = useState({});
  const [existingUser, setExistingUser] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits.";
    if (!/^\d{10}$/.test(formData.number)) newErrors.number = "Number must be 10 digits.";
    return newErrors;
  };

  const getCoordinatesFromPincode = async (pincode) => {
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    if (!apiKey) {
      console.warn("Google API Key not found.");
      return null;
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      if (response.data.results && response.data.results.length > 0) {
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
      setErrors(validationErrors);
      return;
    }

    const coords = await getCoordinatesFromPincode(formData.pincode);
    const latitude = coords?.lat || null;
    const longitude = coords?.lng || null;

    const payload = {
      ...formData,
      skipUserSave: existingUser,
      latitude,
      longitude
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

        // ✅ Corrected navigate usage
        navigate("/vendors", { state: { vendors: result.vendors || [] } });
      } else {
        alert(result.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="card shadow-lg border-0 rounded-4 px-4 py-4 formhome-container">
        <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
          <h4 className="blink-text text-center" style={{ animation: 'blink 1s infinite' }}>
            Your Reviews, Your Profit
          </h4>
        </a>

        <h5 className="text-center titlestyle fw-bold">
          Get Licenced Pest Control <br />@ Your Pincode
        </h5>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div>
              <label className="form-label mb-0">👤 Name</label>
              <input
                type="text"
                name="name"
                className={`form-control ${errors.name && "is-invalid"}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Name"
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div>
              <label className="form-label mb-0">📮 Pincode</label>
              <input
                type="text"
                name="pincode"
                className={`form-control ${errors.pincode && "is-invalid"}`}
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter Pincode"
              />
              {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
            </div>

            <div>
              <label className="form-label mb-0">📞 Contact Number</label>
              <input
                type="tel"
                name="number"
                className={`form-control ${errors.number && "is-invalid"}`}
                pattern="\d{10}"
                maxLength={10}
                value={formData.number}
                onChange={handleChange}
                placeholder="Enter Contact Number"
              />
              {errors.number && <div className="invalid-feedback">{errors.number}</div>}
            </div>

            <div>
              <label className="form-label mb-0">🏢 Business Type</label>
              <div className="d-flex gap-4 mt-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="businessType"
                    value="Residential"
                    checked={formData.businessType === "Residential"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Residential</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="businessType"
                    value="Commercial"
                    checked={formData.businessType === "Commercial"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Commercial</label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary w-100 py-2 fs-5 rounded-pill">
              🔍 Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomeForm;
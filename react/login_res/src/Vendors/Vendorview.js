import React, { useEffect, useState } from "react";

import axios from "axios";
import "./Vendorview.css";
import Navbar from "../components/navbar";
import { toast } from "react-toastify";

const Vendorview = () => {
 

  const [vendorData, setVendorData] = useState({
    businessName: "",
    address: "",
    pincode: "",
    sinceFrom: "",
    specialistIn: "",
    contactPerson: "",
    contactNumber: "",
    pesticideLicence: "",
    gstNumber: "",
    membership: "",
    branchDetails: "",
    technicalQualification: "",
    aboutUs: "",
  });

  const [propertyImages, setPropertyImages] = useState([]);
  const [existingPropertyImages, setExistingPropertyImages] = useState([]);

  const [logoImage, setLogoImage] = useState(null);
  const [existingLogoImage, setExistingLogoImage] = useState(null);

  const [error, setError] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  const vendorId = window.localStorage.getItem("vendorId");

  useEffect(() => {
    if (!vendorId) {
      setError("No vendor ID found");
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}/getvendorDetails`, { vendorId })
      .then((response) => {
        if (response.data.status === "ok") {
          const data = response.data.data;
          setVendorData(data);
          if (data.logo) setExistingLogoImage(data.logo);
          if (data.image) setExistingPropertyImages(data.image);
        } else {
          setError(response.data.message);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [vendorId]);

  const handleChange = (field, value) => {
    setVendorData({ ...vendorData, [field]: value });
  };

  const handleLogoImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setLogoImage({ file, preview });
      setExistingLogoImage(null);
    }
  };

  const handleGalleryImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPropertyImages((prev) => [...prev, ...previews]);
  };

  const handleRemoveGalleryImage = (index, isExisting = false) => {
    const newImages = isExisting
      ? [...existingPropertyImages]
      : [...propertyImages];

    if (isExisting) {
      newImages.splice(index, 1);
      setExistingPropertyImages(newImages);
    } else {
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      setPropertyImages(newImages);
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("vendorId", vendorId);

    Object.entries(vendorData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (logoImage) {
      formData.append("logoImage", logoImage.file);
    }

    propertyImages.forEach((imgObj) => {
      formData.append("propertyImages", imgObj.file);
    });

    axios
      .post(`${process.env.REACT_APP_API_URL}/updateVendorAllDetails/${vendorId}`, formData)
      .then((response) => {
        if (response.data.status === "ok") {
          toast.success("Data updated successfully!");
          setIsEditable(false);
        } else {
          setError(response.data.message);
        }
      })
      .catch((error) => {
        setError(error.message);
        toast.error("Error updating data");
      });
  };

  const renderField = (label, field, disableEdit = false) => (
    <>
      <div className="vendor-label">{label}</div>
      <div className="vendor-value">
        {isEditable && !disableEdit ? (
          <input
            type="text"
            className="form-control"
            value={vendorData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        ) : (
          vendorData[field] || "-"
        )}
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="bodyvendorresult">
        <div className="pt-3">
          <div className="container containerDashboard">
            <div className="mb-4 p-3 d-flex justify-content-between">
              <h2>Your Details</h2>
              <button
                className="btn btn-primary mb-4"
                onClick={() => {
                  if (isEditable) handleSave();
                  else setIsEditable(true);
                }}
              >
                {isEditable ? "Save" : "Edit"}
              </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="vendor-details">
              {renderField("Company Name", "businessName", true)}
              {renderField("Contact Person", "contactPerson")}
              {renderField("Contact Number", "contactNumber", true)}
              {renderField("Address", "address")}
              {renderField("Pincode", "pincode", true)}
              {renderField("Since From", "sinceFrom")}
              {renderField("Specialist In", "specialistIn")}
              {renderField("Pesticide Licence", "pesticideLicence", true)}
              {renderField("GST Number", "gstNumber", true)}
              {renderField("Membership", "membership")}
              {renderField("Branch Details", "branchDetails")}
              {renderField("Technical Qualification", "technicalQualification")}

              <div className="vendor-label">About Us</div>
              <div className="vendor-value">
                {isEditable ? (
                  <textarea
                    className="form-control"
                    value={vendorData.aboutUs}
                    onChange={(e) => handleChange("aboutUs", e.target.value)}
                    rows="4"
                  />
                ) : (
                  vendorData.aboutUs || "-"
                )}
              </div>
            </div>

            <hr className="my-5" />

            <>
              <h4>Upload Logo</h4>

              <div className="upload-logo">
                {isEditable && (
                  <label className="upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoImageChange}
                      hidden
                      name="logoImage"
                    />
                    <div className="upload-content text-center">
                      <span className="display-5">+</span>
                      <p>Upload Logo</p>
                    </div>
                  </label>
                )}
                {logoImage ? (
                  <div className="image-thumbnail">
                    <img src={logoImage.preview} alt="Uploaded Logo" />
                    <button
                      type="button"
                      className="remove-btn btn-close"
                      onClick={() => setLogoImage(null)}
                    ></button>
                  </div>
                ) : (
                  existingLogoImage && (
                    <div className="image-thumbnail">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${existingLogoImage}`}
                        alt="Existing Logo"
                      />
                    </div>
                  )
                )}
              </div>

              <hr className="my-5" />

              <h4>Upload Property Photos</h4>
              <div className="gallery-grid mt-3">
                {isEditable && (
                  <label className="upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImageChange}
                      hidden
                      name="propertyImages"
                    />
                    <div className="upload-content text-center">
                      <span className="display-5">+</span>
                      <p>Upload Photos</p>
                    </div>
                  </label>
                )}
                {existingPropertyImages.map((url, index) => (
                  <div className="image-thumbnail" key={`existing-${index}`}>
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${url}`}
                      alt={`existing-${index}`}
                    />
                    {isEditable && (
                      <button
                        type="button"
                        className="remove-btn btn-close"
                        onClick={() => handleRemoveGalleryImage(index, true)}
                      ></button>
                    )}
                  </div>
                ))}
                {propertyImages.map((imgObj, index) => (
                  <div className="image-thumbnail" key={`new-${index}`}>
                    <img src={imgObj.preview} alt={`uploaded-${index}`} />
                    <button
                      type="button"
                      className="remove-btn btn-close"
                      onClick={() => handleRemoveGalleryImage(index)}
                    ></button>
                  </div>
                ))}
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vendorview;

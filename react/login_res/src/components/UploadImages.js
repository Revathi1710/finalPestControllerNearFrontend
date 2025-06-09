import React, { useState } from 'react';
import Navbar from '../components/navbar';
import leftsideimage from '../icons/leftsingup.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UploadImages() {
  const vendorId = localStorage.getItem('vendorId');
  const [propertyImages, setPropertyImages] = useState([]);
  const [isEditable, setIsEditable] = useState(true);

  const handleGalleryImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPropertyImages((prev) => [...prev, ...previews]);
  };

  const handleRemoveGalleryImage = (index) => {
    const newImages = [...propertyImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setPropertyImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vendorId) {
      alert('Vendor ID missing. Please login first.');
      return;
    }

    const formData = new FormData();
    propertyImages.forEach((imgObj) => {
      formData.append('propertyImages', imgObj.file);
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/UploadImages/${vendorId}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Images uploaded successfully!');
        setPropertyImages([]);
           setTimeout(() => window.location.href = "/Vendorview", 2000);
      } else {
        toast.error(result.message || 'Failed to upload images.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Something went wrong. Please try again.');
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
            <p className="text-left">
              Join our network of trusted pest control professionals and grow your business with quality leads and easy job management.
            </p>
            <img src={leftsideimage} alt="signup" className="img-fluid" />
          </div>

          <div className="col-lg-6 col-md-12">
            <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
              <h4>Upload Property Photos</h4>

              <div className="gallery-grid mt-3 d-flex flex-wrap gap-3">
                {propertyImages.map((img, index) => (
                  <div key={index} className="position-relative">
                    <img
                      src={img.preview}
                      alt="Preview"
                      className="img-thumbnail"
                      width="100"
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0"
                      onClick={() => handleRemoveGalleryImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {isEditable && (
                  <label className="upload-box border p-3 text-center" style={{ cursor: 'pointer' }}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImageChange}
                      hidden
                      name="propertyImages"
                    />
                    <div className="upload-content">
                      <span className="display-5">+</span>
                      <p>Upload Photos</p>
                    </div>
                  </label>
                )}
              </div>

              <button type="submit" className="btn btn-primary mt-4">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadImages;
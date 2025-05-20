import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import "./PestControlOwner.css"; // Your custom CSS for spacing, colors
import Navbar from "../components/navbar";
function  PestControlOwner() {
  const { slug } = useParams();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    axios.post(`${process.env.REACT_APP_API_URL}/getvendorSlug`, { businessSlug: slug })
      .then((res) => {
        if (res.data.status === "ok") setVendor(res.data.data);
      });
  }, [slug]);

  if (!vendor) return <div className="text-center py-5">Loading...</div>;

  return (
    <>
    <Navbar/>
   
    <div className="my-4 vendor-profile">
      {/* Business Header */}
      <div className="bg-white shadow-sm p-3 rounded mb-3 d-flex align-items-start justify-content-between flex-wrap">
        <div className="d-flex align-items-start">
          <img src={`${process.env.REACT_APP_API_URL}/uploads/${vendor.logo}`} alt="logo"
            className="rounded border me-3" style={{ width: 80, height: 80, objectFit: "contain" }} />
          <div>
            <h4>{vendor.businessName}</h4>
            <div className="d-flex align-items-center">
            
            <span className="badge bg-warning text-dark me-2"> {vendor.membership}</span>
               <span className="badge bg-info text-white me-2">Verified</span>
            {/*   <span className="badge bg-secondary text-white">Claimed</span>*/}
            </div>
            <div className="addressPostpage text-muted mb-2">
              <FaMapMarkerAlt /> {vendor.address} &bull; {vendor.sinceFrom} Years
            </div>
            <small className=" mt-3" style={{color:"#007bff"}}>
            Branch Details:{vendor.branchDetails}
            </small>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0">
          <a href={`tel:${vendor.contactNumber}`} className="btn btn-success">
            <FaPhoneAlt /> {vendor.contactNumber}
          </a>
      
          <a
  href={`https://wa.me/${vendor.contactNumber}?text=${encodeURIComponent(
    "Hi, I am interested in your services."
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn-outline-success"
>
  <BsWhatsapp /> WhatsApp
</a>

        
         
        </div>
      </div>

      {/* Tabs 
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item"><a className="nav-link active" href="#">Photos</a></li>
        <li className="nav-item"><a className="nav-link" href="#">Price List</a></li>
        <li className="nav-item"><a className="nav-link" href="#">Quick Info</a></li>
        <li className="nav-item"><a className="nav-link" href="#">Services</a></li>
        <li className="nav-item"><a className="nav-link" href="#">Reviews</a></li>
      </ul>*/}

      {/* Photos Section */}
      <div className="container d-flex p-2">
        {vendor.image && vendor.image.map((img, index) => (
          <div className="col-md-2 mb-3" key={index}>
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/${img}`}
              className="img-fluid rounded shadow-sm"
              alt={`vendor-img-${index}`}
              style={{ height: 180, objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      {/* Sidebar Contact */}
      <div className="container bg-light p-3 rounded shadow-sm">
    
        <h4 className="mb-3">Business Summary</h4>
        <hr/>
        <h5 className="mb-3 viewvendor-title">About Us</h5>
        <p> {vendor.aboutUs}</p>
       <div className="mt-3 container d-flex justify-content-between ownerpagelist">
        <div>
        <h5 className="mb-3 viewvendor-title">Year of Establishment</h5>
        <p> {vendor.sinceFrom}Years</p>
        </div>
        <div>
        <h5 className="mb-3 viewvendor-title">GST Number</h5>
        <p> {vendor.gstNumber}</p>
        </div>
        <div>
        <h5 className="mb-3 viewvendor-title">Pesticide Licence </h5>
        <p> {vendor.pesticideLicence}</p>
        </div>
        <div>
        <h5 className="mb-3 viewvendor-title">Specialist In </h5>
        <p> {vendor.specialistIn}</p>
        </div>
        <div>
        <h5 className="mb-3 viewvendor-title">Technical Qualification  </h5>
        <p> {vendor.technicalQualification}</p>
        </div>
       </div>
      </div>
    </div> </>
  );
}

export default  PestControlOwner;
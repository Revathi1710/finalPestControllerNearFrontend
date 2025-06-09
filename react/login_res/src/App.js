import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import  Header from './components/navbar';
import Home from './components/index';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SignUp from './components/signup_component';
import Login from './components/login_component';
import Logout from './components/logout';
import VendorResults from './components/VendorResults';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ImageSlider from './components/ImageSlider';
import ForgetPassword from './Vendors/ForgetPassword';
import ResetPassword from './Vendors/ResetPassword';
import Vendorview from './Vendors/Vendorview';
import  AboutDetails from './components/AboutDetails';
import  UploadImages from './components/UploadImages';

import PestControlOwner from './components/pestcontrolOwner';
function App() {
  

  return (
    <Router>
      <div className="App">
     
        <Routes>
        
          <Route path='header' element={<Header/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/vendors" element={<VendorResults />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/pestcontrolOwner/:slug" element={<PestControlOwner />} />
          <Route path="/Vendorview" element={< Vendorview />} />
          <Route path="/ForgetPassword" element={< ForgetPassword />} />
          <Route path="/reset-password/:token" element={< ResetPassword />} />
          <Route path='/AboutDetails'  element={<AboutDetails/>} />
             <Route path='/UploadImages'  element={<UploadImages/>} />
          
          <Route path="/ImageSlider" element={<  ImageSlider />} />
        
          <Route path="/" element={<  Home />} />
       
        </Routes>
      </div>
    </Router>
  );
}

export default App;

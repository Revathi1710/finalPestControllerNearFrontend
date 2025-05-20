import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../icons/logopest2.png';

function Header() {
  const [userName, setUserName] = useState('');
  const [isVendor, setIsVendor] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = localStorage.getItem('UserId');
        const vendorId = localStorage.getItem('vendorId');
        if (!userId && !vendorId) return;

        setIsVendor(!!vendorId);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getName`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, vendorId }),
        });

        const result = await response.json();
        if (result.status === 'ok') {
          const name = result.data?.contactPerson || result.data?.name;
          if (name) setUserName(name);
        }
      } catch (error) {
        console.error('Error fetching name:', error);
      }
    };

    fetchUserName();
  }, []);

  // Function to get initials
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return parts.map(part => part[0].toUpperCase()).join('');
  };

  return (
    <header className="headerbox-nav shadow-sm py-3 d-flex justify-content-between align-items-center flex-wrap">
      <div className="d-flex align-items-center">
        <h1 className="logonameheader mb-0">
          <Link to="/" className="d-flex align-items-center">
            <div className='logo-containerbox'>
              <img src={logo} className='logo-pest' alt="Logo" />
            </div>
            <span className='titlestyle2'>Pest Controller Near Me</span>
          </Link>
        </h1>
      </div>

      <div className="d-flex align-items-center gap-3 mt-2 mt-md-0">
        {userName ? (
          <div
            className="position-relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button className="btn headerbtn position-relative">
              {isMobile ? getInitials(userName) : userName}
              {isMobile && (
                <span className="full-name-tooltip">{userName}</span>
              )}
            </button>
            {showDropdown && (
              <div className="dropdown-menu-custom">
                {isVendor && (
                  <Link to="/Vendorview" className="dropdown-item-custom">Edit Profile</Link>
                )}
                <Link to="/logout" className="dropdown-item-custom">Logout</Link>
              </div>
            )}
          </div>
        ) : (
          <Link to="/Signup" className="login-icon">
            <button className="btn headerbtn">Login</button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;

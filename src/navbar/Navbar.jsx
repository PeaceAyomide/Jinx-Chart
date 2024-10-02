import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { IoMdClose } from "react-icons/io";
import { CiMenuBurger } from "react-icons/ci";
import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [activeButton, setActiveButton] = useState(getActiveButton(location.pathname));
    const [userProfileImage, setUserProfileImage] = useState(null); // Added state variable for user profile image

    const handleSignOut = () => {
        navigate('/login');
    };
  

    function getActiveButton(pathname) {
      switch (pathname) {
        case '/profile':
          return 'profile';
         case '/creator':
          return 'creator';
        default:
          return 'profile';
      }
    }
  
  
    useEffect(() => {
      setActiveButton(getActiveButton(location.pathname));
     }, [location]);
      
    const handleButtonClick = (buttonName) => {
        if (buttonName !== activeButton) {
          setActiveButton(buttonName);
        }
    };
    
    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };
    
   
    
  return (
      <nav>
          <div className={`nav-wall ${isSidebarVisible ? 'visible' : ''} z-[2]`}>
          <div className="logo">
              {userProfileImage ? (
                <img 
                  src={userProfileImage} 
                  alt="User Profile" 
                  className="w-[4rem] h-[4rem] rounded-full object-cover border-2 border-purple-600"
                />
              ) : (
                <div className="w-[4rem] h-[4rem] rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
                  <FaUserCircle className="text-gray-400 text-[2.5rem]" />
                </div>
              )}
          </div>
          <div className="nav-list">
              <Link  to="" className={`link ${activeButton === 'profile' ? 'active' : ''}`} onClick={() => handleButtonClick('profile')}> Profile</Link>
              <Link to="" className={`link ${activeButton === 'creator' ? 'active' : ''}`} onClick={() => handleButtonClick('creator')}> Creator</Link>
              <Link 
                  to="/login" 
                  className="text-white px-5 py-3 text-lg rounded-md bg-[#8A2BE2] transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => {
                      handleSignOut();
                  }}
              >
                  Log Out
              </Link>
          </div>
        
          </div>
          <div className={`close-icon ${isSidebarVisible ? 'visible' : ''} z-[1]`} onClick={toggleSidebar}>
              <IoMdClose/>
          </div>
            
            <div className="open-icon z-[1] side-phone:top-[2rem]" onClick={toggleSidebar}>
              <CiMenuBurger/>
          </div>
    </nav>
  )
}

export default Navbar
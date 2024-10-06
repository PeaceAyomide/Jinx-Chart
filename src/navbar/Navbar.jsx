import React, { useState, useEffect, useCallback } from 'react'
import './Navbar.css'
import { IoMdClose } from "react-icons/io";
import { CiMenuBurger } from "react-icons/ci";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { signOut } from 'firebase/auth'; // Import the signOut function
import { auth } from '../firebase'; // Import the auth object

const Navbar = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [activeButton, setActiveButton] = useState('chart');
  const [userProfileImage, setUserProfileImage] = useState(null); // Added state variable for user profile image
  const navigate = useNavigate(); // Use navigate for navigation
  const location = useLocation();

  useEffect(() => {
    setActiveButton(getActiveButton(location.pathname));
  }, [location]);

  const checkForProfileUpdates = useCallback(() => {
    const user = auth.currentUser;
    if (user) {
      user.reload().then(() => {
        if (user.photoURL !== userProfileImage) {
          setUserProfileImage(user.photoURL);
        }
      }).catch((error) => {
        console.error("Error reloading user data:", error);
      });
    }
  }, [userProfileImage]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserProfileImage(user.photoURL);
      } else {
        setUserProfileImage(null);
      }
    });

    // Set up periodic checks for profile updates
    const intervalId = setInterval(checkForProfileUpdates, 5000); // Check every 5 seconds

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [checkForProfileUpdates]);

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      console.log('User successfully logged out'); // Notify in console
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  function getActiveButton(pathname) {
    switch (pathname) {
      case '/profile':
        return 'profile';
      case '/chart':
        return 'chart';
      case '/creator':
        return 'creator';
      default:
        return 'chart';
    }
  }
  
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
                <div className="w-[4rem] h-[4rem] rounded-full overflow-hidden border-2 border-purple-600">
                  <img 
                    src={userProfileImage} 
                    alt="User Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-[4rem] h-[4rem] rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
                  <FaUserCircle className="text-gray-400 text-[2.5rem]" />
                </div>
              )}
          </div>
          <div className="nav-list">
              <Link  to="/profile " className={`link ${activeButton === 'profile' ? 'active' : ''}`} onClick={() => handleButtonClick('profile')}> Profile</Link>
              <Link to="/chart" className={`link ${activeButton === 'chart' ? 'active' : ''}`} onClick={() => handleButtonClick('chart')}> Messages</Link>
              <Link to="/creator" className={`link ${activeButton === 'creator' ? 'active' : ''}`} onClick={() => handleButtonClick('creator')}> Creator</Link>
              <Link 
                  to="/login" 
                  className="text-white px-5 py-3 text-lg rounded-md bg-[#8A2BE2] transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={handleSignOut}
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
import React, { useRef, useState, useEffect } from 'react'
import { auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { FadeLoader } from 'react-spinners';

const Profile = () => {
  const fileInputRef = useRef(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      const cachedData = JSON.parse(localStorage.getItem('profileData') || '{}');
      setUsername(cachedData.username || "");
      setEmail(cachedData.email || "");
      setProfilePicUrl(cachedData.profilePicUrl || "");

      if (navigator.onLine) {
        const user = auth.currentUser;
        if (user) {
          const newData = {
            username: user.displayName || "",
            email: user.email || "",
            profilePicUrl: user.photoURL || ""
          };
          setUsername(newData.username);
          setEmail(newData.email);
          setProfilePicUrl(newData.profilePicUrl);
          localStorage.setItem('profileData', JSON.stringify(newData));
        }
      }
    };

    loadProfileData();

    window.addEventListener('online', loadProfileData);
    return () => window.removeEventListener('online', loadProfileData);
  }, []);

  const handlePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        const user = auth.currentUser;
        if (!user) {
          throw new Error('No authenticated user found');
        }

        const storageRef = ref(storage, `profile_pics/${user.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Update user profile
        await updateProfile(user, { photoURL: downloadURL });
        
        // Update Firestore document
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          photoURL: downloadURL
        });

        setProfilePicUrl(downloadURL);

        // Update local storage
        const cachedData = JSON.parse(localStorage.getItem('profileData') || '{}');
        cachedData.profilePicUrl = downloadURL;
        localStorage.setItem('profileData', JSON.stringify(cachedData));

        console.log('Profile picture updated successfully');
      } catch (error) {
        console.error('Error updating profile picture:', error);
        alert('Failed to update profile picture. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUsernameEdit = () => {
    setIsEditingUsername(true);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleUsernameSubmit = async (event) => {
    event.preventDefault();
    setIsEditingUsername(false);
    try {
      setIsLoading(true);
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Update Firebase Auth profile
      await updateProfile(user, { displayName: username });

      // Update Firestore document
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        username: username
      });

      // Update local storage
      const cachedData = JSON.parse(localStorage.getItem('profileData') || '{}');
      cachedData.username = username;
      localStorage.setItem('profileData', JSON.stringify(cachedData));

      console.log('Username updated successfully');
    } catch (error) {
      console.error('Error updating username:', error);
      alert('Failed to update username. Please try again.');
      setUsername(auth.currentUser?.displayName || "");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <FadeLoader color="#ffffff" loading={isLoading} size={50} />
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-md w-full side-phone:w-[18rem] max-w-md">
        <div className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto mb-6">
          <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {profilePicUrl ? (
              <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            )}
          </div>
          <button
            className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
            aria-label="Change profile picture"
            onClick={() => fileInputRef.current.click()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePictureUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center">
            {isEditingUsername ? (
              <form onSubmit={handleUsernameSubmit} className="flex items-center">
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none w-44 text-center"
                  autoFocus
                />
                <button type="submit" className="ml-2 text-blue-500 text-sm font-medium">
                  Save
                </button>
              </form>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 w-44 truncate">{username}</h2>
                <button 
                  onClick={handleUsernameEdit} 
                  className="ml-2 text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
              </>
            )}
          </div>
          <p className="text-gray-600">{email}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile
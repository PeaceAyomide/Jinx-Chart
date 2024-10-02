import React, { useRef, useState } from 'react'

const Profile = () => {
  const fileInputRef = useRef(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState("John Doe");

  const handlePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Handle the file upload logic here
      console.log('File selected:', file.name);
    }
  };

  const handleUsernameEdit = () => {
    setIsEditingUsername(true);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleUsernameSubmit = (event) => {
    event.preventDefault();
    setIsEditingUsername(false);
    // TODO: Add logic to update username in the backend
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full side-phone:w-[18rem] max-w-md">
        <div className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto mb-6">
          <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
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
          <p className="text-gray-600">johndoe@example.com</p>
        </div>
      </div>
    </div>
  )
}

export default Profile
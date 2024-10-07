import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Firebase authentication
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Firebase auth functions
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions
import { db } from '../firebase'; // Firestore database

const Signin = () => {
  // State variables for form inputs and error handling
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission for user registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Starting user registration...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created with UID:", userCredential.user.uid);
      
      // Update user profile with username
      await updateProfile(userCredential.user, {
        displayName: username
      });
      console.log("User profile updated with username:", username);

      // Add user document to Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        username: username,
        email: email,
        createdAt: new Date(),
      });
      console.log("User document added to Firestore");

      console.log('User registered successfully:', { email, username });
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error("Error during registration:", error);
      // Handle different error codes
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered.');
          break;
        case 'auth/invalid-email':
          setError('The email address is not valid.');
          break;
        case 'auth/weak-password':
          setError('The password is too weak.');
          break;
        default:
          setError('An unexpected error occurred.');
      }
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-400">
            Sign up for an account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email input field */}
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Username input field */}
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {/* Password input field with toggle visibility */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#8A2BE2]"
            >
              Sign up
            </button>
          </div>
        </form>
        {/* Link to login page */}
        <div className="text-center">
          <Link to="/login" className="font-medium text-indigo-600">
            Already have an account? Log in
          </Link>
        </div>
        {/* Error message display */}
        <div className="text-center mt-2" style={{ height: '24px' }}>
          {error && <div className="text-red-600">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Signin;
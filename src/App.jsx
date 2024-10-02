import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Signin from './gateway/Signin'
import Login from './gateway/Login'
import UploadPic from './pages/uploadpic'
import Navbar from './navbar/Navbar'
import MessagePage from './pages/messagepage'
import Profile from './pages/profile'

const App = () => {
  // Hi Guys 
  // This is Jinx Chart app in progress

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<UploadPic />} />
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/profile" element={<Profile />} />
              <Route path="/chart" element={<MessagePage />} />
            </Routes>
          </>
        } />
      </Routes>
    </Router>
  )
}

export default App
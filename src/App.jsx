import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Signin from './gateway/Signin'
import Login from './gateway/Login'
import UploadPic from './pages/uploadpic'
import Navbar from './navbar/Navbar'
import MessagePage from './pages/messagepage'

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
        {/* New route for MessagePage with Navbar */}
        <Route path="/messages" element={
          <>
            <Navbar />
            <MessagePage />
          </>
        } />
      </Routes>
    </Router>
  )
}

export default App
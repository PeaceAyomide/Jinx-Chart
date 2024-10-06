import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Signin from './gateway/Signin'
import Login from './gateway/Login'
import UploadPic from './pages/uploadpic'
import Navbar from './navbar/Navbar'
import MessagePage from './pages/messagepage'
import Profile from './pages/profile'
import ChartPeople from './pages/chartpeople'
import Creator from './pages/creator'
import ProtectedRoute from './Protectedroutes'
import { AuthProvider } from './AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadPic />
            </ProtectedRoute>
          } />
          <Route path="/chart" element={
            <ProtectedRoute>
              <Navbar />
              <MessagePage />
            </ProtectedRoute>
          } />
          <Route path="*" element={
            <ProtectedRoute>
              <Navbar />
              <Routes>
                <Route path="/profile" element={<Profile />} />
                <Route path="/chart" element={<MessagePage />} />
                <Route path="/creator" element={<Creator />} />
              </Routes>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
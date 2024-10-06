import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const ChatPeople = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 relative">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-purple-600 mr-3"></div>
          <div>
            <h2 className="font-bold">John Doe</h2>
            <p className="text-xs text-green-400">Online</p>
          </div>
        </div>
        <button 
          className="text-purple-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md overflow-hidden shadow-xl z-10 top-full">
            <button 
              className="block px-4 py-2 text-sm text-white hover:bg-purple-600 w-full text-left"
              onClick={() => {
                navigate('/chart');
                setIsMenuOpen(false);
              }}
            >
              Go Back
            </button>
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Received message */}
        <div className="flex items-start">
          <div className="bg-gray-800 text-white p-3 rounded-lg rounded-tl-none max-w-xs">
            <p>Hello! How are you?</p>
          </div>
        </div>

        {/* Sent message */}
        <div className="flex items-end justify-end">
          <div className="bg-purple-600 text-white p-3 rounded-lg rounded-tr-none max-w-xs">
            <p>I'm good, thanks! How about you?</p>
          </div>
        </div>

        {/* More messages can be added here */}
      </div>

      {/* Message input */}
      <div className="p-4 bg-gray-900">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 bg-gray-800 text-white rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button className="ml-2 bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatPeople
import React from 'react';
import { FaWhatsapp, FaUser, FaProjectDiagram, FaGithub, FaHeart } from 'react-icons/fa';

const CreatorProfile = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-sm bg-gray-100 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-cover bg-center h-56 p-4" style={{ backgroundImage: "url('https://source.unsplash.com/random')" }}>
          <div className="flex justify-end">
            <FaHeart className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="p-4 phone:p-1 side-phone:p-3 ">
          <p className="uppercase tracking-wide text-sm font-bold text-gray-700">Creator Name</p>
          <p className="text-gray-700">This is a short bio about the creator. It can include interests, skills, or any other relevant information.</p>
        </div>
        <div className="flex p-4 side-phone:p-2 phone:p-1 border-t border-gray-300 text-gray-700">
          <div className="flex-1 inline-flex items-center">
            <FaUser className="h-6 w-6 text-gray-600" />
            <span className="ml-2">Profile</span>
          </div>
          <div className="flex-1 inline-flex items-center">
            <FaProjectDiagram className="h-6 w-6 text-gray-600" />
            <span className="ml-2">Projects</span>
          </div>
        </div>
        <div className="flex p-4 border-t border-gray-300 text-gray-700">
          <div className="flex-1 inline-flex items-center justify-center">
            <FaWhatsapp className="h-6 w-6 text-green-500" />
            <span className="ml-2">WhatsApp</span>
          </div>
          <div className="flex-1 inline-flex items-center justify-center">
            <FaGithub className="h-6 w-6 text-black" />
            <span className="ml-2">GitHub</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatorProfile;
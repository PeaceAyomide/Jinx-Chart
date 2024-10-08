import React from 'react';
import { FaWhatsapp, FaUser, FaProjectDiagram, FaGithub, FaHeart } from 'react-icons/fa';
import profilePic from '../assets/profilepic.jpeg'; // Adjust the path as necessary

const CreatorProfile = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-sm bg-[#0a0612] shadow-lg rounded-lg overflow-hidden">
        <div className="bg-cover bg-center h-[8rem] side-phone:h-[8rem] p-4" style={{ backgroundImage: "url('https://source.unsplash.com/random')" }}>
          <div className="flex justify-end">
            <FaHeart className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="flex justify-center -mt-20">
          <img src={profilePic} alt="Profile" className="w-40 h-40 side-phone:w-[8rem] side-phone:h-[8rem] object-cover border-4 border-white shadow-lg rounded-full" />
        </div>
        <div className="p-4 phone:p-1 side-phone:p-3 ">
          <p className="uppercase tracking-wide text-sm font-bold text-gray-700">Peace Melodi</p>
          <p className="text-gray-700">I am a software engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success.</p>
        </div>
        <div className="flex  p-4 side-phone:p-2 phone:p-1 border-t border-gray-300 text-gray-700">
          <div className="flex-1 justify-center inline-flex items-center">
            <a href="https://peacedevx.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <FaUser className="h-6 w-6 text-[#AEC6CF]" />
              <span className="ml-2">Profile</span>
            </a>
          </div>
          <div className="flex-1 inline-flex items-center">
            <FaProjectDiagram className="h-6 w-6 text-[#AEC6CF]" />
            <span className="ml-2">Projects</span>
          </div>
        </div>
        <div className="flex p-4 border-t border-gray-300 text-gray-700">
          <div className="flex-1 inline-flex items-center justify-center">
            <FaWhatsapp className="h-6 w-6 text-green-500" />
            <span className="ml-2">WhatsApp</span>
          </div>
          <div className="flex-1 inline-flex items-center justify-center">
            <a href="https://github.com/PeaceAyomide" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <FaGithub className="h-6 w-6 text-[#AEC6CF]" />
              <span className="ml-2">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatorProfile;
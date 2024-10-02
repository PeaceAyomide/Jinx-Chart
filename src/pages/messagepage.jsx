import React from 'react'
import { CiSearch } from "react-icons/ci";

const messagepage = () => {
  // Sample list of names with online status (you can replace this with your actual data)
  const names = [
    { name: 'John Doe', isOnline: true },
    { name: 'Jane Smith', isOnline: false },
    { name: 'Alice Johnson', isOnline: true },
    { name: 'Bob Williams', isOnline: false }
  ];

  return (
    <div className='bg-black pb-[2rem]'>
      <div className='flex justify-center gap-[2.5rem] IPad:gap-[2rem] side-phone:gap-2 side-phone:flex-col'>
        <div className='text-white flex justify-center items-center  relative  py-[5.7rem] side-phone:pt-[7rem] side-phone:pb-[1rem] IPad:pl-[4rem] side-phone:py-[11rem] side-phone:pl-[0] '>
          <input type="text" placeholder='Search Friends' className='bg-[#4B0082] pl-[3.6rem] w-[30rem] h-[3rem] rounded-[1rem] IPad:w-[20rem] side-phone:w-[14rem]' />
          <CiSearch className='text-[#9E9EA2]  absolute  mr-[26rem] IPad:mr-[16rem] text-[1.5rem] side-phone:mr-[10.5rem]' />
        </div>
        <div className='flex justify-center items-center side-phone:pb-[5rem]'>
          <button  className='text-white bg-[#8A2BE2] px-4 py-3.5 text-[0.9rem] rounded-[1rem] IPad:text-[0.7rem] side-phone:text-[0.6rem] transition duration-300 ease-in-out transform hover:scale-105'>Search</button>
        </div>
      </div>

      {/* Updated section for the list of names with online/offline indicator */}
      <div className='max-w-2xl mx-auto  px-4'>
        <ul className='space-y-4'>
          {names.map((user, index) => (
            <li key={index} className='flex items-center justify-between bg-gray-800 p-4 rounded-lg'>
              <div className='flex items-center space-x-3'>
                <div className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className='text-white'>{user.name}</span>
              </div>
              <div className='space-x-2'>
                <button className='bg-[#8A2BE2] text-white px-4 py-2 side-phone:px-2 side-phone:py-1 rounded-md hover:bg-opacity-80 transition duration-300'>
                  Chat
                </button>
                <button className='bg-red-600 text-white px-4 py-2 side-phone:px-2 side-phone:py-1 rounded-md hover:bg-opacity-80 transition duration-300'>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default messagepage
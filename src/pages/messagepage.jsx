import React, { useEffect, useState, useCallback } from 'react'
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Adjust the path as necessary

const messagepage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(() => {
    // Retrieve users from local storage on initial load
    const savedUsers = localStorage.getItem('cachedUsers');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [blockedUsers, setBlockedUsers] = useState(() => {
    const savedBlockedUsers = localStorage.getItem('blockedUsers');
    return savedBlockedUsers ? JSON.parse(savedBlockedUsers) : [];
  });
  const [lastFetchTime, setLastFetchTime] = useState(() => {
    return localStorage.getItem('lastUsersFetchTime') || 0;
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users from Firestore, excluding the current user
  const fetchUsers = useCallback(async () => {
    const now = Date.now();
    const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (now - lastFetchTime < FETCH_INTERVAL) {
      console.log("Using cached user data");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = querySnapshot.docs
          .filter(doc => doc.id !== currentUser.uid)
          .map(doc => {
            const userData = doc.data();
            return {
              id: doc.id,
              ...userData,
              isOnline: userData.isOnline || false
            };
          });
        setUsers(usersList);
        localStorage.setItem('cachedUsers', JSON.stringify(usersList));
        localStorage.setItem('lastUsersFetchTime', now.toString());
        setLastFetchTime(now);
        setRefreshKey(prevKey => prevKey + 1);
      }
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  }, [lastFetchTime]);

  const handleBlockUser = (userToBlock) => {
    const updatedBlockedUsers = [...blockedUsers, userToBlock.id];
    setBlockedUsers(updatedBlockedUsers);
    localStorage.setItem('blockedUsers', JSON.stringify(updatedBlockedUsers));
    console.log(`User ${userToBlock.username} has been blocked.`);
  };

  const handleUnblockUser = (userToUnblock) => {
    const updatedBlockedUsers = blockedUsers.filter(id => id !== userToUnblock.id);
    setBlockedUsers(updatedBlockedUsers);
    localStorage.setItem('blockedUsers', JSON.stringify(updatedBlockedUsers));
    console.log(`User ${userToUnblock.username} has been unblocked.`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchUsers(); // Initial fetch

    // Set up real-time listeners for each user's online status
    const unsubscribes = users.map(user => 
      onSnapshot(doc(db, 'users', user.id), 
        (docSnapshot) => {
          const userData = docSnapshot.data();
          if (userData) {
            setUsers(prevUsers => {
              const updatedUsers = prevUsers.map(u => 
                u.id === user.id ? { ...u, ...userData, isOnline: userData.isOnline || false } : u
              );
              localStorage.setItem('cachedUsers', JSON.stringify(updatedUsers));
              return updatedUsers;
            });
          } else {
            setUsers(prevUsers => {
              const updatedUsers = prevUsers.filter(u => u.id !== user.id);
              localStorage.setItem('cachedUsers', JSON.stringify(updatedUsers));
              return updatedUsers;
            });
          }
        },
        (error) => {
          console.error(`Error listening to user ${user.id}:`, error);
        }
      )
    );

    // Set up interval for periodic refresh
    const intervalId = setInterval(() => {
      fetchUsers();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    // Clean up interval and listeners on component unmount
    return () => {
      clearInterval(intervalId);
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [fetchUsers, users]);

  return (
    <div className='bg-black pb-[2rem]'>
      {/* Search bar and button */}
      <div className='flex justify-center gap-[2.5rem] IPad:gap-[2rem] side-phone:gap-2 side-phone:flex-col'>
        <div className='text-white flex justify-center items-center relative py-[5.7rem] side-phone:pt-[7rem] side-phone:pb-[1rem] IPad:pl-[4rem] side-phone:py-[11rem] side-phone:pl-[0]'>
          <input 
            type="text" 
            placeholder='Search Friends' 
            className='bg-[#4B0082] pl-[3.6rem] w-[30rem] h-[3rem] rounded-[1rem] IPad:w-[20rem] side-phone:w-[14rem]' 
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <CiSearch className='text-[#9E9EA2] absolute mr-[26rem] IPad:mr-[16rem] text-[1.5rem] side-phone:mr-[10.5rem]' />
        </div>
        <div className='flex justify-center items-center side-phone:pb-[5rem]'>
          <button 
            className='text-white bg-[#8A2BE2] px-4 py-3.5 text-[0.9rem] rounded-[1rem] IPad:text-[0.7rem] side-phone:text-[0.6rem] transition duration-300 ease-in-out transform hover:scale-105'
            onClick={() => {
              if (filteredUsers.length === 0) {
                alert('Username does not exist');
              }
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* User list */}
      <div className='max-w-2xl mx-auto px-4'>
        <ul className='space-y-4'>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <li key={user.id} className='flex items-center justify-between bg-gray-800 p-4 rounded-lg'>
                <div className='flex items-center space-x-4'>
                  <div className='w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden'>
                    {user.photoURL ? (
                      <img 
                        src={`${user.photoURL}?${refreshKey}`} 
                        alt={user.username} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      user.username ? user.username.charAt(0).toUpperCase() : '?'
                    )}
                  </div>
                  <span className='text-white truncate max-w-[8ch]' title={user.username}>
                    {user.username ? (user.username.length > 8 ? `${user.username.slice(0, 8)}...` : user.username) : 'Unknown'}
                  </span>
                </div>
                <div className='space-x-2'>
                  <button 
                    className={`bg-[#8A2BE2] text-white px-4 py-2 side-phone:px-2 side-phone:py-1 side-phone:text-[0.8rem] rounded-md hover:bg-opacity-80 transition duration-300 ${blockedUsers.includes(user.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => navigate(`/chat/${user.id}`)}
                    disabled={blockedUsers.includes(user.id)}
                  >
                    Chat
                  </button>
                  {blockedUsers.includes(user.id) ? (
                    <button 
                      className='bg-green-600 text-white px-4 py-2 side-phone:px-2 side-phone:py-1 side-phone:text-[0.8rem] rounded-md hover:bg-opacity-80 transition duration-300'
                      onClick={() => handleUnblockUser(user)}
                    >
                      Unblock
                    </button>
                  ) : (
                    <button 
                      className='bg-red-600 text-white px-4 py-2 side-phone:px-2 side-phone:py-1 side-phone:text-[0.8rem] rounded-md hover:bg-opacity-80 transition duration-300'
                      onClick={() => handleBlockUser(user)}
                    >
                      Block
                    </button>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className='text-white text-center'>No users found</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default messagepage
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { collection, query, orderBy, addDoc, serverTimestamp, onSnapshot, where, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import useSound from 'use-sound';
import newMessageSound from '../assets/notificationsound.m4a'; // Adjust the path as needed

const ChatPeople = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatPartner, setChatPartner] = useState(null);
  const messagesEndRef = useRef(null);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);
  const [playNewMessageSound] = useSound(newMessageSound);
  const previousMessagesLengthRef = useRef(0);
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (!userId || !auth.currentUser) return;

    console.log("Current user ID:", auth.currentUser.uid);
    console.log("Chat partner ID:", userId);

    // Fetch chat partner information
    const fetchChatPartner = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setChatPartner(userDoc.data());
      }
    };

    fetchChatPartner();

    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', auth.currentUser.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = [];
      querySnapshot.forEach((doc) => {
        const messageData = doc.data();
        if (messageData.participants.includes(userId)) {
          fetchedMessages.push({ 
            id: doc.id, 
            ...messageData,
            createdAt: messageData.createdAt ? messageData.createdAt.toDate() : new Date()
          });
        }
      });
      
      console.log("Fetched messages:", fetchedMessages);
      
      if (fetchedMessages.length > previousMessagesLengthRef.current && 
          previousMessagesLengthRef.current > 0 &&
          fetchedMessages[fetchedMessages.length - 1].userId !== auth.currentUser.uid) {
        playNewMessageSound();
      }
      
      previousMessagesLengthRef.current = fetchedMessages.length;
      setMessages(fetchedMessages);
      
      if (fetchedMessages.length > 0) {
        setLastMessageTimestamp(fetchedMessages[fetchedMessages.length - 1].createdAt);
      }
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    return () => unsubscribe();
  }, [userId, playNewMessageSound]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        recipientId: userId,
        participants: [auth.currentUser.uid, userId]
      });
      
      setNewMessage('');
      adjustTextareaHeight(); // Reset height after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 relative">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-purple-600 mr-3">
            {chatPartner?.photoURL && (
              <img src={chatPartner.photoURL} alt={chatPartner.username} className="w-full h-full rounded-full object-cover" />
            )}
          </div>
          <div>
            <h2 className="font-bold">{chatPartner?.username || 'Loading...'}</h2>
            <p className="text-xs text-green-400">Online</p>
          </div>
        </div>
        <button 
          className="text-purple-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
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
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.userId === auth.currentUser.uid ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`
                ${message.userId === auth.currentUser.uid 
                  ? 'bg-[#8A2BE2] text-white' 
                  : 'bg-gray-700 text-gray-200'
                } 
                p-3 rounded-lg max-w-xs break-words
              `}
            >
              <p>{message.text}</p>
              <span className="text-xs text-gray-400 block mt-1">
                {formatTimestamp(message.createdAt)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={sendMessage} className="p-4 bg-gray-900">
        <div className="flex items-end">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message"
            className="flex-1 bg-gray-800 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none overflow-hidden"
            style={{ minHeight: '40px', maxHeight: '120px' }}
            rows={1}
          />
          <button type="submit" className="ml-2 bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatPeople
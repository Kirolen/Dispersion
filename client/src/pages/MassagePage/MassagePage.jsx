import React, { useState } from 'react';
import './MessagesPage.css';
import PersonalChat from '../../components/PersonalChatComponents/Chat/PersonalChat'
import MainChatList from '../../components/PersonalChatComponents/List/List'
import ChatDetails from '../../components/PersonalChatComponents/ChatDetails/ChatDetails';
import { useSocket } from '../../context/SocketContext';

const MessagesPage = () => {
  const [chatId, setChatId] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isMobileChat, setIsMobileChat] = useState(false);
  const [isTableChat, setIsTableChat] = useState(false);
  const {isCollapsed} = useSocket()
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleChatSelect = (id) => {
    setChatId(id);
    if (window.innerWidth <= 768){
      setIsTableChat(true)
      setIsMobileChat(false);
    }
    else if (window.innerWidth <= 768) {
      setIsTableChat(false)
      setIsMobileChat(true);
    }
    else {
      setIsTableChat(false)
      setIsMobileChat(false);
    }
  };

  const handleBackToList = () => {
    setChatId("")
    //setIsMobileChat(false);
    setShowDetails(false);
  };

  return (
    <div className={`messages-container`}>
      <div className="messages-header">
        <h1>Messages</h1>
      </div>

      <div className={`messages-content ${isCollapsed ? 'collapsed' : ''}`}>
        <MainChatList chatId={chatId} setChatId={handleChatSelect} />
        {chatId && (
            <PersonalChat 
              chatId={chatId} 
              toggleDetails={toggleDetails} 
              onBack={handleBackToList}
            />
          
        )}
        {showDetails && <ChatDetails setShowDetails={setShowDetails} showDetails={showDetails}/>}
      </div>
    </div>
  );
};

export default MessagesPage;
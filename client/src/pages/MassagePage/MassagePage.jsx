import React, { useState } from 'react';
import './MessagesPage.css';
import PersonalChat from '../../components/PersonalChatComponents/Chat/PersonalChat'
import MainChatList from '../../components/PersonalChatComponents/List/List'
import ChatDetails from '../../components/PersonalChatComponents/ChatDetails/ChatDetails';
import { useSocket } from '../../context/SocketContext';

const MessagesPage = () => {
  const [chatId, setChatId] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [messages, setMessages] = useState([]);
  const {isCollapsed} = useSocket()
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleChatSelect = (id) => {
    setChatId(id);

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
              messages={messages}
              setMessages={setMessages}
            />
          
        )}
        {showDetails && <ChatDetails setShowDetails={setShowDetails} showDetails={showDetails} messages={messages}/>}
      </div>
    </div>
  );
};

export default MessagesPage;
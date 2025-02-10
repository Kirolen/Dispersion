import React, { useState } from 'react';
import './MessagesPage.css';
import PersonalChat from '../../components/PersonalChatComponents/Chat/PersonalChat'
import MainChatList from '../../components/PersonalChatComponents/List/List'
import ChatDetails from '../../components/PersonalChatComponents/ChatDetails/ChatDetails';
const MessagesPage = () => {

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h1>Messages</h1>
      </div>

      <div className="messages-content">
        <MainChatList/>
        <PersonalChat/>
        <ChatDetails/>
      </div>

    </div>
  );
};

export default MessagesPage;

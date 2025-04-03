import React, {useState, useRef } from "react";
import styles from "./MessagePage.module.css";
import PersonalChat from "../../components/PersonalChatComponents/Chat/PersonalChat";
import MainChatList from "../../components/PersonalChatComponents/List/List";
import ChatDetails from "../../components/PersonalChatComponents/ChatDetails/ChatDetails";

const MessagesPage = () => {
  const [chatId, setChatId] = useState("");
  const [messages, setMessages] = useState([]);
  const containerRef = useRef(null);

  const handleChatSelect = (id) => {
    setChatId(id);
  };

  return (
    <div className={styles.messagesContainer} ref={containerRef}>
      <div className={styles.messagesHeader}>
        <h1>{`Messages`}</h1>
      </div>

      <div className={styles.messagesContent}>
        <MainChatList chatId={chatId} setChatId={handleChatSelect} />

        <PersonalChat chatId={chatId} setChatId={handleChatSelect} messages={messages} setMessages={setMessages} />

        <ChatDetails messages={messages} />
      </div>
    </div>
  );
};

export default MessagesPage;

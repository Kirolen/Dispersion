import React, {useState, useRef, useEffect } from "react";
import styles from "./MessagePage.module.css";
import PersonalChat from "../../components/PersonalChatComponents/Chat/PersonalChat";
import MainChatList from "../../components/PersonalChatComponents/List/List";
import ChatDetails from "../../components/PersonalChatComponents/ChatDetails/ChatDetails";
import { useSelector } from "react-redux";

const MessagesPage = () => {
  const {chatId} = useSelector(state => state.chat)

  useEffect(() => {
    console.log("chat: ", chatId)
  }, [chatId])

  return (
    <div className={styles.messagesContainer}>
      <div className={styles.messagesHeader}>
        <h1>{`Messages`}</h1>
      </div>

      <div className={styles.messagesContent}>
        <MainChatList />

        {chatId.trim() !== "-1" && <PersonalChat/>}

        {chatId.trim() !== "-1" &&  <ChatDetails/>}
      </div>
    </div>
  );
};

export default MessagesPage;

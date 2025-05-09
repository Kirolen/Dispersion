import { useEffect, useState } from "react";
import styles from "./ChatList.module.css";
import { AiOutlineSearch, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { getUserChats } from "../../../../api/personalChatService";
import AddChat from "./addChat/addChat";
import {useDispatch, useSelector } from "react-redux";
import { setChatId } from "../../../../store/reducers/personalChatSlice";
import unknownAvatar from "../../../../img/unknownAvatar.png"

const ChatList = () => {
    const dispatch = useDispatch()
    const [addMode, setAddMode] = useState(false);
    const [chats, setChats] = useState([]);
    const { user_id, notification } = useSelector((state) => state.user)

    const IconComponent = addMode ? AiOutlineMinus : AiOutlinePlus;

    useEffect(() => {
        if (user_id) {
            getUserChats()
                .then(response => {
                    setChats(response.data.chats);
                })
                .catch(error => console.error("Error fetching chats:", error));
        }
    }, [user_id, notification]); 
    
    

    return (
        <div className={styles.chatList}>
            <div className={styles.searchContainer}>
                <div className={styles.searchBar}>
                    <AiOutlineSearch className={styles.searchIcon} />
                    <input type="text" placeholder="Search" />
                </div>
                <IconComponent className={styles.addUserIcon} onClick={() => setAddMode(!addMode)} />
            </div>

            {chats.length > 0 ? (
                chats.map((chat) => {
                    const otherUser = chat.members.find((member) => member._id !== user_id); 
                    return (
                        <div className={styles.chatItem} key={chat._id} onClick={() => dispatch(setChatId(chat._id))}>
                            <img
                                src={otherUser.avatar?.trim() || unknownAvatar}
                                alt="user"
                                className={styles.anotherUserAvatar}
                            />
                            <div className={styles.chatItemText}>
                                <span>{otherUser.first_name} {otherUser.last_name}</span>
                                <p>{chat.lastMessage ? chat.lastMessage.text : "No messages yet"}</p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>No chats available</p>
            )}

            {addMode && <AddChat setChats={setChats} chats={chats} onClose={() => setAddMode(false)} />}
        </div>
    );
};

export default ChatList;
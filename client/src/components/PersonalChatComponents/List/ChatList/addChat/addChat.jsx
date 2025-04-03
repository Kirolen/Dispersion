import styles from "./AddChat.module.css";
import { searchUser, createChat } from "../../../../../api/personalChatService";
import { useState } from "react";
import { useSocket } from "../../../../../context/SocketContext";
import { AiOutlineClose } from "react-icons/ai";

const AddChat = ({ setChats, chats, onClose }) => {
    const [keyWord, setKeyWord] = useState("");
    const [users, setUsers] = useState([]);
    const { user_id } = useSocket();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!keyWord.trim()) return;

        try {
            const response = await searchUser(keyWord);
            setUsers(response.data.users);
        } catch (error) {
            console.error("Error searching users:", error);
        }
    };

    const handleAddChat = async (userId) => {
        try {
            const response = await createChat({ user1: user_id, user2: userId });
            if (response.data.success) {
                const newChat = response.data.chat;
                setChats([...chats, newChat]);
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, hasChat: true } : user
                ));
            }
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

    return (
        <div className={styles.addChatContainer}>
            <div className={styles.addChatHeader}>
                <h3>Add New Chat</h3>
                <button className={styles.closeButton} onClick={onClose}>
                    <AiOutlineClose />
                </button>
            </div>
            <form className={styles.searchForm} onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by email, name, or surname"
                    name="keyWord"
                    value={keyWord}
                    onChange={(e) => setKeyWord(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            <div className={styles.usersList}>
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user._id} className={styles.anotherUserDetails}>
                            <div className={styles.userChatInfo}>
                                <img src="https://c.wallhere.com/photos/38/1d/anime_anime_girls_Oshi_no_Ko_Kurokawa_Akane-2247722.jpg!d" alt="user" />
                                <span>{user.first_name} {user.last_name}</span>
                            </div>
                            {user.hasChat ? (
                                <button disabled>Already in chat</button>
                            ) : (
                                <button onClick={() => handleAddChat(user._id)}>Add User</button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className={styles.notFound}>No users found</p>
                )}
            </div>
        </div>
    );
};

export default AddChat;
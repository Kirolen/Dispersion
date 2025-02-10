import "./addChat.css";
import { searchUser, createChat } from "../../../../../api/personalChatService";
import { useState } from "react";
import { useSocket } from "../../../../../context/SocketContext";

const AddChat = ({ setChats, chats }) => {
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
                console.log(response)
                // Додаємо новий чат у список
                setChats([...chats, newChat]);

                // Оновлюємо список чатових юзерів
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, hasChat: true } : user
                ));
            }
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

    return (
        <div className="add-chat">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Key word (email, name, surname)"
                    name="keyWord"
                    value={keyWord}
                    onChange={(e) => setKeyWord(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            {users.length > 0 ? (
                users.map((user) => (
                    <div key={user._id} className="user">
                        <div className="detail">
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
            ) : (<p>No users found</p>)}
        </div>
    );
};

export default AddChat;

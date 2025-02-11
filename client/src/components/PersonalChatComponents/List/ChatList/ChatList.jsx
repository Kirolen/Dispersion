import { useEffect, useState } from "react";
import "./ChatList.css";
import { AiOutlineSearch, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useSocket } from "../../../../context/SocketContext";
import { getUserChats } from "../../../../api/personalChatService";
import AddChat from "./addChat/addChat";

const ChatList = ({setChatId}) => {
    const [addMode, setAddMode] = useState(false);
    const [chats, setChats] = useState([]);
    const { user_id } = useSocket(); 
    
    useEffect(() => {
        const fetchChats = async () => {
            try {
                if (!user_id) return
                const response = await getUserChats();
                setChats(response.data.chats);
                console.log(response.data.chats[0]._id)
                setChatId(response.data.chats[0]._id)
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };

        if (user_id) {
            fetchChats();
        }
    }, [user_id]);

    return (
        <div className="chat-list">
            <div className="search">
                <div className="search-bar">
                    <AiOutlineSearch className="icon" />
                    <input type="text" placeholder="Search" />
                </div>
                {addMode ? (
                    <AiOutlineMinus className="icon-add" onClick={() => setAddMode(false)} />
                ) : (
                    <AiOutlinePlus className="icon-add" onClick={() => setAddMode(true)} />
                )}
            </div>

            {chats.length > 0 ? (
                chats.map((chat) => {
                    const otherUser = chat.members.find((member) => member._id !== user_id); 
                    return (
                        <div className="item" key={chat._id} onClick={() => setChatId(chat._id)}>
                            <img
                                src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg"
                                alt="user"
                                className="user-chat-avatar"
                            />
                            <div className="texts">
                                <span>{otherUser?.first_name} {otherUser?.last_name}</span>
                                <p>{chat.lastMessage ? chat.lastMessage.text : "No messages yet"}</p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>No chats available</p>
            )}

            {addMode && <AddChat setChats={setChats} chats={chats} currentUserId={user_id} />}
        </div>
    );
};

export default ChatList;

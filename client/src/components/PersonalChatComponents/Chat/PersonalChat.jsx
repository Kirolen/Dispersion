import "./PersonalChat.css"
import { AiFillInfoCircle, AiOutlineVideoCamera } from "react-icons/ai";
import { MdEmojiEmotions } from "react-icons/md";
import { FaImage, FaMicrophone } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useState, useRef } from "react";
import { getChat, sendMessage, getMessages } from "../../../api/personalChatService";
import { useSocket } from "../../../context/SocketContext";

const PersonalChat = ({ chatId }) => {
    const [messages, setMessages] = useState([])
    const [member, setMember] = useState([])
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("")
    const { user_id, socket } = useSocket()
    const endRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (!socket || !chatId.trim()) {
                    return;
                }
                socket.emit("joinChat", { chatId, user_id, course_id: null });
                socket.on("getMessages", (loadedMessages) => {
                    setMessages(loadedMessages);
                });

                socket.on("newMessage", (newMessage) => {
                    console.log(newMessage)
                    if (newMessage.chatId === chatId) {
                        setMessages((prev) => [...prev, newMessage]);
                    }
                });

                const response = await getChat(chatId);
                const chat = response.data.chat;

                if (chat && chat.members && chat.members.length >= 2) {
                    const [member1, member2] = chat.members;
                    setMember(member1._id === user_id ? member2 : member1);
                }
            } catch (error) {
                console.error("Error fetching chat:", error);
            }
        };

        fetchMessages();

    return () => {
      if (socket?.emit) {
        socket.emit("leaveChat", { chatId });
      }
    };
  }, [socket, chatId]);


    const handleSendMessage = async () => {
        try {
            if (socket && text.trim()) {
                socket.emit("sendMessage", { chatId, sender: user_id, text, attachments: [] });
                setText("");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleEmoji = (e) => {
        setText(prev => prev + e.emoji)
        setOpen(false)
    }

    return (
        <div className="personal-chat">
            <div className="top">
                <div className="user">
                    <img src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg" alt="ayase" className="user-chat-avatar" />
                    <div className="texts">
                        <span>{member.first_name} {member.last_name}</span>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>
                </div>
                <div className="icons">
                    <AiFillInfoCircle className="icon" />
                </div>
            </div>
            <div className="center">
                {messages?.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.sender._id === user_id ? "own" : ""}`}
                    >
                        {message.sender._id !== user_id && (
                            <img
                                src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg"
                                alt="user-avatar"
                                className="user-chat-avatar"
                            />
                        )}
                        <div className="texts">
                            <p>{message.text}</p>
                            <span>{new Date(message.created_at).toLocaleTimeString()}</span>
                        </div>
                    </div>
                ))}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <FaImage className="icon" />
                    <AiOutlineVideoCamera className="icon" />
                    <FaMicrophone className="icon" />
                </div>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <div className="emoji">
                    <MdEmojiEmotions className="icon" onClick={() => setOpen((prev) => !prev)} />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>

                </div>
                <button className="send-button" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    )
}

export default PersonalChat;
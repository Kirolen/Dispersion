import { useState } from "react";
import "./ChatList.css"
import { AiOutlineSearch, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import AddChat from "./addChat/addChat"
const ChatList = () => {
    const [addMode, setAddMode] = useState(false)

    return (
        <div className="chat-list">
            <div className="search">
                <div className="search-bar">
                    <AiOutlineSearch className="icon" />
                    <input type="text" placeholder="Search" />
                </div>
                {addMode ?
                    <AiOutlineMinus className="icon-add" onClick={() => setAddMode((prev) => !prev)} /> :
                    <AiOutlinePlus className="icon-add" onClick={() => setAddMode((prev) => !prev)} />}
            </div>
            <div className="item">
                <img src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg" alt="ayase" className="user-chat-avatar" />
                <div className="texts">
                    <span>Momo Ayase</span>
                    <p>Hello</p>
                </div>
            </div>
            <div className="item">
                <img src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg" alt="ayase" className="user-chat-avatar" />
                <div className="texts">
                    <span>Momo Ayase</span>
                    <p>Hello</p>
                </div>
            </div>
            <div className="item">
                <img src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg" alt="ayase" className="user-chat-avatar" />
                <div className="texts">
                    <span>Momo Ayase</span>
                    <p>Hello</p>
                </div>
            </div>
            <div className="item">
                <img src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg" alt="ayase" className="user-chat-avatar" />
                <div className="texts">
                    <span>Momo Ayase</span>
                    <p>Hello</p>
                </div>
            </div>
            <div className="item">
                <img src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg" alt="ayase" className="user-chat-avatar" />
                <div className="texts">
                    <span>Momo Ayase</span>
                    <p>Hello</p>
                </div>
            </div>
            {addMode && <AddChat/>}
        </div>
    )
}

export default ChatList;
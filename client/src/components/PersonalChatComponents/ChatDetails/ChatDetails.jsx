import "./ChatDetails.css"
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineDownload } from "react-icons/ai";

import {FaArrowLeft } from "react-icons/fa";
import { useSocket } from "../../../context/SocketContext";
const ChatDetails = ({setShowDetails, showDetails}) => {
      const {isCollapsed} = useSocket()

    return (<div className={`chat-details ${isCollapsed ? '' : 'not-collapsed'} ${showDetails ? "active" : ""}`}>
        {(
            <button className="back-button" onClick={() => setShowDetails(false)}>
                <FaArrowLeft />
            </button>
        )}
        <div className="user">
            <img src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg" alt="ayase" className="user-chat-avatar" />
            <h2>Ayase Momo</h2>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. </p>
        </div>
        <div className="info">
            <div className="option">
                <div className="title">
                    <span>Chat Settings</span>
                    <AiOutlineArrowUp className="icon" />
                </div>
            </div>
            <div className="option">
                <div className="title">
                    <span>Shared photos</span>
                    <AiOutlineArrowDown className="icon" />
                </div>
                <div className="photos">
                    <div className="photo-item">
                        <div className="photo-detail">
                            <img src="https://c.wallhere.com/photos/38/1d/anime_anime_girls_Oshi_no_Ko_Kurokawa_Akane-2247722.jpg!d" alt="akane" />
                            <span>photo.2022</span>
                        </div>
                        <AiOutlineDownload className="icon" />
                    </div>
                </div>


            </div>
            <div className="option">
                <div className="title">
                    <span>Shared files</span>
                    <AiOutlineArrowUp className="icon" />
                </div>
            </div>
        </div>
    </div>)
}

export default ChatDetails;
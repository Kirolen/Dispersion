import "./UserInfo.css"
import { AiOutlineMore, AiTwotoneEdit } from "react-icons/ai";



const UserInfo = () => {
    return (
        <div className="chat-user-info">
            <div className="user">
                <img src="https://c.wallhere.com/photos/38/1d/anime_anime_girls_Oshi_no_Ko_Kurokawa_Akane-2247722.jpg!d" alt="akane" className="user-chat-avatar"/>
                <h2>Akane  Kurokawa</h2>
            </div>
            <div className="icons">
                <AiOutlineMore className="icon"/>
                <AiTwotoneEdit className="icon"/>
            </div>
        </div>)
}

export default UserInfo;
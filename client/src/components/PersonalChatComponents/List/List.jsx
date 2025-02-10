import ChatList from "./ChatList/ChatList";
import "./List.css"
import UserInfo from "./UserInfo/UserInfo";


const MainChatList = () => {
    return (
    <div className="main-chat-list">
        <UserInfo/>
        <ChatList/>
    </div>   )
}

export default MainChatList;
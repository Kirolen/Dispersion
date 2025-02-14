import ChatList from "./ChatList/ChatList";
import "./List.css"
import UserInfo from "./UserInfo/UserInfo";


const MainChatList = ({chatId, setChatId}) => {
    return (
    <div className={`main-chat-list ${chatId.trim() ? "" : "active"}`}>
        <UserInfo/>
        <ChatList setChatId={setChatId}/>
    </div>   )
}

export default MainChatList;
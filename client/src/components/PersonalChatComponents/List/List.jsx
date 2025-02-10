import ChatList from "./ChatList/ChatList";
import "./List.css"
import UserInfo from "./UserInfo/UserInfo";


const MainChatList = ({setChatId}) => {
    return (
    <div className="main-chat-list">
        <UserInfo/>
        <ChatList setChatId={setChatId}/>
    </div>   )
}

export default MainChatList;
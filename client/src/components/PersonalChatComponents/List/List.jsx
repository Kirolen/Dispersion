import ChatList from "./ChatList/ChatList";
import UserInfo from "./UserInfo/UserInfo";
import styles from "./List.module.css"
import { useSocket } from "../../../context/SocketContext";

const MainChatList = ({chatId, setChatId}) => {
    const {isMenuOpen} = useSocket();

    return (
    <div className={`${styles.mainChatList} ${isMenuOpen ? styles.withOpenMenu : ""} ${chatId.trim() ? styles.hide : ''}`}>
        <UserInfo/>
        <ChatList setChatId={setChatId}/>
    </div>   )
}

export default MainChatList;
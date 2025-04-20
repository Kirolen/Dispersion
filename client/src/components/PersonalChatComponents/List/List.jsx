import ChatList from "./ChatList/ChatList";
import UserInfo from "./UserInfo/UserInfo";
import styles from "./List.module.css"
import { useSelector } from "react-redux";

const MainChatList = () => {
    const isMenuOpen = useSelector(state => state.menu.isMenuOpen);
    const chatId = useSelector(state => state.chat.chatId)

    return (
    <div className={`${styles.mainChatList} ${isMenuOpen ? styles.withOpenMenu : ""} ${chatId !== "-1" ? styles.hide : ''}`}>
        <UserInfo/>
        <ChatList/>
    </div>   )
}

export default MainChatList;
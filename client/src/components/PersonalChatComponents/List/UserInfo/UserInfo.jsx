import styles from "./UserInfo.module.css"
import { AiOutlineMore, AiTwotoneEdit } from "react-icons/ai";

const UserInfo = () => {
    return (
        <div className={styles.userInfoHeader}>
            <div className={styles.infoContainer}>
                <img src="https://c.wallhere.com/photos/38/1d/anime_anime_girls_Oshi_no_Ko_Kurokawa_Akane-2247722.jpg!d" alt="akane" className={styles.userImg}/>
                <h2>Akane  Kurokawa</h2>
            </div>
            <div className={styles.icons}>
                <AiOutlineMore className={styles.icon}/>
                <AiTwotoneEdit className={styles.icon}/>
            </div>
        </div>)
}

export default UserInfo;
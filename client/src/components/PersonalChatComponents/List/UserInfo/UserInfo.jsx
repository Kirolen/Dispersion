import { useEffect, useState } from "react";
import styles from "./UserInfo.module.css"
import { AiOutlineMore, AiTwotoneEdit } from "react-icons/ai";
import { getUserInfo } from "../../../../api/userService";
import { useSelector } from "react-redux";
import unknownAvatar from "../../../../img/unknownAvatar.png"

const UserInfo = () => {
    const [userInfo, setUserInfo] = useState({
        name: "",
        avatar: ""
    })
    const {user_id} = useSelector(state => state.user)

    useEffect(() => {
        const fetchUser = async () => {
            if(user_id.toString() === "-1") return;
            const {data} = await getUserInfo(user_id)
            setUserInfo(prev => ({...prev, 
                name: data.first_name + ' ' + data.last_name,
                avatar: data.avatar
            }))
        }

        fetchUser();
    }, [user_id])

    return (
        <div className={styles.userInfoHeader}>
            <div className={styles.infoContainer}>
                <img src={userInfo.avatar.trim() || unknownAvatar} alt="akane" className={styles.userImg}/>
                <h2>{userInfo.name}</h2>
            </div>
            <div className={styles.icons}>
                <AiOutlineMore className={styles.icon}/>
                <AiTwotoneEdit className={styles.icon}/>
            </div>
        </div>)
}

export default UserInfo;
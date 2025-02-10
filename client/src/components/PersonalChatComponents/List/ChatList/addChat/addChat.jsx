import "./addChat.css"

const AddChat = () => {
    return(
        <div className="add-chat">
            <form>
                <input type="text" placeholder="Username" name="username" />
                <button>Search</button>
            </form>
            <div className="user">
                <div className="detail">
                    <img src="https://c.wallhere.com/photos/38/1d/anime_anime_girls_Oshi_no_Ko_Kurokawa_Akane-2247722.jpg!d" alt="akane" />
                    <span>Akane Kurokawa</span>
                </div>
                <button>Add User</button>
            </div>
        </div>
    )
}

export default AddChat;
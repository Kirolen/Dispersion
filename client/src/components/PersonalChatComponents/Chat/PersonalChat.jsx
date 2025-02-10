import "./PersonalChat.css"
import { AiFillInfoCircle, AiOutlineVideoCamera } from "react-icons/ai";
import { MdEmojiEmotions } from "react-icons/md";
import { FaImage, FaMicrophone } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useState, useRef } from "react";


const PersonalChat = () => {
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("")

    const endRef = useRef(null)

    useEffect(()=> {
        endRef.current?.scrollIntoView({behavior:"smooth" })
    }, {})

    const handleEmoji = (e) => {
        setText(prev => prev + e.emoji)
        setOpen(false)
    }

    return (
        <div className="personal-chat">
            <div className="top">
                <div className="user">
                    <img src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg" alt="ayase" className="user-chat-avatar" />
                    <div className="texts">
                        <span>Momo Ayase</span>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>
                </div>
                <div className="icons">
                    <AiFillInfoCircle className="icon" />
                </div>
            </div>
            <div className="center">
                <div className="message"><img src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg" alt="ayase" className="user-chat-avatar" />
                    <div className="texts">
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam
                            eos dicta aperiam perferendis iste tempore maxime reprehenderit
                            pariatur exercitationem dolore ad, inventore voluptates.
                            Praesentium, quo magnam in nobis sunt assumenda!
                        </p>
                        <span>1 minute ago</span>
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam
                            eos dicta aperiam perferendis iste tempore maxime reprehenderit
                            pariatur exercitationem dolore ad, inventore voluptates.
                            Praesentium, quo magnam in nobis sunt assumenda!
                        </p>
                        <span>1 minute ago</span>
                    </div>
                </div>
                <div className="message">
                    <img src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg" alt="ayase" className="user-chat-avatar" />
                    <div className="texts">
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam
                            eos dicta aperiam perferendis iste tempore maxime reprehenderit
                            pariatur exercitationem dolore ad, inventore voluptates.
                            Praesentium, quo magnam in nobis sunt assumenda!
                        </p>
                        <span>1 minute ago</span>
                    </div>
                </div>
                <div className="message own">
                   
                    <div className="texts">
                    <img src="https://c.wallhere.com/photos/38/1d/anime_anime_girls_Oshi_no_Ko_Kurokawa_Akane-2247722.jpg!d" alt="akane"/>
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam
                            eos dicta aperiam perferendis iste tempore maxime reprehenderit
                            pariatur exercitationem dolore ad, inventore voluptates.
                            Praesentium, quo magnam in nobis sunt assumenda!
                        </p>
                        <span>1 minute ago</span>
                    </div>
                </div>
                <div className="message">
                    <img src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg" alt="ayase" className="user-chat-avatar" />
                    <div className="texts">
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam
                            eos dicta aperiam perferendis iste tempore maxime reprehenderit
                            pariatur exercitationem dolore ad, inventore voluptates.
                            Praesentium, quo magnam in nobis sunt assumenda!
                        </p>
                        <span>1 minute ago</span>
                    </div>
                </div>
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <FaImage className="icon" />
                    <AiOutlineVideoCamera className="icon" />
                    <FaMicrophone className="icon" />
                </div>
                <input type="text" placeholder="Type a message..." value={text} onChange={e => setText(e.target.value)} />
                <div className="emoji">
                    <MdEmojiEmotions className="icon" onClick={() => setOpen((prev) => !prev)} />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>

                </div>
                <button className="send-button">Send</button>
            </div>
        </div>
    )
}

export default PersonalChat;
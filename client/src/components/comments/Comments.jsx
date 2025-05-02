import { useContext } from "react";
import "./comments.scss";
import {AuthContext} from "../../context/AuthContext";
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from "@mui/material";

const Comments = () => {

    const {currentUser} = useContext(AuthContext);

    // TEMPORARY 
    const comments = [
        {
            id: 1,
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            name: "John Doe",
            userId: 1,
            profilePic:
            "https://i.pinimg.com/736x/64/e8/00/64e80093aa9e4e2bc3ff5aba88bc22f4.jpg"
        },
        {
            id: 2,
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            name: "John Doe",
            userId: 1,
            profilePic:
            "https://i.pinimg.com/736x/64/e8/00/64e80093aa9e4e2bc3ff5aba88bc22f4.jpg"
        },
        {
            id: 3,
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            name: "John Doe",
            userId: 1,
            profilePic:
            "https://i.pinimg.com/736x/64/e8/00/64e80093aa9e4e2bc3ff5aba88bc22f4.jpg"
        },
        {
            id: 4,
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            name: "John Doe",
            userId: 1,
            profilePic:
            "https://i.pinimg.com/736x/64/e8/00/64e80093aa9e4e2bc3ff5aba88bc22f4.jpg"
        },
        {
            id: 5,
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            name: "John Doe",
            userId: 1,
            profilePic:
            "https://i.pinimg.com/736x/64/e8/00/64e80093aa9e4e2bc3ff5aba88bc22f4.jpg"
        }
    ]

    return (
        <div className="comments">
            <div className="write-comment">
                <img src={currentUser.profilePic} alt="" />
                <input type="text" placeholder="Write a Comment" />
                <IconButton>
                    <SendIcon sx={{color:"gray"}}/>
                </IconButton>
            </div>
            {comments.map(comment=>(
                <div className="comment" key={comment.id}>
                    <img src={comment.profilePic} alt="" />
                    <div className="info">
                        <span>{comment.name}</span>
                        <p>{comment.desc}</p>
                    </div>
                    <span className="date">1 hour ago</span>
                </div>
            ))}
        </div>
    );
}

export default Comments;
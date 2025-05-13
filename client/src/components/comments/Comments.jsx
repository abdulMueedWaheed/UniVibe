import { useContext, useState, useEffect } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/AuthContext";
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from "@mui/material";
import { makeRequest } from "../../axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";

const Comments = ({ postsID }) => {
  const { currentUser } = useContext(AuthContext);
  const [desc, setDesc] = useState("");
  const queryClient = useQueryClient();
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        console.log("Fetching user data for ID:", currentUser.id);
        const res = await makeRequest.get(`/users/${currentUser.id}`);
        console.log("User data response:", res.data);

        if (res.data && res.data.data) {
          const user = res.data.data;
          setProfilePic(user.profile_pic || "");
        }
      }
      catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchProfilePic();
  }, [])

  console.log("Comments component received postsID:", postsID);
  // Fetch comments
  const { data, isLoading, error } = useQuery({
    queryKey: ["comments", postsID],
    queryFn: () => makeRequest.get(`/comments?postId=${postsID}`).then(res => res.data),
    enabled: !!postsID,
  });
  
  const comments = Array.isArray(data) ? data : [];

  // Add comment mutation
  const mutation = useMutation({
    mutationFn: () => makeRequest.post("/comments", { desc, postId: postsID, userId: currentUser.id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postsID]);
      setDesc(""); 
    }
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!desc.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
    if (!postsID || !currentUser?.id) {
      console.error("Missing postsID or userId:", { postsID, userId: currentUser?.id });
      return;
    }
    console.log("Sending comment:", { desc, postId: postsID, userId: currentUser.id });
    mutation.mutate();
  };

  if (!postsID) {
    console.error("postsID is undefined in Comments component");
    return <p>Invalid post ID</p>;
  }

  console.log("Current user profile_pic:", currentUser?.profile_pic);

  return (
    <div className="comments">
      <div className="write-comment">
        <img
          src={profilePic}
          alt="Profile_pic"
        />
        <input
          type="text"
          placeholder="Write a Comment"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
        <IconButton onClick={handleSend}>
          <SendIcon sx={{ color: "gray" }} />
        </IconButton>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading comments</p>
      ) : (
        comments.map(comment => (
          <div className="comment" key={comment.id}>
            <img src={comment.users?.profile_pic || ""} alt="" />
            <div className="info">
              <span>{comment.users?.full_name || "User"}</span>
              <p>{comment.content}</p>
            </div>
            <span className="date">{moment(comment.created_at).fromNow()}</span>
          </div>
        ))
      )}
    </div>
  );
};
export default Comments;
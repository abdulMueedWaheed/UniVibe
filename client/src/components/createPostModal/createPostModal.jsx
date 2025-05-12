import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";
import "./createPostModal.scss";
import { AuthContext } from "../../context/AuthContext.jsx";

const CreatePostModal = ({ onClose }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const {currentUser} = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation({
	mutationFn: (newPost) => makeRequest.post("/posts", newPost), // Correct usage
	onSuccess: () => {
		queryClient.invalidateQueries(["posts"]); // Refresh the posts list
		onClose(); // Close the modal after successful submission
	},
	onError: (error) => {
		console.error("Error creating post:", error);
	},
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (image && video) {
      alert("You can only upload an image or a video, not both.");
      return;
    }

    const formData = {
      user_id: currentUser.id, // Replace with the actual logged-in user's ID
      content,
      image_url: image ? URL.createObjectURL(image) : null,
      video_url: video ? URL.createObjectURL(video) : null,
    };

    mutation.mutate(formData);
  };

  return (
    <div className="modal">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>
          X
        </button>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
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
    mutationFn: (newPost) => {
      // When using FormData, we need to make sure headers are not manually set
      // because the browser needs to set the correct Content-Type with boundary
      return makeRequest.post("/posts", newPost, {
        headers: {
          // Don't set Content-Type here, let the browser set it with the correct boundary
          // when sending multipart/form-data
        }
      });
    },
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

    // Create a FormData object to send files
    const formData = new FormData();
    
    // Append text data
    formData.append("user_id", currentUser.id);
    formData.append("content", content);
    
    // Append file if it exists
    if (image) {
      formData.append("file", image);
      console.log("Appending image file:", image.name);
    } else if (video) {
      formData.append("file", video);
      console.log("Appending video file:", video.name);
    }

    // Check if formData contains what you expect
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    // Update the mutation function
    mutation.mutate(formData);
  };

  return (
    <div className="modal">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>
          X
        </button>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
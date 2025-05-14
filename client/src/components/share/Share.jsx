import "./share.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Share = () => {
    const queryClient = useQueryClient();
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [profilePic, setProfilePic] = useState("");
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });

    const { currentUser } = useContext(AuthContext);

    // Updated useMutation with success handling and form reset
    const mutation = useMutation({
        mutationFn: (newPost) => {
            return makeRequest.post("/posts", newPost);
        },
        onSuccess: () => {
            // Refresh the posts list
            queryClient.invalidateQueries(["posts"]);
            
            // Show success notification
            setNotification({
                show: true,
                message: "Post created successfully!",
                type: "success"
            });
            
            // Clear form fields
            setContent("");
            setImage(null);
            setVideo(null);
            
            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: "", type: "" });
            }, 3000);
        },
        onError: (error) => {
            console.error("Error creating post:", error);
            
            // Show error notification
            setNotification({
                show: true,
                message: "Failed to create post. Please try again.",
                type: "error"
            });
            
            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: "", type: "" });
            }, 3000);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form input
        if (!content.trim()) {
            setNotification({
                show: true,
                message: "Please enter some content for your post",
                type: "error"
            });
            
            setTimeout(() => {
                setNotification({ show: false, message: "", type: "" });
            }, 3000);
            return;
        }

        if (image && video) {
            setNotification({
                show: true,
                message: "You can only upload an image or a video, not both.",
                type: "error"
            });
            
            setTimeout(() => {
                setNotification({ show: false, message: "", type: "" });
            }, 3000);
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
        } else if (video) {
            formData.append("file", video);
        }

        // Update the mutation function
        mutation.mutate(formData);
    };

    useEffect(() => {
        const fetchProfilePic = async () => {
            try {
                const res = await makeRequest.get(`/users/${currentUser.id}`);
                
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
    }, [currentUser.id]);

    return (
        <div className="share">
            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            
            <div className="container">
                <div className="top">
                    <div className="left">
                        <img src={profilePic} alt="" style={{ border: "2px solid black" }} />
                        <input
                            type="text"
                            placeholder={`What's on your mind?`}
                            onChange={(e) => setContent(e.target.value)}
                            value={content}
                        />
                    </div>
                    <div className="right">
                        {image && (
                            <div className="file-preview">
                                <img className="file" alt="" src={URL.createObjectURL(image)} />
                                <button 
                                    className="remove-file" 
                                    onClick={() => setImage(null)}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        {video && (
                            <div className="file-preview">
                                <video className="file" controls>
                                    <source src={URL.createObjectURL(video)} type="video/mp4" />
                                    Your browser does not support video playback.
                                </video>
                                <button 
                                    className="remove-file" 
                                    onClick={() => setVideo(null)}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <hr />
                <div className="bottom">
                    <div className="left">
                        <input
                            type="file"
                            id="file"
                            style={{ display: "none" }}
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    setImage(e.target.files[0]);
                                    setVideo(null); // Clear video if image is selected
                                }
                            }}
                            accept="image/*"
                        />
                        <input
                            type="file"
                            accept="video/*"
                            id="video"
                            style={{display: "none"}}
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    setVideo(e.target.files[0]);
                                    setImage(null); // Clear image if video is selected
                                }
                            }}
                        />
                        <label htmlFor="file">
                            <div className="item">
                                <span>Add Image</span>
                            </div>
                        </label>
                        <label htmlFor="video">
                            <div className="item">
                                <span>Add Video</span>
                            </div>
                        </label>
                    </div>
                    <div className="right">
                        <button 
                            onClick={handleSubmit}
                            disabled={mutation.isLoading}
                        >
                            {mutation.isLoading ? "Sharing..." : "Share"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Share;
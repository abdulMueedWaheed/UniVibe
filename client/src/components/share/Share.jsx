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

    const { currentUser } = useContext(AuthContext);

    // Updated useMutation syntax to match the expected format
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

    return (
        <div className="share">
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
                            <img className="file" alt="" src={URL.createObjectURL(image)} />
                        )}
                        {video && (
                            <img className="file" alt="" src={URL.createObjectURL(image)} />
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
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        <input
                            type="file"
                            accept="video/*"
                            id="video"
                            style={{display: "none"}}
                            onChange={(e) => setVideo(e.target.files[0])}
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
                        <button onClick={handleSubmit}>Share</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Share;
import { useContext } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Stories = () => {

  const {currentUser} = useContext(AuthContext);

  // TEMPORARY DATA (Later to be fetched from API)
  const stories = [
    {
      id: 1,
      userId: 1,
      name: "NSAC",
      img: "https://i.pinimg.com/736x/64/e8/00/64e80093aa9e4e2bc3ff5aba88bc22f4.jpg"
    },
    {
      id: 2,
      userId: 2,
      name: "NSAC",
      img: "https://i.pinimg.com/736x/64/e8/00/64e80093aa9e4e2bc3ff5aba88bc22f4.jpg"
    },
    {
      id: 3,
      userId: 3,
      name: "NSAC",
      img: "https://i.pinimg.com/736x/64/e8/00/64e80093aa9e4e2bc3ff5aba88bc22f4.jpg"
    },
    {
      id: 4,
      userId: 4,
      name: "NSAC",
      img: "https://i.pinimg.com/736x/64/e8/00/64e80093aa9e4e2bc3ff5aba88bc22f4.jpg"
    },
    {
      id: 5,
      userId: 5,
      name: "NSAC",
      img: "https://i.pinimg.com/736x/64/e8/00/64e80093aa9e4e2bc3ff5aba88bc22f4.jpg"
    },
    // {
    //   id: 6,
    //   name: "NSAC",
    //   img: "https://i.pinimg.com/736x/64/e8/00/64e80093aa9e4e2bc3ff5aba88bc22f4.jpg"
    // },
    
  ];

  return (
    <div className='stories'>
      <div className="story">
        <img src={currentUser.profilePic} />
        {/* <span>{currentUser.name}</span> */}
        <button id="add-story-btn">+</button>
      </div>
      {
        stories.map(story => (
          <div className="story" key={story.id}>
            <Link to={`/profile/${story.userId}`}>
              <img src={story.img} alt={story.name} />
            </Link>
          </div>
        ))
      }
    </div>
  )
};

export default Stories;
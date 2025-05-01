import "./posts.scss"
import Post from "../post/Post"

const Posts = () => {

  // TEMPORARY DATA
  const posts = [
    {
      id: 1,
      name: "Adeel Hassan",
      userId: 2,
      profilePic: "https://i.pinimg.com/736x/a0/fc/5a/a0fc5ac1b6b833a52a74863ecc981a1d.jpg",
      desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      img: "https://i.pinimg.com/736x/97/89/b1/9789b117061558140dcc62ea6676cfe3.jpg"
    },
    {
      id: 2,
      name: "Abdul Mueed",
      userId: 3,
      profilePic: "https://i.pinimg.com/736x/a0/fc/5a/a0fc5ac1b6b833a52a74863ecc981a1d.jpg",
      desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
      // img: "https://i.pinimg.com/736x/97/89/b1/9789b117061558140dcc62ea6676cfe3.jpg"
    }
  ]
  return (
    <div className='posts'>
      {
        posts.map(post=>(
          <div className="post" key={post.id}>
            <Post post={post}/>
          </div>
        ))
      } 
    </div>
  )
}

export default Posts
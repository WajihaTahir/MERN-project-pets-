import { useContext, useEffect, useState } from "react";
import baseUrl from "../../utils/baseurl";
import { Post } from "../../@types/posts";
import PostView from "../../components/Post/PostView.tsx";
import "./Allposts.css";
import deletePost from "../../components/DeletePost/DeletePost.tsx";
import { AuthContext } from "../../context/AuthContext.tsx";
import CreatePostModal from "../../components/CreatePostModal/CreatePostModal.tsx";
type APIResponse = {
  allPosts: Post[];
  number: number;
};

function Allposts() {
  //fetching all posts first
  const { user } = useContext(AuthContext);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const fetchAllPosts = () => {
    console.log("baseUrl :>> ", baseUrl);
    fetch(`${baseUrl}/api/posts/allposts/`)
      .then((res) => res.json())
      .then((res) => {
        console.log("res :>> ", res);
        const foundPosts = res as APIResponse;
        setAllPosts(foundPosts.allPosts);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchAllPosts();
  }, []); //operation will be performed when it is first rendered.

  const onPostDelete = async (post: Post) => {
    try {
      await deletePost(post);
      setAllPosts(allPosts.filter((item: Post) => post._id !== item._id)); //only display those posts whose id doesn't match with the given id.
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div key={user?._id} className="usertimelinepicturepost">
        <img src={user?.userpicture} className="timelineUserPicture" />
        <input
          className="addpost"
          placeholder="click to add your post"
          onFocus={handleOpenModal}
        />
        <CreatePostModal
          onClose={handleCloseModal}
          isOpen={showModal}
          onSuccess={fetchAllPosts}
        />
      </div>
      {allPosts.map((post) => {
        console.log("postssss", post);
        return <PostView post={post} onDelete={onPostDelete} />;
      })}
    </>
  );
}

export default Allposts;

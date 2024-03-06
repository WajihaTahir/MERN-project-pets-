import { useContext, useState } from "react";
import { Post } from "../../@types/posts";
import PostView from "../../components/Post/PostView.tsx";
import "./PostList.css";
import deletePost from "../../api/deletePost.ts";
import { AuthContext } from "../../context/AuthContext.tsx";
import CreatePostModal from "../../components/CreatePostModal/CreatePostModal.tsx";

type Props = {
  //setting props for each type of parametes being passed to the function.
  posts: Post[];
  setPosts: (posts: Post[]) => void; //helpful to update the current set of posts with new ones.
  fetchPosts: () => void;
};
function PostList({ posts, fetchPosts, setPosts }: Props) {
  //fetching all posts first
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  }; //close the modal

  const handleOpenModal = () => {
    setShowModal(true); //opens the modal
  };
  const onPostDelete = async (post: Post) => {
    try {
      await deletePost(post);
      setPosts(posts.filter((item: Post) => post._id !== item._id)); //only display those posts whose id doesn't match with the given id.
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="postview-all">
        <div key={user?._id} className="usertimelinepicturepost">
          <img src={user?.userpicture} className="timelineUserPicture" />
          <input
            className="addpost"
            placeholder="click to add your post"
            onFocus={handleOpenModal} //for opening a modal to create post
          />
          <CreatePostModal
            onClose={handleCloseModal}
            isOpen={showModal}
            onSuccess={fetchPosts}
          />
        </div>
        {posts.map((post) => {
          console.log("postssss", post);
          return <PostView post={post} onDelete={onPostDelete} />;
        })}
      </div>
    </>
  );
}

export default PostList;

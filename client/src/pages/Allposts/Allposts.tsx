import { useEffect, useState } from "react";
import baseUrl from "../../utils/baseurl";
import { Post } from "../../@types/posts";
import PostView from "../../components/Post/PostView.tsx";
import "../Allposts/Allposts.css";
import { useNavigate } from "react-router";

type APIResponse = {
  allPosts: Post[];
  number: number;
};

function Allposts() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
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
    fetchAllPosts();
  }, []);

  return (
    <>
      <h6>All Pet Posts &#128513;</h6>
      <button
        className="createnewpost"
        onClick={() => {
          navigate("/createnewpost");
          //CreateNewPost();
        }}
      >
        Create a new post
      </button>
      <div></div>

      {allPosts.map((post) => {
        console.log("postssss", post);
        return <PostView post={post} />;
      })}
    </>
  );
}

export default Allposts;

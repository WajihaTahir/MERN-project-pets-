import { useEffect, useState } from "react";
import baseUrl from "../../utils/baseurl";
import { Post } from "../../@types/posts";
import PostList from "../../components/PostList/PostList.tsx";

type APIResponse = {
  allPosts: Post[];
  number: number;
};

function Allposts() {
  //fetching all posts first
  const [allPosts, setAllPosts] = useState<Post[]>([]);

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

  return (
    <>
      <PostList
        posts={allPosts}
        setPosts={setAllPosts}
        fetchPosts={fetchAllPosts}
      />
    </>
  );
}

export default Allposts;

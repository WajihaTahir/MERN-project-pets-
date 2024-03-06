import { useEffect, useState } from "react";
import { Post } from "../../@types/posts";
import PostList from "../../components/PostList/PostList.tsx";
import getPostByUser from "../../api/getPostByUser.ts";
import { useLocation } from "react-router";

export type APIResponse = {
  userPosts: Post[];
  number: number;
};

function UserPosts() {
  //to get the posts of the particular user
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const { state } = useLocation(); //uselocation accesses the location
  //object representing the active URL. state was being set at postview under handleUsernameClick function.

  const fetchUserPosts = async () => {
    try {
      const data = await getPostByUser(state.user);
      if (data) {
        setAllPosts(data.userPosts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [state]); //operation will be performed when it is first rendered and state is coming from useLocation hook.

  return (
    <>
      <PostList
        posts={allPosts}
        setPosts={setAllPosts}
        fetchPosts={fetchUserPosts}
      />
    </>
  );
}

export default UserPosts;

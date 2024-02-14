import { useEffect, useState } from "react";
import baseUrl from "../../utils/baseurl";
import { Post } from "../../@types/posts";

type APIResponse = {
  allPosts: Post[];
  number: number;
};

function Allposts() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
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
      <h3>Here are all posts</h3>

      {allPosts.map((post) => {
        return (
          <div key={post._id}>
            <p>Caption: {post.caption}</p>
            <p>User Name: {post.userName}</p>
            {post.comments && post.comments.length > 0 && (
              <ul>
                {post.comments.map((comment, index: number) => (
                  <li key={index}>
                    <img
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                      src={comment.commentorPicture}
                    />
                    {comment.commentorName}: {comment.comment}
                    <img src={comment.commentorPicture}></img>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );
}

export default Allposts;

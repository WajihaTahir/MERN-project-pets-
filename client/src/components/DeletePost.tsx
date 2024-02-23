import { Post } from "../@types/posts";
import baseUrl from "../utils/baseurl";
import getToken from "../utils/getToken";

type Props = {
  post: Post;
};

const deletePost = async ({ post }: Props) => {
  try {
    const token = getToken();
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
    };

    const response = await fetch(
      `${baseUrl}/api/posts/deletePost/${post._id}`,
      requestOptions
    );
    const result = await response.json();
    console.log("result of deleting a post", result);
    alert("Post deleted successfully");
  } catch (error) {
    console.log("error", error);
  }
};

export default deletePost;

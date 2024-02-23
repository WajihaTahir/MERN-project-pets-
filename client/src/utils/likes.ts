import { Post } from "../@types/posts.ts";
import baseUrl from "./baseurl.ts";
import getToken from "./getToken.ts";

type Props = {
  post: Post;
};

//LIKE A POST
const likePost = async ({ post }: Props) => {
  const token = getToken();
  if (token) {
    console.log("token", token);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
    };
    console.log("request ops", requestOptions);
    try {
      const response = await fetch(
        `${baseUrl}/api/posts/likepost/${post._id}`,
        requestOptions
      );
      const result = await response.json();
      console.log("result of like", result);
    } catch (error) {
      console.log(error);
    }
  }
};

//TO UNLIKE A POST
const unlikePost = async ({ post }: Props) => {
  const token = getToken();
  if (token) {
    console.log("token", token);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
    };
    try {
      const response = await fetch(
        `${baseUrl}/api/posts/unlikepost/${post._id}`,
        requestOptions
      );
      const result = await response.json();
      console.log("result of unlike", result);
    } catch (error) {
      console.log("problem unliking a post", error);
    }
  }
};

export { likePost, unlikePost };

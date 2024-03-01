import { Post } from "../../@types/posts";
import baseUrl from "../../utils/baseurl";
import getToken from "../../utils/getToken";

const deletePost = (post: Post): Promise<unknown> => {
  //deleting a post
  return new Promise((resolve, reject) => {
    try {
      const token = getToken();
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
      };

      fetch(`${baseUrl}/api/posts/deletePost/${post._id}`, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          console.log("result of deleting a post", result);
          alert("Post deleted successfully");
          resolve(result); // Resolve the promise with the result
        })
        .catch((error) => {
          console.log("error", error);
          reject(error); // Reject the promise with the error
        });
    } catch (error) {
      console.log("error", error);
      reject(error); // Reject the promise with the error
    }
  });
};

export default deletePost;

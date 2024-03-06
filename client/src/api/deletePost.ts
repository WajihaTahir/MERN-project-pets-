import { Post } from "../@types/posts";
import baseUrl from "../utils/baseurl";
import getToken from "../utils/getToken";

const deletePost = (post: Post): Promise<unknown> => {
  //if we use async, it would be like working with promises under the hood.
  //deleting a post
  return new Promise((resolve, reject) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this cute post :( ?"
      );
      if (!confirmDelete) {
        reject("User cancelled Deletion :D");
        return;
      }

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

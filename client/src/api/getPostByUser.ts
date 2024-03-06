import baseUrl from "../utils/baseurl";
import { User } from "../@types/users";

//getting all posts of a single user

const getPostByUser = async (user: User) => {
  const requestOptions = {
    method: "GET",
  };
  try {
    const data = await fetch(
      `${baseUrl}/api/posts/userposts/${user?._id}`,
      requestOptions
    );
    const dataJson = await data.json(); //coverting the data into json
    return dataJson;
  } catch (error) {
    console.log("error", error);
  }
};

export default getPostByUser;

import { ChangeEvent, useState } from "react";
import baseUrl from "../../utils/baseurl";
import getToken from "../../utils/getToken";

const UpdatePost = async () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File | string>("");
  const [imageToShow, setImageToShow] = useState<File | string>("");
  const [caption, setCaption] = useState<string>("");

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    console.log("e target", e.target.files?.[0]);
    setImage(file || "");
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set image source to data URL
        setImageToShow(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitUpdatePost = async () => {
    const token = getToken();
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    const formdata = new FormData();
    formdata.append("image", image);
    formdata.append("caption", caption);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    };
    try {
      const response = await fetch(
        `${baseUrl}/api/posts/updatePost/${post._id}`,
        requestOptions
      );
      const result = await response.json();
      console.log("update result", result);
    } catch (error) {
      alert("problem updating a post");
    }
  };
};

export default UpdatePost;

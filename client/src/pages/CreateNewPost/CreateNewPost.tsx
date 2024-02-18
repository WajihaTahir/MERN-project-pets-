import React, { ChangeEvent, useState } from "react";
import baseUrl from "../../utils/baseurl.ts";
import "./CreateNewPost.css";
const CreateNewPost = () => {
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

  const onSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
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
        `${baseUrl}/api/posts/postnewpost/`,
        requestOptions
      );
      setLoading(false);
    } catch (error) {
      console.log("error creating post", error);
      alert("Couldn't create post");
      setLoading(false);
    }
  };
  return (
    <div className="create-post-page">
      <div className="container">
        <h2>Create a Post</h2>
        <form className="post-form">
          <div className="form-group">
            {loading && <p>Loading...</p>}
            <textarea
              id="caption"
              value={caption}
              name="caption"
              placeholder="Say something about your pet"
              onChange={(e) => setCaption(e.target.value)}
              style={{ width: "300px", height: "200px" }}
            ></textarea>

            {imageToShow && (
              <img src={imageToShow} width="300px" height="250px" />
            )}
            <input type="file" onChange={handleFileSelect} />
          </div>
          <button type="submit" className="btn-submit" onClick={onSubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewPost;

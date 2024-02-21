import React, { ChangeEvent, useContext, useState } from "react";
import baseUrl from "../../utils/baseurl.ts";
import "./CreateNewPost.css";
import { AuthContext } from "../../context/AuthContext.tsx";
import getToken from "../../utils/getToken.ts";
const CreateNewPost = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File | string>("");
  const [imageToShow, setImageToShow] = useState<File | string>("");
  const [caption, setCaption] = useState<string>("");
  const { user } = useContext(AuthContext);

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
        `${baseUrl}/api/posts/postnewpost/`,
        requestOptions
      );
      if (response.ok) {
        setLoading(false);
      }
    } catch (error) {
      console.log("error creating post", error);
      alert("Couldn't create post" + error);
      setLoading(false);
    }
  };
  return (
    <>
      {user && (
        <div className="create-post-page">
          <div className="container">
            <h2 style={{ fontFamily: "fantasy" }}>
              Create a cool post for your pet! &#128008;
            </h2>
            <div className="post-form">
              <div className="form-group">
                {loading && <p>Loading...</p>}
                <textarea
                  id="caption"
                  value={caption}
                  name="caption"
                  placeholder="Say something about your pet"
                  onChange={(e) => setCaption(e.target.value)}
                  style={{
                    width: "700px",
                    height: "200px",
                    fontFamily: "fantasy",
                    fontSize: "20px",
                  }}
                ></textarea>

                {imageToShow && (
                  <img src={imageToShow} width="300px" height="250px" />
                )}
                <input type="file" onChange={handleFileSelect} />
              </div>
              <button className="btn-submit" onClick={onSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateNewPost;

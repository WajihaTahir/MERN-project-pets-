import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import getToken from "../../utils/getToken.ts";
import baseUrl from "../../utils/baseurl.ts";
import Spinner from "../Spinner/Spinner.tsx";
import { FaCamera } from "react-icons/fa";
import "./Modalstyle.css";

interface CreatePostModalProps {
  onClose: () => void; //callback function which takes nothing and returns nothing
  isOpen: boolean;
  onSuccess: () => void; //a callback function,
  //function taking no arguments and returning nothing.
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  onClose,
  isOpen,
  onSuccess,
}) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | string>("");
  const [imageToShow, setImageToShow] = useState<File | string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // to safely access properties of an object
    //that may be null or undefined
    if (file) {
      setImage(file);
      const reader = new FileReader(); //is a javascript object which reads the contents of the file.
      reader.onloadend = () => {
        //happens when the image reading is done.
        setImageToShow(reader.result as string); //storing the image as string.
      };
      reader.readAsDataURL(file); //here it is converting into base64 encoded
      //string which can be used in src of image.
    }
  };
  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
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
        `${baseUrl}/api/posts/postnewpost`, //create a new post function
        requestOptions
      );
      if (response.ok) {
        onClose();
        onSuccess();
        setCaption("");
        setImage("");
        setImageToShow("");
        setLoading(false);
      }
    } catch (error) {
      console.log("error creating post", error);
      setLoading(false);
    }
  };

  if (!isOpen) {
    return <></>;
  }

  return (
    <>
      <div className="modal-container">
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={onClose}>
              <span>&times;</span>
            </button>
            <input
              className="caption-input"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Create fun post for your pet here..."
              required
            ></input>
            <div className="imagebuttons">
              {imageToShow && (
                <img className="modal-image" src={imageToShow as string} />
              )}
              <form onSubmit={onSubmit}>
                <input
                  style={{
                    display: "none", // Hide the default file input
                  }}
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  required
                />
                <div className="submit-camera-button">
                  <FaCamera
                    onClick={openFileInput} // Open file input when the camera icon is clicked
                    style={{
                      cursor: "pointer",
                      fontSize: "25px",
                    }}
                  />
                  <button className="submit-button" type="submit">
                    Submit
                  </button>
                  {loading && <Spinner />}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePostModal;

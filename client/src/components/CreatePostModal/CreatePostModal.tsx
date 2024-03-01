import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import getToken from "../../utils/getToken";
import baseUrl from "../../utils/baseurl";
import Spinner from "../Spinner/Spinner";
import { FaCamera } from "react-icons/fa"; // Import the camera icon

interface CreatePostModalProps {
  onClose: () => void;
  isOpen: boolean;
  onSuccess: () => void;
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
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToShow(reader.result as string);
      };
      reader.readAsDataURL(file);
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
        `${baseUrl}/api/posts/postnewpost`,
        requestOptions
      );
      if (response.ok) {
        onClose();
        onSuccess();
        setCaption("");
        setImage("");
        setImageToShow("");
        setLoading(false);
        console.log("post created");
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
      <div
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.5)", // Semi-transparent black color
          zIndex: 9999, // Ensure the backdrop is behind the modal
          top: 0,
          left: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="modal"
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "whitesmoke",
            width: "900px",
            height: "500px",
            zIndex: 10000,
            border: "solid black",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <div
            className="modal-content"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                cursor: "pointer",
                color: "black",
                marginTop: "20px",
                marginLeft: "auto",
                marginRight: "10px",
                fontSize: "25px",
                backgroundColor: "whitesmoke",
                borderColor: "transparent",
              }}
              className="close"
              onClick={onClose}
            >
              <span>&times;</span>
            </button>
            <input
              style={{
                width: "700px",
                height: "100px",

                backgroundColor: "whitesmoke",
                borderColor: "transparent",
                fontSize: "30px",
              }}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Create fun post for your pet here..."
              required
            ></input>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "column",
                marginBottom: "30px",
              }}
            >
              {imageToShow && (
                <img
                  src={imageToShow as string}
                  style={{ marginBottom: "30px" }}
                  width="300px"
                  height="200px"
                />
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
                <div
                  style={{
                    marginBottom: "30px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaCamera
                    onClick={openFileInput} // Open file input when the camera icon is clicked
                    style={{
                      cursor: "pointer",
                      fontSize: "25px",
                    }}
                  />

                  <button
                    type="submit"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "black",
                      color: "white",
                      padding: "10px 50px",
                      borderRadius: "30px",
                    }}
                  >
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

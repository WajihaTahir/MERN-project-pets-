import { ChangeEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import { UploadFileResponse } from "../../@types/index.ts";
import baseUrl from "../../utils/baseurl.ts";
import { User } from "../../@types/users.ts";
import { AuthContext } from "../../context/AuthContext.tsx";

type RegisterResponse = {
  message: string;
  error: boolean;
  data: {
    user: User;
  };
};
const Signup = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [userCredentials, setUserCredentials] = useState<User | null>(null);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const { login } = useContext(AuthContext);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log("e target", e.target.files?.[0]);
    setSelectedFile(e.target.files?.[0] || "");
  };

  const handleLoginClick = () => {
    navigate("/login"); // Navigate to the signup page
  };

  const handleInputCredentialsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserCredentials({
      ...(userCredentials as User),
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitImage = async () => {
    //picture upload
    const formdata = new FormData();
    formdata.append("userpicture", selectedFile);

    const requestOptions = {
      method: "POST",
      body: formdata,
    };
    try {
      console.log("selectedFile", selectedFile);
      const response = await fetch(
        `${baseUrl}/api/users/pictureUpload/`,
        requestOptions
      );
      console.log("response of an image fetch", response);
      if (response.ok) {
        const result = (await response.json()) as UploadFileResponse;
        console.log("Image result", result.data.imageUrl);
        setUserCredentials({
          ...(userCredentials as User),
          userpicture: result.data.imageUrl,
          public_id: result.data.public_id,
        });
        // console.log("result of signup", result);
        setProfilePicture(result.data.imageUrl);
      }
      if (!response.ok) {
        alert("couldn't get response for uploading an image.");
      }
    } catch (error) {
      console.log("error uploading image", error);
      alert("Couldn't upload image");
    }
  };

  const handleSubmitSignup = async () => {
    if (userCredentials) {
      const { password } = userCredentials;
      if (password.length < 2 || password.length > 10) {
        alert("check your password again");
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      const urlencoded = new URLSearchParams();
      urlencoded.append("email", userCredentials?.email);
      urlencoded.append("password", userCredentials.password);
      urlencoded.append("username", userCredentials?.username);
      urlencoded.append(
        "userpicture",
        userCredentials?.userpicture
          ? userCredentials.userpicture
          : "https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"
      );
      urlencoded.append(
        "public_id",
        userCredentials?.public_id ? userCredentials.public_id : ""
      );

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
      };
      try {
        const response = await fetch(
          `${baseUrl}/api/users/signup`,
          requestOptions
        );
        const result = (await response.json()) as RegisterResponse;
        console.log("result for signup", result);
        if (!result.error) {
          // If successful, navigate to the home page
          await login(userCredentials?.email, userCredentials.password);
          navigate("/");
        }
      } catch (error) {
        console.log("error signing up a userrr", error);
      }
    } else {
      console.log("enter required fields first");
    }
  };
  return (
    <>
      <div className="signup-container">
        <div className="signup-heading">
          <h2>Sign Up</h2>
        </div>
        <div className="signup-form">
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleInputCredentialsChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            onChange={handleInputCredentialsChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleInputCredentialsChange}
            required
          />
          <p style={{ fontSize: "12px", marginBottom: "10px" }}>
            Please enter password of characters length from 2 to 10
          </p>
          <input type="file" onChange={handleFileSelect} />
          <button
            onClick={handleSubmitImage}
            className="uploadpicture"
            type="submit"
          >
            Upload A Picture
          </button>
          <div style={{ marginTop: "20px" }}>
            {profilePicture ? (
              <img
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                }}
                src={profilePicture}
                alt="Profile"
                className="profile-picture"
              />
            ) : (
              <img
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                src="https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"
                alt="Empty Profile"
                className="profile-picture"
              />
            )}
          </div>
          <input onClick={handleSubmitSignup} type="submit" value="Sign Up" />
        </div>
        <div style={{ marginBottom: "40px" }}>
          <p>
            Already have an account?{" "}
            <span
              onClick={handleLoginClick}
              style={{
                cursor: "pointer",
                color: "blue",
              }}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;

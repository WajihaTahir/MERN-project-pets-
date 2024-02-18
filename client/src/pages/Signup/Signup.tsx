import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import { UploadFileResponse } from "../../@types/index.ts";
import baseUrl from "../../utils/baseurl.ts";
import { User } from "../../@types/users.ts";

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

  const handleSubmitImage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("userpicture", selectedFile);

    const requestOptions = {
      method: "POST",
      body: formdata,
    };
    try {
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
        });
      }
      if (!response.ok) {
        alert("couldn't get response for uploading an image.");
      }
    } catch (error) {
      console.log("error uploading image", error);
      alert("Couldn't upload image");
    }
  };

  const handleSubmitSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    if (userCredentials) {
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
          navigate("/");
        }
      } catch (error) {
        console.log("error signing up a userrr", error);
      }
    } else {
      console.log("enter required fields first");
    }
  };
  // return (
  //   <>
  //     <div className="signuppage">
  //       <div className="signupheading">
  //         <h2>Sign Up Here</h2>
  //       </div>
  //       <div className="fileupload">
  //         <form onSubmit={handleSubmitImage}>
  //           <input type="file" onChange={handleFileSelect} />
  //           <button type="submit">Upload A Picture</button>
  //         </form>
  //       </div>
  //       <form className="signupform" onSubmit={handleSubmitSignup}>
  //         <label htmlFor="email">Enter Email</label>
  //         <input
  //           className="emailinput"
  //           type="email"
  //           name="email"
  //           placeholder="Enter your email"
  //           onChange={handleInputCredentialsChange}
  //         />
  //         <label htmlFor="username">Enter Username</label>

  //         <input
  //           className="usernameinput"
  //           type="text"
  //           name="username"
  //           placeholder="Enter your username"
  //           onChange={handleInputCredentialsChange}
  //         />
  //         <label htmlFor="username">Enter Password</label>

  //         <input
  //           className="passwordinput"
  //           type="password"
  //           name="password"
  //           placeholder="Password"
  //           onChange={handleInputCredentialsChange}
  //         />
  //         <div>
  //           <button className="registerbutton">Register</button>
  //         </div>
  //       </form>
  //     </div>
  //   </>

  // <>
  //   <div className="body">
  //     <div style={{ marginBottom: "50px" }}>
  //       <h3>Signup</h3>
  //     </div>
  //     <AuthForm
  //       submitTitle="signup"
  //       submit={signup}
  //       isInput={true}
  //       Tag="input"
  //       ButtonTag="button"
  //     />
  //   </div>
  // </>
  return (
    <>
      <div className="signup-container">
        <div className="signup-heading">
          <h2>Sign Up</h2>
        </div>
        <form className="signup-form" action="#" onSubmit={handleSubmitSignup}>
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
          <form onSubmit={handleSubmitImage}>
            <input type="file" onChange={handleFileSelect} />
            <button className="uploadpicture" type="submit">
              Upload A Picture
            </button>
          </form>
          <input type="submit" value="Sign Up" />
        </form>
        <div className="login-link">
          <p>
            Already have an account?{" "}
            <span
              onClick={handleLoginClick}
              style={{ cursor: "pointer", color: "blue" }}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;

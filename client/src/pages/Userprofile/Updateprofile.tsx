import { ChangeEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Signup/signup.css";
import { UploadFileResponse } from "../../@types/index.ts";
import baseUrl from "../../utils/baseurl.ts";
import { User } from "../../@types/users.ts";
import { AuthContext } from "../../context/AuthContext.tsx";
import getToken from "../../utils/getToken.ts";
import Spinner from "../../components/Spinner/Spinner.tsx";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    email: user?.email ?? "",
    username: user?.username ?? "",
    userpicture: user?.userpicture ?? "",
    public_id: user?.public_id ?? "",
  });

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmitImage = async () => {
    if (!selectedFile) return;
    const formdata = new FormData();
    formdata.append("userpicture", selectedFile);

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/users/pictureUpload/`, {
        method: "POST",
        body: formdata,
      });
      if (response.ok) {
        const result = (await response.json()) as UploadFileResponse;
        setUserCredentials({
          ...userCredentials,
          userpicture: result.data.imageUrl,
          public_id: result.data.public_id,
        });
      }
      setLoading(false);
    } catch (error) {
      console.log("error uploading image", error);
      alert("Couldn't upload image");
      setLoading(false);
    }
  };

  const handleSubmitProfileUpdate = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");
      const response = await fetch(
        `${baseUrl}/api/users/updateprofile/${user?._id}`,
        {
          method: "PATCH",
          headers: myHeaders,
          body: JSON.stringify({ _id: user?._id, ...userCredentials }), //to merge id and
          //userCredential into single object to be sent as request body
        }
      );
      if (response.ok) {
        const result = (await response.json()) as User;
        setUser(result); // Update user context with the updated user data
        navigate("/userprofile"); // Redirect to the profile page
      }
      setLoading(false);
    } catch (error) {
      console.log("error updating profile", error);
      alert("Couldn't update profile");
      setLoading(false);
    }
  };

  const handleInputCredentialsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserCredentials({
      ...userCredentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {user ? (
        <div className="signup-container">
          <div className="signup-heading">
            <h2>Update Profile</h2>
          </div>
          <div className="signup-form">
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={userCredentials.email}
              onChange={handleInputCredentialsChange}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              value={userCredentials.username}
              onChange={handleInputCredentialsChange}
              required
            />
            <input type="file" onChange={handleFileSelect} />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleSubmitImage}
                className="uploadpicture"
                type="button"
                disabled={loading}
                style={{ marginRight: "10px" }}
              >
                Upload A Picture
              </button>
              {loading && <Spinner />}
            </div>
            <input
              type="submit"
              value="Update Profile"
              onClick={handleSubmitProfileUpdate}
              disabled={loading}
            />
          </div>
        </div>
      ) : (
        alert("please login to update your profile.")
      )}
    </>
  );
};

export default ProfileUpdate;

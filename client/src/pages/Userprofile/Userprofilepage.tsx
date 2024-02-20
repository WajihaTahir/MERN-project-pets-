import { useState } from "react";
import { User } from "../../@types/users";
import baseUrl from "../../utils/baseurl";
import "./Userprofilepage.css";
import { useNavigate } from "react-router";

type APIResponse<T> = {
  message: string;
  error: boolean;
  data: {
    user: T;
  };
};

function Userprofilepage() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<User>({} as User);

  const handleUpdateClick = () => {
    navigate("/updateprofile"); // Navigate to the signup page
  };

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("please login first");
    }
    if (token) {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      try {
        const response = await fetch(
          `${baseUrl}/api/users/profile`,
          requestOptions
        );
        if (response.ok) {
          const result = (await response.json()) as APIResponse<User>;
          console.log("result of user", result);
          setUserProfile({ ...userProfile, ...result.data.user });
        }
      } catch (error) {
        console.log(
          "something else happened while getting user profile",
          error
        );
      }
    }
  };
  return (
    <>
      <div className="userprofile-container ">
        <button className="getuserprofile" onClick={getProfile}>
          Click to get your profile
        </button>
        {userProfile && (
          <div>
            <h5 className="username">
              <b>Username:</b> {userProfile.username}
            </h5>
            <h5 className="useremail">
              <b>User Email:</b> {userProfile.email}
            </h5>
            <h5 className="profilepicturetext">
              <b>Profile Picture</b>
            </h5>
            <img
              className="userimage"
              src={userProfile.userpicture}
              alt={userProfile.username}
            />
          </div>
        )}
        <button className="updateuserprofile" onClick={handleUpdateClick}>
          Update Your profile
        </button>
      </div>
    </>
  );
}

export default Userprofilepage;

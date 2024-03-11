import { useContext, useEffect, useState } from "react";
import { User } from "../../@types/users";
import baseUrl from "../../utils/baseurl";
import "./Getuserprofilepage.css";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import getToken from "../../utils/getToken";

type APIResponse<T> = {
  message: string;
  error: boolean;
  data: {
    user: T;
  };
};

function Userprofilepage() {
  const { user, deleteUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<User>({} as User);

  const handleDeleteAccount = (user?: User) => {
    if (user) {
      if (window.confirm("Are you sure you want to delete Fur Pal Account?"))
        deleteUser(user);
    }
  };

  const handleUpdateClick = () => {
    navigate("/updateprofile");
  };

  const getProfile = async () => {
    const token = getToken();
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
        console.log("response of user", response);
        if (response.ok) {
          const result = (await response.json()) as APIResponse<User>;
          // console.log("result of user", result);
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

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      {user && (
        <div className="userprofile-container ">
          {userProfile && (
            <div>
              <h5 className="username1">
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
          <button
            className="deleteuserprofile"
            onClick={() => {
              handleDeleteAccount(user ?? undefined);
            }}
          >
            Delete Your profile
          </button>
        </div>
      )}
    </>
  );
}

export default Userprofilepage;

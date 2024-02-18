import { useState } from "react";
import { User } from "../../@types/users";
import baseUrl from "../../utils/baseurl";

type APIResponse<T> = {
  message: string;
  error: boolean;
  data: {
    user: T;
  };
};

function Userprofilepage() {
  const [userProfile, setUserProfile] = useState<User>({} as User);

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
          setUserProfile(result.data.user);
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
      <button onClick={getProfile}>Click to get your profile</button>
      {userProfile && (
        <div>
          <h5>Username: {userProfile.username}</h5>
          <h5>User Email: {userProfile.email}</h5>
          <img
            src={userProfile.userpicture}
            alt={userProfile.username}
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      )}
    </>
  );
}

export default Userprofilepage;

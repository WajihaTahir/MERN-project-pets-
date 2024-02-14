import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [email, setEmail] = useState(user ? user.email : "");
  const [username, setUsername] = useState(user ? user.username : "");
  const [userpicture, setUserPicture] = useState(user ? user.userpicture : "");

  const handleSubmit = async () => {
    updateUser({ email, username, userpicture });
  };
  if (!user)
    return (
      <div>
        <p>Please login first</p>
      </div>
    );

  if (user)
    return (
      <div>
        <h1>{user ? user.username : "Anonymous user"} Profile</h1>
        <input
          type="email"
          value={email}
          placeholder={user.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          value={username}
          placeholder={user.username ? user.username : "Choose A Username"}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="file"
          value={userpicture}
          placeholder={
            user.userpicture ? user.userpicture : "Choose another picture"
          }
          onChange={(e) => setUserPicture(e.target.value)}
        />
        <button type="submit">Upload A Picture</button>
        <button onClick={handleSubmit}>Update the data</button>
      </div>
    );
};

export default Profile;

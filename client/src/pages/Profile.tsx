import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";

const Profile = () => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const [email, setEmail] = useState(user ? user.email : "");
  const [username, setUsername] = useState(user ? user.username : "");
  const navigate = useNavigate();

  const logoutUser = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async () => {
    updateUser({ email, username });
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
        <h1>{user ? user.username : "Anonymous user"} User's Profile</h1>
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
        <button onClick={handleSubmit}>Update the data</button>
        {user && (
          <p className="logout" onClick={logoutUser}>
            Logout
          </p>
        )}
      </div>
    );
};

export default Profile;

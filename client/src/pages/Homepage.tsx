import { useContext } from "react";
import "../Home.css";
import { AuthContext } from "../context/AuthContext";

const Homepage = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="homebody">
        <h2 className="homeheading">Fur Pals</h2>
        <p>Here you can find some adorable fur buddies!</p>
        {user && <p>{user.username}</p>}
      </div>
    </>
  );
};

export default Homepage;

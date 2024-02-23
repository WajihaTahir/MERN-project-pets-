import { useContext } from "react";
import "./Home.css";
import { AuthContext } from "../../context/AuthContext";
const Homepage = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="homebody">
        <h2 className="homeheading">Fur Pals</h2>
        {!user ? (
          <p style={{ marginBottom: "650px" }}>
            Here you can find some adorable fur buddies!
          </p>
        ) : (
          <p>Here you can find some adorable fur buddies!</p>
        )}

        {user && <p style={{ marginBottom: "100px" }}>{user.username}</p>}
        {user && (
          <h2 className="text-animation" style={{ marginTop: "650px" }}>
            Meow!, Jazz
          </h2>
        )}
      </div>
    </>
  );
};

export default Homepage;

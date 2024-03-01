import { useContext } from "react";
import "./Home.css";
import { AuthContext } from "../../context/AuthContext";
import image1 from "../../assets/Screenshot.jpg";
const Homepage = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="homebody">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "300px",
          }}
        >
          <img src={image1} style={{ width: "90px", height: "150px" }}></img>

          <h2 className="homeheading">Fur Pals</h2>
        </div>
        {!user && <p>Here you can find some adorable fur buddies!</p>}

        {user && (
          <p>
            Here you can find some adorable fur buddies!<br></br>
            {user.username}
          </p>
        )}
      </div>
    </>
  );
};

export default Homepage;

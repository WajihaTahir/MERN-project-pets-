import { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import "./ProtectedRoute.css";
function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const redirect = useNavigate();
  const handleClick = () => {
    redirect("/login", { replace: true });
  };

  return (
    <>
      {user ? (
        children
      ) : (
        <div className="redirect">
          <p>This area is only accessible by logged-in users. Please Login</p>
          <button className="pleaselogin" onClick={handleClick}>
            Login Here
          </button>
        </div>
      )}
    </>
  );
}

export default ProtectedRoute;

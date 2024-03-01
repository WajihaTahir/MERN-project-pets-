import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="menu">
        <div className="menuitem one">
          <NavLink to={"/"}>
            <p>Home</p>
          </NavLink>{" "}
        </div>

        {!user ? (
          <div className="menuitem three">
            <NavLink to={"/login"}>
              <p>Login</p>
            </NavLink>
          </div>
        ) : (
          <>
            <div className="menuitem threehalf">
              <NavLink onClick={logout} to={"/"}>
                Logout
              </NavLink>
            </div>
          </>
        )}

        {!user && (
          <div className="menuitem four">
            <NavLink to={"/signup"}>
              <p>Signup</p>
            </NavLink>
          </div>
        )}

        {user && (
          <div className="menuitem four">
            <NavLink to={"/posts"}>
              <p>All Pet Posts</p>
            </NavLink>
          </div>
        )}

        {user && (
          <div className="menuitem six">
            <NavLink to={"/userprofile"}>
              <p>User Profile</p>
            </NavLink>
          </div>
        )}
        {user && (
          <div className="menuitem seven">
            <NavLink to={"/createnewpost"}>
              <p>New Post</p>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}
export default Navbar;

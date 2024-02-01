import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav>
      <div className="navbar">
      <div className="menu">
        <div className="menuitem one">
          <NavLink to={"/"}><p>Home</p></NavLink>{" "}
        </div>
        <div className="menuitem two">
          <NavLink to={"/users"}><p>Users</p></NavLink>
        </div>
        <div className="menuitem three">
          {!user ? (
            <NavLink to={"/auth"}><p>Login</p></NavLink>
          ) : (
            <>
              <NavLink to={"/profile"}>Profile</NavLink>
              <button onClick={logout}>Logout</button>
            </>
          )}
          {user && <p>{user.email}</p>}
        </div>
      </div>
      </div>
    </nav>
  );
}
export default Navbar;

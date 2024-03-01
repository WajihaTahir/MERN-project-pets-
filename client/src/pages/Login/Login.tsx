import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import "./login.css";

type LoginCredentials = {
  email: string;
  password: string;
};

const Login = () => {
  const { user, login } = useContext(AuthContext); //imported login function from authContext
  const navigate = useNavigate(); // Use useNavigate hook to get navigation function

  const [loginCredentials, setLoginCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value", e.target.name, e.target.value);
    setLoginCredentials({
      ...loginCredentials,
      [e.target.name]: e.target.value,
    });
  };
  const handleSignUpClick = () => {
    navigate("/signup"); // Navigate to the signup page
  };
  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(loginCredentials.email, loginCredentials.password);
  };

  return (
    <>
      <div className="login-container">
        <div className="login-heading">
          <h2>Login</h2>
        </div>
        <form className="login-form" action="#" onSubmit={handleSubmitLogin}>
          <input
            type="email"
            value={loginCredentials?.email}
            name="email"
            placeholder="Enter Email"
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={loginCredentials?.password}
            onChange={handleInputChange}
            required
          />
          <input type="submit" value="Login" />
        </form>
        <div className="sign-up-link">
          <p style={{ marginTop: "70px" }}>
            Don't have an account?{" "}
            <span
              onClick={handleSignUpClick}
              style={{ cursor: "pointer", color: "blue" }}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </>
  );
};
export default Login;

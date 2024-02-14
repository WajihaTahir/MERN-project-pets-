import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import "./login.css";

type LoginCredentials = {
  email: string;
  password: string;
};

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const [loginCredentials, setLoginCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log("e.target.value", e.target.name, e.target.value);
    setLoginCredentials({
      ...loginCredentials,
      [e.target.name]: e.target.value,
    });
  };

  if (user) {
    return <Navigate to="/posts" />;
  }

  const handleSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(loginCredentials.email, loginCredentials.password);
  };
  return (
    <>
      <div className="loginform">
        <div className="loginheading">
          <h2>Login Here</h2>
        </div>
        <form action="" onSubmit={handleSubmitLogin}>
          <label htmlFor="email">Enter Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={loginCredentials?.email}
            onChange={handleInputChange}
          />
          <label htmlFor="password">Enter Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={loginCredentials?.password}
            onChange={handleInputChange}
          />
          <button className="loginbutton" type="submit">
            Login
          </button>
        </form>
      </div>

      {/* <div className="body">
        <div style={{ marginBottom: "50px" }}>
          <h3>Login</h3>
        </div>
        <AuthForm submitTitle="login" submit={login} />
      </div> */}
    </>
  );
};
export default Login;

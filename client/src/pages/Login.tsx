import { useContext } from "react";
import AuthForm from "../components/AuthForm";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import "../login.css";

const Login = () => {
  const { user, login } = useContext(AuthContext);

  if (user) {
    return <Navigate to ="/posts" />;
  }
  return (
    <>
      <div className="body">
        <div style={{ marginBottom: "50px" }}>
          <h3>Login</h3>
        </div>
        <AuthForm submitTitle="login" submit={login} />
      </div>
    </>
  );
};
export default Login;

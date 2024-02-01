import { useContext } from "react";
import AuthForm from "../components/AuthForm";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import "../auth.css"

const AuthPage = () => {
  const { user, login, signup } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <div className="body">
        <h1>Login or Signup here</h1>
       
          <div style={{ borderRight: "solid black 2px" }}>
            <h1>Login</h1>
            <AuthForm submitTitle="login" submit={login} />
          </div>

            <h1>Sign up</h1>
            <AuthForm submitTitle="signup" submit={signup} />
        </div>
    </>
  );
};
export default AuthPage;

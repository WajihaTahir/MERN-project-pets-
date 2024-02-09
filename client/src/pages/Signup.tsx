import AuthForm from "../components/AuthForm.tsx";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../login.css";

const Signup = () => {
  const { signup } = useContext(AuthContext);

  return (
    <>
      <div className="body">
        <div style={{ marginBottom: "50px" }}>
          <h3>Signup</h3>
        </div>
        <AuthForm
          submitTitle="signup"
          submit={signup}
          isInput={true}
          Tag="input"
          ButtonTag="button"
        />
      </div>
    </>
  );
};

export default Signup;

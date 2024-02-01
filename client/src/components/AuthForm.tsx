import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

type Props = {
  // It describes the expected props for the AuthForm component.
  submitTitle: string;
  submit: (email: string, password: string) => void; //A function that takes two parameters
  //(email and password, both of type string) and returns void (no return value).
};

const AuthForm = ({ submitTitle, submit }: Props) => {
  //receives the submitTitle and submit props from the Props type.
  const { loading } = useContext(AuthContext);
  const [inputValues, setInputValues] = useState({ email: "", password: "" }); //The initial values are set to empty strings.

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //prevents the default form submission behavior,
    //which typically involves a page refresh.
    e.preventDefault();
    if (!inputValues.email || !inputValues.password)
      return alert("All fields must be included");
    submit(inputValues.email, inputValues.password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({ ...inputValues, [e.target.type]: e.target.value }); //taking the type so we know which property to update. 
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <input
        type="email"
        placeholder="Enter your email"
        value={inputValues.email}
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="Password"
        value={inputValues.password}
        onChange={handleChange}
      />
      <button type="submit">{loading ? "Loading..." : submitTitle}</button>
    </form>
  );
};

export default AuthForm;


import { ChangeEvent, MouseEvent, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { UploadFileResponse } from "../@types";
import baseUrl from "../utils/baseurl";

type Props = {
  // It describes the expected props for the AuthForm component.
  submitTitle: string;
  submit: (email: string, password: string) => Promise<void>; //A function that takes two parameters
  Tag?: React.ElementType;
  isInput: boolean;
  ButtonTag?: React.ElementType;

  //(email and password, both of type string) and returns void (no return value).
};

const AuthForm = ({ submitTitle, submit, Tag, isInput, ButtonTag }: Props) => {
  //receives the submitTitle and submit props from the Props type.
  const { loading } = useContext(AuthContext);
  const [inputValues, setInputValues] = useState({ email: "", password: "" }); //The initial values are set to empty strings.
  const [selectedFile, setSelectedFile] = useState<File | string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("handleSubmit");
    //prevents the default form submission behavior,
    //which typically involves a page refresh.
    e.preventDefault();
    if (!inputValues.email || !inputValues.password )
      return alert("All fields must be included");
    await submit(inputValues.email, inputValues.password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({ ...inputValues, [e.target.type]: e.target.value }); //taking the type so we know which property to update.
  };

  const handleFileChange = (e: ChangeEvent<HTMLFormElement>) => {
    // console.log("target", e);
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmitFile = async (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData();
    console.log("selected file", selectedFile);
    formdata.append("userpicture", selectedFile);

    const requestOptions = {
      method: "POST",
      body: formdata,
      // redirect: "follow",
    };
    try {
      const response = await fetch(
        `${baseUrl}/api/users/pictureUpload/`,
        requestOptions
      );
      if (!response.ok) {
        console.log("something happened while submitting file");
      }
      if (response.ok) {
        const result = (await response.json()) as UploadFileResponse;
        console.log("result >> result submitting file", result);
      }
    } catch (error) {
      console.log("error submitting file", error);
    }
  };

  return (
    <>
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
          style={{ borderRadius: "10px", padding: "10px", width: "300px" }}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          value={inputValues.password}
          style={{ borderRadius: "10px", padding: "10px", width: "300px" }}
          onChange={handleChange}
        />

        {isInput && (
          <div>
            {Tag && <Tag type="file" onChange={handleFileChange} />}
           {ButtonTag &&<ButtonTag
              style={{
                borderRadius: "5px",
                marginTop: "30px",
                padding: "5px",
                width: "100px",
                marginBottom: "30px",
              }}
              onClick={handleSubmitFile}
            >
              Upload picture
            </ButtonTag>}
          </div>
        )}
        <button
          style={{ borderRadius: "10px", padding: "10px", width: "300px" }}
          type="submit"
        >
          {loading ? "Loading..." : submitTitle}
        </button>
      </form>
    </>
  );
};

export default AuthForm;

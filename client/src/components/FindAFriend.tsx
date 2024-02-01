import { useState, useRef } from "react";
import { User } from "../@types/users.ts";
import baseUrl from "../utils/baseurl";

const FindAFriend = () => {
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const inputValue = useRef("");
  const [error, setError] = useState("");

  const handleClick = async () => {
    setError("");
    if (!inputValue.current) return alert("you have to type something");
    try {
      const response = await fetch(
        `${baseUrl}/api/users/find/${inputValue.current}`
      );
      if (!response.ok) {
        const result = (await response.json()) as ResNotOk;
        setError(result.error)
        return console.log(result);
      }
      const result = await response.json() as User;
      setFoundUser(result);
    } catch (e) {
      console.log(e);
      setError("Something went wrong...");
    }
  };

  const clear = () => {
    setFoundUser(null);
    setError("");
    inputValue.current = "";
    const input: HTMLInputElement | null =
      document.querySelector("input[type='text']");
    if (input) input.value = "";
  };

  return (
    <>
      <h1> Find A Friend </h1>
      <label>Find A User:</label>
      <input
        type="text"
        onChange={(e) => (inputValue.current = e.target.value)}
      />
      <button onClick={handleClick}>Find a user</button>
      <button onClick={clear}>Clear</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {foundUser && (
        <div>
          <h3>Found this user:</h3>
          <p>{foundUser.email}</p>
        </div>
      )}
    </>
  );
};

export default FindAFriend;

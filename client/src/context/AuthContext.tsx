import { useState, createContext, PropsWithChildren, useEffect } from "react";
import { User, LoginResponse } from "../@types/users";
import baseUrl from "../utils/baseurl";
import { ResNotOk } from "../@types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, username: string) => Promise<void>;
  updateUser: (values: {
    email: string;
    username: string | undefined;
    userpicture: string | undefined;
  }) => Promise<void>;
  loading: boolean;
}

const defaultValue: AuthContextType = {
  user: null,
  login: () => {
    throw new Error("no provider");
  },
  logout: () => {
    throw new Error("no provider");
  },
  signup: () => {
    throw new Error("no provider");
  },
  updateUser: () => {
    throw new Error("no provider");
  },
  loading: false,
};

export const AuthContext = createContext(defaultValue);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(false);

  const signup = async (email: string, password: string, username: string) => {
    if (!email || !password || !username)
      return alert("All fields must be included.");

    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    const body = new URLSearchParams();
    body.append("email", email);
    body.append("password", password);
    const requestOptions = {
      method: "POST", //have to include the method if other than get
      headers,
      body,
    };
    try {
      const response = await fetch(
        `${baseUrl}/api/users/signup`,
        requestOptions
      ); //adding as a second parameter to the fetch.
      if (response.ok) {
        const result = (await response.json()) as User;
        setUser(result);
      } else {
        const result = (await response.json()) as ResNotOk;
        console.log(result);
      }
    } catch (error) {
      console.log("errorrr signing up at auth context", error);
    }
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      alert("Some fields are missing");
      return;
    }

    //create request for our backend

    if (email && password) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const urlencoded = new URLSearchParams();
      urlencoded.append("email", email);
      urlencoded.append("password", password);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
      };

      try {
        const response = await fetch(
          `${baseUrl}/api/users/login`,
          requestOptions
        );

        if (!response.ok) {
          console.log("response not okay for login");
          alert("invalid user email or password");
        }

        if (response.ok) {
          const result = (await response.json()) as LoginResponse;
          console.log("result response", result);
          //set the user information
          if (result.data.token) {
            localStorage.setItem("token", result.data.token);
            console.log("result.data.user", result.data.user);
            setUser(result.data.user);
          }
        }
      } catch (error) {
        console.log("error loggin in user", error);
      }
    }
  };

  const updateUser = async (values: {
    email: string;
    username: string | undefined;
    userpicture: string | undefined;
  }) => {
    //validation - check email format
    if (!user) return;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const body = JSON.stringify(values);
    const requestOptions = {
      method: "PATCH",
      headers,
      body,
    };
    console.log("reqopts", requestOptions);
    try {
      console.log("user._id", user);
      const response = await fetch(
        `${baseUrl}/api/users/updateprofile/${user._id}`,
        requestOptions
      );
      if (response.ok) {
        const result = (await response.json()) as User;
        setUser(result);
      } else {
        const result = (await response.json()) as ResNotOk;
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkUserStatus = async () => {
    const token = localStorage.getItem("token");

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    const getUserProfile = await fetch(
      `${baseUrl}/api/users/profile`,
      requestOptions
    );
    if (getUserProfile.ok) {
      const result = await getUserProfile.json();
      console.log("checkUserStatusresult", result);
      setUser({ ...user, ...result.data.user });
    }

    if (token) {
      console.log("user is logged in because token");
    } else {
      console.log("user is not logged in because token");
    }
  };

  const logout = () => {
    //remove token from local storage
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    checkUserStatus();
  }, [user?.email]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signup,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

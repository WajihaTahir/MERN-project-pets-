import { useState, createContext, PropsWithChildren, useEffect } from "react";
import { User, LoginResponse } from "../@types/users";
import baseUrl from "../utils/baseurl";
import { ResNotOk } from "../@types";
import getToken from "../utils/getToken";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (values: {
    //to be used in updateProfile page
    email: string;
    username: string | undefined;
    userpicture: string | undefined;
  }) => Promise<void>;
  loading: boolean;
  setUser: (user: User) => void;
}

const defaultValue: AuthContextType = {
  user: null,
  login: () => {
    throw new Error("no provider");
  },
  logout: () => {
    throw new Error("no provider");
  },
  updateUser: () => {
    throw new Error("no provider");
  },
  setUser: () => {},

  loading: false,
};

export const AuthContext = createContext(defaultValue);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(false);

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
    const token = getToken();
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
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
        console.log("result((((", result);
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
    const token = getToken();
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
        updateUser,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

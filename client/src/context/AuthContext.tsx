import { useState, createContext, PropsWithChildren, useEffect } from "react";
import { User, LoginResponse } from "../@types/users";
import baseUrl from "../utils/baseurl";
import getToken from "../utils/getToken";
import { useNavigate } from "react-router";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  setUser: (user: User) => void;
  deleteUser: (user: User) => Promise<void>;
}

const defaultValue: AuthContextType = {
  user: null,
  login: () => {
    throw new Error("no provider");
  },
  logout: () => {
    throw new Error("no provider");
  },
  setUser: () => {},

  loading: false,
  deleteUser: () => {
    throw new Error("no provider");
  },
};

export const AuthContext = createContext(defaultValue);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(false);
  const navigate = useNavigate();

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
          alert("invalid user email or password :( , Try again ?");
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

  const deleteUser = async (user: User) => {
    const token = getToken();
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
    };

    await fetch(`${baseUrl}/api/users/user/${user._id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        logout();
        navigate("/");
      })
      .catch((error) => console.log("error", error));
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
        setUser,
        deleteUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

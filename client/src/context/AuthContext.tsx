import { useState, createContext, PropsWithChildren } from "react";
import { User } from "../@types/users";
import baseUrl from "../utils/baseurl";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
  updateUser: (values: {
    email: string;
    username: string | undefined;
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
  const [loading, setLoading] = useState(false);

  const signup = async (email: string, password: string) => {
    if (!email || !password) return alert("All fields must be included.");

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
      console.log(error);
    }
  };

  const login = async (email: string, password: string) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    const body = new URLSearchParams();
    body.append("email", email);
    body.append("password", password);
    const requestOptions = {
      method: "POST",
      headers,
      body,
    };
    try {
      const response = await fetch(
        `${baseUrl}/api/users/login`,
        requestOptions
      );
      if (response.ok) {
        const result = await response.json() as User;
        setUser(result);
      } else {
        const result = await response.json() as ResNotOk;
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (values: {
    email: string;
    username: string | undefined;
  }) => {
    //validation - check email format
    if (!user) return;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const body = JSON.stringify(values);
    const requestOptions = {
      method: "POST",
      headers,
      body,
    };
    try {
      const response = await fetch(
        `${baseUrl}/api/users/update/${user._id}`,
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

  const logout = () => {
    setUser(null);
  };

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

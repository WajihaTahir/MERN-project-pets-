import React from "react";
import ReactDOM from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Error404 from "./pages/Error404.tsx";
import Homepage from "./pages/Homepage/Homepage.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import Profile from "./pages/Userprofile/Profile.tsx";
import Signup from "./pages/Signup/Signup.tsx";
import Login from "./pages/Login/Login.tsx";
import Allposts from "./pages/Allposts/Allposts.tsx";
import Footer from "./components/Footer/Footer.tsx";

const router = createBrowserRouter([
  {
    element: (
      <AuthContextProvider>
        <Layout>
          <Outlet />
          <Footer />
        </Layout>
      </AuthContextProvider>
    ),
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      // {
      //   path: "/users",
      //   element: <Users />,
      // },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },

      {
        path: "/signup",
        element: <Signup />,
      },

      {
        path: "/posts",
        element: <Allposts />,
      },
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

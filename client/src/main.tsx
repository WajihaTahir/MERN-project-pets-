import React from "react";
import ReactDOM from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout.tsx";
import Error404 from "./pages/Error404.tsx";
import Homepage from "./pages/Homepage/Homepage.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import Profile from "./pages/Userprofile/Updateprofile.tsx";
import Signup from "./pages/Signup/Signup.tsx";
import Login from "./pages/Login/Login.tsx";
import Allposts from "./pages/Allposts/Allposts.tsx";
import UserPosts from "./pages/UserPosts/UserPosts.tsx";
import Userprofilepage from "./pages/Userprofile/Getuserprofilepage.tsx";
import CreateNewPost from "./pages/CreateNewPost/CreateNewPost.tsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
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
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/updateprofile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/updatepost",
        element: (
          <ProtectedRoute>
            <CreateNewPost />
          </ProtectedRoute>
        ),
      },
      {
        path: "/createnewpost",
        element: (
          <ProtectedRoute>
            <CreateNewPost />
          </ProtectedRoute>
        ),
      },

      {
        path: "/userprofile",
        element: (
          <ProtectedRoute>
            <Userprofilepage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup",
        element: <Signup />,
      },

      {
        path: "/posts",
        element: (
          <ProtectedRoute>
            <Allposts />
          </ProtectedRoute>
        ),
      },

      {
        path: "/userposts",
        element: (
          <ProtectedRoute>
            <UserPosts />
          </ProtectedRoute>
        ),
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

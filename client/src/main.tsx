import React from "react";
import ReactDOM from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Error404 from "./pages/Error404.tsx";
import Homepage from "./pages/Homepage.tsx";
import Users from "./pages/Users.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import Profile from "./pages/Profile.tsx";

const router = createBrowserRouter([
  {
    element: (
      <AuthContextProvider>
        <Layout>
          <Outlet />
        </Layout>
      </AuthContextProvider>
    ),
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        path: "/profile",
        element: <Profile />,
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
    <RouterProvider router={router}/>
  </React.StrictMode>
);

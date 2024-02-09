import React from "react";
import Navbar from "./Navbar"
import Footer from "./Footer";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <div style={{ textAlign: "center" }}>{children}</div>
      
    </>
  );
}

export default Layout;

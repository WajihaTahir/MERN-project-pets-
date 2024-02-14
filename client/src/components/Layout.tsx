import React from "react";
import Navbar from "./Navbar/Navbar";

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

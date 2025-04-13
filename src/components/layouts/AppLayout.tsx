"use client"

import { userContext } from "@/src/context/UserContext";
import { ReactNode, useContext } from "react";
import Navbar from "./Navbar";

export default function AppLayout({ children, activeMenu }:{ children:ReactNode, activeMenu:string }) {
  const { user } = useContext(userContext);
  return(
    <>
      <Navbar activeMenu={activeMenu} />
    {user &&
      <main className="m-5">
        {children}
      </main>
    }
    </>
  );
};
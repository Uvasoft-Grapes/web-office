"use client"

import { useRouter } from "next/navigation";
import { ReactNode, useContext, useEffect } from "react";
import { userContext } from "@context/UserContext";
import Loader from "@components/Loader";

export default function ProtectedRoute({ children, allowedRoles }:Readonly<{allowedRoles:string[]; children:ReactNode; }>) {
  const { user, desk, loading, clearUser } = useContext(userContext);
    const router = useRouter();
  
  useEffect(() => {
    if(loading) return;
    if(!user) return clearUser();
    if(!desk) return router.push("/auth/desk");
    return ()=>{};
  },[user, desk, loading, clearUser, router]);

  if(loading) return (
    <Loader/>
  );

  if(user) {
    if(!allowedRoles.includes(user.role)) {
      router.push("/dashboard");
    } else {
      return children;
    };
  };
};
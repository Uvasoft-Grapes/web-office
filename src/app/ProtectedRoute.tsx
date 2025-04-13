"use client"

import { useRouter } from "next/navigation";
import { ReactNode, useContext, useEffect } from "react";
import { userContext } from "../context/UserContext";
import Loader from "../components/Loader";

export default function ProtectedRoute({ children, allowedRoles }:Readonly<{allowedRoles:string[]; children:ReactNode; }>) {
  const { user, loading, clearUser } = useContext(userContext);
    const router = useRouter();
  
  useEffect(() => {
    if(loading) return;
    if(user) return;
    if(!user) {
      clearUser();
      router.push("/auth/login");
    };
  },[user, loading, clearUser, router]);

  if(loading) return (
    <Loader/>
  );

  if(user) {
    if(!allowedRoles.includes(user.role)) {
      if(user.role === "admin") router.push("/admin/dashboard");
      if(user.role === "user") router.push("/user/dashboard");
    } else {
      return children;
    };
  };
};
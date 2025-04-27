"use client"

import { createContext, ReactNode, useEffect, useState } from "react";
import axiosInstance from "@utils/axiosInstance";
import { API_PATHS } from "@utils/apiPaths";
import { TypeDesk, TypeUser } from "@utils/types";
import { useRouter } from "next/navigation";

export const userContext = createContext<{ user:TypeUser|undefined, desk:TypeDesk|undefined, loading:boolean, updateUser:(userData:TypeUser)=>void, clearUser:()=>void, changeDesk:(deskData:TypeDesk|undefined)=>void }>({ user:undefined, desk:undefined, loading:true, updateUser:()=>{}, clearUser:()=>{}, changeDesk:()=>{} });

export default function UserProvider({ children }:{ children:ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<TypeUser|undefined>();
  const [desk, setDesk] = useState<TypeDesk|undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(user) return;
    const accessToken = localStorage.getItem("token");
    if(!accessToken) return setLoading(false);
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(res.data);
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
      };
    };

    fetchUser();
  },[]);

  const updateUser = (userData:TypeUser) => {
    if(!userData.token) return;
    setUser(userData);
    localStorage.setItem("token", userData.token);
    setLoading(false);
  };

  const clearUser = () => {
    setUser(undefined);
    localStorage.removeItem("token");
    sessionStorage.removeItem("desk");
    router.push("/auth/login");
  };

  const changeDesk = (desk:TypeDesk|undefined) => {
    setDesk(desk);
    if(!desk) return router.push("/auth/desk");
    router.push("/dashboard");
  };

  return(
    <userContext.Provider value={{ user, desk, loading, updateUser, clearUser, changeDesk }}>
      {children}
    </userContext.Provider>
  );
};
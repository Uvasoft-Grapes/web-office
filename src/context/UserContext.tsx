"use client"

import { createContext, ReactNode, useEffect, useState } from "react";
import axiosInstance from "@utils/axiosInstance";
import { API_PATHS } from "@utils/apiPaths";
import { TypeUser } from "../utils/types";

export const userContext = createContext<{ user:TypeUser|undefined, loading:boolean, updateUser:(userData:TypeUser)=>void, clearUser:()=>void }>({ user:undefined, loading:true, updateUser:()=>{}, clearUser:()=>{} });

export default function UserProvider({ children }:{ children:ReactNode }) {
  const [user, setUser] = useState<TypeUser|undefined>();
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
  };

  return(
    <userContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </userContext.Provider>
  );
};
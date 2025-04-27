"use client"

import SkeletonCard from "@components/cards/SkeletonCard";
import UserCard from "@components/cards/UserCard";
import AppLayout from "@components/layouts/AppLayout";
import Modal from "@components/Modal";
import { API_PATHS } from "@utils/apiPaths";
import axiosInstance from "@utils/axiosInstance";
import { TypeUser } from "@utils/types";
import ProtectedRoute from "@app/ProtectedRoute";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<TypeUser[]|undefined>();
  const [openToken, setOpenToken] = useState(false);
  const [tokenType, setTokenType] = useState<"admin"|"user">("user");
  const [token, setToken] = useState("");

  const getAllUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      setAllUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    };
  };

  const createToken = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USERS.GET_TOKEN(tokenType));
      setToken(res.data);
      toast.success("Listo, copia el token.");
    } catch (error) {
      console.error("Error generating token", error);
      toast.error("Error, al generar el token.");
    }
  };

  useEffect(() => {
    getAllUsers();
    return () => {};
  },[]);

  return(
    <ProtectedRoute allowedRoles={["admin"]}>
      <AppLayout activeMenu="Usuarios">
        <div className="mt-5 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <h2 className="font-medium text-2xl md:text-3xl text-primary-dark dark:text-primary-light">Usuarios</h2>
            <button onClick={()=>setOpenToken(true)} className="card-btn-fill">Crear token</button>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
            {allUsers === undefined ?
            [1,2,3].map((i) => (
              <div key={i} className="min-h-28 min-w-full md:min-w-1/2 xl:min-w-1/3">
                <SkeletonCard/>
              </div>
            ))
            :
            allUsers.map((user) => (
              <UserCard key={user._id} info={user}/>
            ))
            }
          </ul>
        </div>
      {openToken && 
        <Modal title="Crear Token" isOpen={openToken} onClose={()=>setOpenToken(false)}>
          <div className="flex flex-col gap-4">
            <h4 className="text-primary-dark dark:text-primary-light">Elige un tipo de usuario</h4>
            <div className="flex gap-2">
              <button onClick={()=>setTokenType("admin")} className={`w-20 h-8 rounded-md font-medium text-sm border-2 border-primary-dark dark:border-primary-light ${tokenType === "admin" ? "text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light" : "text-primary-dark dark:text-primary-light bg-transparent opacity-75"} cursor-pointer duration-300`}>Admin</button>
              <button onClick={()=>setTokenType("user")} className={`w-20 h-8 rounded-md font-medium text-sm border-2 border-primary-dark dark:border-primary-light ${tokenType === "user" ? "text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light" : "text-primary-dark dark:text-primary-light bg-transparent opacity-75"} cursor-pointer duration-300`}>User</button>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full flex justify-between gap-3 px-4 py-3 mb-4 mt-3 rounded bg-secondary-light focus-within:bg-primary-light dark:bg-secondary-dark dark:focus-within:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark outline-none duration-300">
                <input type="text" name="token" placeholder="Token" value={token} disabled={true} className="w-full bg-transparent outline-none font-medium text-primary-dark dark:text-primary-light"/>
              </div>
              <div className="">
                <button type="button" onClick={createToken} className="card-btn-fill">Generar Token</button>
              </div>
            </div>
          </div>
        </Modal>
      }
      </AppLayout>
    </ProtectedRoute>
  );
};
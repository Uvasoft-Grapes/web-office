"use client"

import { useEffect, useState } from "react";
import { API_PATHS } from "@utils/apiPaths";
import axiosInstance from "@utils/axiosInstance";
import { ROLES_DATA } from "@utils/data";
import { TypeUser } from "@utils/types";
import ProtectedRoute from "@app/ProtectedRoute";
import AppLayout from "@components/layouts/AppLayout";
import UserCard from "@components/users/Card";
import Skeleton from "@components/Skeleton";
import DropdownSelect from "@components/inputs/Dropdown";

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<TypeUser[]|undefined>();
  const [role, setRole] = useState("");

  const getAllUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.DESKS.GET_MEMBERS, {
        params:{
          role,
        },
      });
      setAllUsers(res.data.members);
    } catch (error) {
      console.error("Error fetching users:", error);
    };
  };

  useEffect(() => {
    getAllUsers();
    return () => {};
  },[role]);

  return(
    <ProtectedRoute>
      <AppLayout activeMenu="Miembros">
        <div className="">
          <section className="flex flex-wrap items-center justify-between gap-3 w-full">
            <h2 className="font-medium text-2xl md:text-3xl text-basic">Miembros</h2>
            <div className="flex flex-wrap justify-end gap-2 min-w-full md:min-w-fit">
              <div className="flex-1 min-w-48 ">
                <DropdownSelect disabled={!allUsers ? true : false} options={[{ label:"Todos", value:"" }, ...ROLES_DATA]} defaultValue="" placeholder="Rol" handleValue={(value)=>setRole(value)}/>
              </div>
            </div>
          </section>
          <ul className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 mt-4">
            {allUsers === undefined ?
            [1,2].map((i) => (
              <div key={i} className="flex min-h-36 min-w-full md:min-w-1/2 xl:min-w-1/3">
                <Skeleton/>
              </div>
            ))
            :
            allUsers.map((user) => (
              <UserCard key={user._id} info={user}/>
            ))
            }
          </ul>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};
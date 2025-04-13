"use client"

import UserCard from "@/src/components/cards/UserCard";
import AppLayout from "@/src/components/layouts/AppLayout";
import { API_PATHS } from "@/src/utils/apiPaths";
import axiosInstance from "@/src/utils/axiosInstance";
import { TypeUser } from "@/src/utils/types";
import ProtectedRoute from "@app/ProtectedRoute";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<TypeUser[]>([]);

  const getAllUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      console.log(res)
      setAllUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    };
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
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
            {allUsers.map((user) => (
              <UserCard key={user._id} info={user}/>
            ))}
          </ul>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};

// const handleDownloadReport = async () => {
  //   try {
  //     const res = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS_USERS, { responseType:"blob" });
  //     console.log(res);
  //     const url = window.URL.createObjectURL(new Blob([res.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", "user_tasks_details.xlsx");
  //     document.body.appendChild(link);
  //     link.click();
  //     link.parentNode?.removeChild(link);
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Error downloading users tasks report:", error)
  //     toast.error("Error al descargar el reporte.");
  //   }
  // };
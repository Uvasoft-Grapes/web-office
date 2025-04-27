"use client"

import AppLayout from "@components/layouts/AppLayout";
import ProtectedRoute from "@app/ProtectedRoute";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { userContext } from "@context/UserContext";
import { useContext, useState } from "react";
import TasksDashboard from "@components/dashboards/TasksDashboard";
import Image from "next/image";

const dashboards = [
  "Tareas",
  "Notas",
  "Calendario",
];

export default function DashboardPage() {
  const { user } = useContext(userContext);

  const [dashboard, setDashboard] = useState("Tareas");

  return(
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <AppLayout activeMenu="Dashboard">
        <div className="flex flex-col gap-5">
          <div className="card">
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <Image src={user?.profileImageUrl || ""} alt="User Avatar" width={100} height={100} className="rounded-full size-8 object-cover"/>
                <h2 className="font-medium text-xl md:text-2xl text-primary-dark dark:text-primary-light">{user?.name}</h2>
              </div>
              <p className="mt-1.5 font-medium text-xs md:text-[13px] text-primary-dark dark:text-primary-light">{user?.email}</p>
              <p className="mt-1.5 font-medium text-xs md:text-[13px] text-quaternary">{format(new Date(), "eeee, dd MMMM yyyy", { locale:es })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 max-w-full py-2 overflow-x-auto">
          {dashboards.map((item, index) => (
            <button key={index} onClick={()=>setDashboard(item)} className={`${dashboard === item ? "text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light cursor-not-allowed" : "text-primary-dark dark:text-primary-light bg-transparent cursor-pointer"} font-semibold text-sm rounded-full px-3 py-1 border-2 border-transparent hover:border-primary-dark dark:hover:border-primary-light duration-300`}>{item}</button>
          ))}
          </div>
          {dashboard === "Tareas" && <TasksDashboard />}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};
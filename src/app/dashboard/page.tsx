"use client"

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { useAuth } from "@context/AuthContext";
import ProtectedRoute from "@app/ProtectedRoute";
import TasksDashboard from "@components/dashboards/Tasks";
import AppLayout from "@components/layouts/AppLayout";
import AccountsDashboard from "@/src/components/dashboards/Accounts";
import { ROLES_DATA } from "@/src/utils/data";

const dashboards = [
  "Tareas",
  "Cuentas",
  "Notas",
  "Calendario",
];

export default function DashboardPage() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState("Tareas");

  return(
    <ProtectedRoute>
      <AppLayout activeMenu="Dashboard">
        <div className="flex flex-col gap-5">
          <div className="card">
            <div className="flex gap-2">
              <div className="flex flex-col items-center gap-1">
                <Image src={user?.profileImageUrl || ""} alt="User Avatar" width={100} height={100} className="rounded-full size-14 object-cover"/>
                <span className="w-14 py-0.5 rounded text-center font-bold text-[8px] bg-blue-light dark:bg-blue-dark text-primary-light dark:text-primary-dark">{ROLES_DATA.find((role) => role.value === user?.role)?.label}</span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-medium text-xl md:text-2xl text-basic">{user?.name}</p>
                <p className="text-sm md:text-base text-tertiary-dark dark:text-tertiary-light">{user?.email}</p>
                <p className="text-xs md:text-sm text-quaternary">{format(new Date(), "eeee, dd MMMM yyyy", { locale:es })}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 max-w-full py-2 overflow-x-auto">
          {dashboards.map((item, index) => (
            <button key={index} onClick={()=>setDashboard(item)} className={`${dashboard === item ? "text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light cursor-not-allowed" : "text-basic bg-transparent cursor-pointer"} font-semibold text-sm rounded-full px-5 py-2 hover:bg-tertiary-light dark:hover:bg-tertiary-dark duration-300`}>{item}</button>
          ))}
          </div>
          {dashboard === "Tareas" && <TasksDashboard />}
          {dashboard === "Cuentas" && <AccountsDashboard />}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};
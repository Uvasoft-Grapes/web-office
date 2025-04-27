"use client"

import AppLayout from "@components/layouts/AppLayout";
import ProtectedRoute from "@app/ProtectedRoute";
import { useContext, useEffect, useState } from "react";
import { TypeTask } from "@utils/types";
import axiosInstance from "@utils/axiosInstance";
import { API_PATHS } from "@utils/apiPaths";
import { TypeStatusSummary } from "../api/tasks/route";
import TaskStatusTabs from "@components/TaskStatusTabs";
import TaskCard from "@components/cards/TaskCard";
import { LuPlus } from "react-icons/lu";
import Link from "next/link";
import SkeletonCard from "@components/cards/SkeletonCard";
import { userContext } from "@context/UserContext";

export default function TasksPage() {
  const { user } = useContext(userContext);

  const [allTasks, setAllTasks] = useState<TypeTask[]|undefined>();
  const [tabs, setTabs] = useState<{ label:string, count:number }[]|undefined>();
  const [filterStatus, setFilterStatus] = useState("Todas");

  const getAllTasks = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params:{
          status:filterStatus === "Todas" ? "" : filterStatus,
        },
      });
      setAllTasks(res.data.tasks.length > 0 ? res.data.tasks : []);
      const statusSummary:TypeStatusSummary = res.data.statusSummary || { allTasks:0, pendingTasks:0, inProgressTasks:0, completedTasks:0 };
      const statusArray = [
        { label:"Todas", count:statusSummary.allTasks || 0 },
        { label:"Pendiente", count:statusSummary.pendingTasks || 0 },
        { label:"En curso", count:statusSummary.inProgressTasks || 0 },
        { label:"Finalizada", count:statusSummary.completedTasks || 0 }
      ];
      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    getAllTasks();
    return () => {};
  },[filterStatus]);

  const handleFilter = (value:string) => {
    setAllTasks(undefined);
    setFilterStatus(value);
  };

  return(
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <AppLayout activeMenu={user?.role === "admin" ? "Tareas" : "Mis Tareas"}>
        <div className="text-primary-dark dark:text-primary-light">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 sm:gap-y-0 w-full">
            <h2 className="font-medium text-2xl md:text-3xl">Mis Tareas</h2>
          {user?.role === "admin" &&
            <Link href="/tasks/create" className="flex lg:hidden download-btn">
              <LuPlus className="text-lg"/>
              Crear Tarea
            </Link>
          }
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={handleFilter}
            />
          {user?.role === "admin" &&
            <Link href="/tasks/create" className="hidden lg:flex download-btn">
              <LuPlus className="text-lg"/>
              Crear Tarea
            </Link>
          }
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks === undefined ?
            [1,2,3].map((i) => (
              <div key={i} className="min-h-56 md:min-h-64 min-w-full md:min-w-1/3">
                <SkeletonCard/>
              </div>
            ))
          :
          allTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
            />
          ))}
          </ul>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};
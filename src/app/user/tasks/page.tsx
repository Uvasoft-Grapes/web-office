"use client"

import AppLayout from "@components/layouts/AppLayout";
import ProtectedRoute from "@app/ProtectedRoute";
import { useEffect, useState } from "react";
import { TypeTask } from "@/src/utils/types";
import axiosInstance from "@/src/utils/axiosInstance";
import { API_PATHS } from "@/src/utils/apiPaths";
import { TypeStatusSummary } from "../../api/tasks/route";
import TaskStatusTabs from "@/src/components/TaskStatusTabs";
import TaskCard from "@/src/components/cards/TaskCard";

export default function TasksPage() {
  const [allTasks, setAllTasks] = useState<TypeTask[]>([]);
  const [tabs, setTabs] = useState<{ label:string, count:number }[]>([]);
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

  return(
    <ProtectedRoute allowedRoles={["user"]}>
      <AppLayout activeMenu="Mis Tareas">
        <div className="text-primary-dark dark:text-primary-light">
          <div className="flex flex-wrap items-center justify-between gap-x-8 w-full">
            <h2 className="font-medium text-2xl md:text-3xl">Mis Tareas</h2>
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks.map((task) => (
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
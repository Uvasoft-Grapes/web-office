"use client"

import InfoCard from "@/src/components/cards/InfoCard";
import CustomBarChart from "@/src/components/charts/CustomBarChart";
import CustomPieChart from "@/src/components/charts/CustomPieChart";
import DashboardLayout from "@/src/components/layouts/AppLayout";
import TaskListTable from "@/src/components/TaskListTable";
import { userContext } from "@/src/context/UserContext";
import { API_PATHS } from "@/src/utils/apiPaths";
import axiosInstance from "@/src/utils/axiosInstance";
import { addThousandsSeparator } from "@/src/utils/helper";
import { TypeTaskDistribution } from "@/src/utils/types";
import ProtectedRoute from "@app/ProtectedRoute";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { LuArrowRight } from "react-icons/lu";

const COLORS =["#fb2c36", "#efb100", "#00c951"];

export default function DashboardPage() {
  const router = useRouter();

  const { user } = useContext(userContext);

  const [dashboardData, setDashboardData] = useState<TypeTaskDistribution>();
  const [pieChartData, setPieChartData] = useState<{ status:string, count:number }[]>([]);
  const [barChartData, setBarChartData] = useState<{ priority:string, count:number }[]>([]);

  const prepareChartData = (data:{ taskDistribution:{ Pendiente:number, Encurso:number, Finalizada:number }, taskPriorityLevels:{ Alta:number, Media:number, Baja:number } }) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status:"Pendiente", count:taskDistribution?.Pendiente || 0 },
      { status:"En curso", count:taskDistribution?.Encurso || 0 },
      { status:"Finalizada", count:taskDistribution?.Finalizada || 0 },
    ];
    setPieChartData(taskDistributionData);

    const priorityLevelData = [
      { priority:"Alta", count:taskPriorityLevels?.Alta || 0 },
      { priority:"Media", count:taskPriorityLevels?.Media || 0 },
      { priority:"Baja", count:taskPriorityLevels?.Baja || 0 },
    ];
    setBarChartData(priorityLevelData);
  }; 

  const getDashboardData = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      if(res.data) {
        setDashboardData(res.data);
        prepareChartData(res.data?.charts || null);
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    };
  };

  useEffect(() => {
    getDashboardData();
    return () => {};
  },[]);

  const onSeeMore = () => {
    router.push("/admin/tasks");
  };

  return(
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout activeMenu="Dashboard">
        <div className="card">
          <div className="">
            <div className="col-span-3">
              <h2 className="font-medium text-xl md:text-2xl text-primary-dark dark:text-primary-light">Hola {user?.name}</h2>
              <p className="mt-1.5 font-medium text-xs md:text-[13px] text-quaternary">{format(new Date(), "eeee, dd MMMM yyyy", { locale:es })}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-6 mt-5">
            <InfoCard
              label={dashboardData && dashboardData?.charts.taskDistribution.All === 1 ? "Tarea" : "Tareas"}
              value={addThousandsSeparator(dashboardData?.charts.taskDistribution.All || 0)}
              color="bg-blue-light dark:bg-blue-dark"
            />
            <InfoCard
              label={dashboardData && dashboardData?.charts.taskDistribution.Pendiente === 1 ? "Tarea Pendiente" : "Tareas Pendientes"}
              value={addThousandsSeparator(dashboardData?.charts.taskDistribution.Pendiente || 0)}
              color="bg-red-light dark:bg-red-dark"
            />
            <InfoCard
              label={dashboardData && dashboardData?.charts.taskDistribution.Encurso === 1 ? "Tarea En curso" : "Tareas En curso"}
              value={addThousandsSeparator(dashboardData?.charts.taskDistribution.Encurso || 0)}
              color="bg-yellow-light dark:bg-yellow-dark"
            />
            <InfoCard
              label={dashboardData && dashboardData?.charts.taskDistribution.Finalizada === 1 ? "Tarea Finalizada" : "Tareas Finalizadas"}
              value={addThousandsSeparator(dashboardData?.charts.taskDistribution.Finalizada || 0)}
              color="bg-green-light dark:bg-green-dark"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
          <div>
            <div className="card">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-lg md:text-xl text-primary-dark dark:text-primary-light">Tareas (estado)</h5>
              </div>
              <CustomPieChart
                data={pieChartData}
                colors={COLORS}
              />
            </div>
          </div>
          <div>
            <div className="card">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-lg md:text-xl text-primary-dark dark:text-primary-light">Tareas (prioridad)</h5>
              </div>
              <CustomBarChart
                data={barChartData}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-lg md:text-xl text-primary-dark dark:text-primary-light">Tareas Recientes</h5>
                <button className="card-btn " onClick={onSeeMore}>
                  Ver todas
                  <LuArrowRight className="text-base text-primary-dark dark:text-primary-light"/>
                </button>
              </div>
              <TaskListTable tableData={dashboardData?.recentTasks || []}/>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};
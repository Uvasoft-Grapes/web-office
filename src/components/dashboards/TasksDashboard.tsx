"use client"

import { API_PATHS } from "@utils/apiPaths";
import axiosInstance from "@utils/axiosInstance";
import { TypeTaskDistribution } from "@utils/types";
import { useEffect, useState } from "react";
import InfoCard from "@components/cards/InfoCard";
import CustomBarChart from "@components/charts/CustomBarChart";
import CustomPieChart from "@components/charts/CustomPieChart";
import TaskListTable from "@components/TaskListTable";
import { addThousandsSeparator } from "@utils/helper";
import LatestList from "@components/charts/LatestList";

const COLORS =["#fb2c36", "#efb100", "#00c951"];

export default function TasksDashboard() {
  const [dashboardData, setDashboardData] = useState<TypeTaskDistribution>();
  const [pieChartData, setPieChartData] = useState<{ status:string, count:number }[]>();
  const [barChartData, setBarChartData] = useState<{ priority:string, count:number }[]>();

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
      const res = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_TASKS_DATA}`);
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

  return(
    <div className="flex flex-col gap-5">
      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-x-3 md:gap-x-6 gap-y-2">
          <InfoCard
            label={dashboardData ? dashboardData.charts.taskDistribution.All === 1 ? "Tarea" : "Tareas" : undefined}
            value={addThousandsSeparator(dashboardData?.charts.taskDistribution.All || 0)}
            color="bg-blue-light dark:bg-blue-dark"
          />
          <InfoCard
            label={dashboardData ? dashboardData?.charts.taskDistribution.Pendiente === 1 ? "Tarea Pendiente" : "Tareas Pendientes" : undefined}
            value={addThousandsSeparator(dashboardData?.charts.taskDistribution.Pendiente || 0)}
            color="bg-red-light dark:bg-red-dark"
          />
          <InfoCard
            label={dashboardData ? dashboardData?.charts.taskDistribution.Encurso === 1 ? "Tarea En curso" : "Tareas En curso" : undefined}
            value={addThousandsSeparator(dashboardData?.charts.taskDistribution.Encurso || 0)}
            color="bg-yellow-light dark:bg-yellow-dark"
          />
          <InfoCard
            label={dashboardData ? dashboardData?.charts.taskDistribution.Finalizada === 1 ? "Tarea Finalizada" : "Tareas Finalizadas" : undefined}
            value={addThousandsSeparator(dashboardData?.charts.taskDistribution.Finalizada || 0)}
            color="bg-green-light dark:bg-green-dark"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomPieChart
          title="Tareas (estado)"
          data={pieChartData || []}
          colors={COLORS}
        />
        <CustomBarChart
          title="Tareas (prioridad)"
          data={barChartData || []}
        />
        <LatestList title="Tareas Recientes" link="/tasks">
          <TaskListTable tableData={dashboardData?.recentTasks || []}/>
        </LatestList>
      </div>
    </div>
  );
};
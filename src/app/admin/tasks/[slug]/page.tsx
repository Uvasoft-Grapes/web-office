"use client"

import Attachment from "@/src/components/Attachment";
import AvatarGroup from "@/src/components/AvatarGroup";
import InfoBox from "@/src/components/cards/InfoBox";
import AppLayout from "@/src/components/layouts/AppLayout";
import Todo from "@/src/components/Todo";
import { API_PATHS } from "@/src/utils/apiPaths";
import { getAvatars } from "@/src/utils/avatars";
import axiosInstance from "@/src/utils/axiosInstance";
import { TypeTask } from "@/src/utils/types";
import ProtectedRoute from "@app/ProtectedRoute";
import { format } from "date-fns";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TaskPage() {
  const taskId = usePathname().split("/")[3];

  const [task, setTask] = useState<TypeTask|undefined>();

  const getStatusTagColor = (status?:string) => {
    switch (status) {
      case "Pendiente":
        return "text-red-light dark:text-red-dark bg-red-light/10 dark:bg-red-dark/10";
      case "En curso":
        return "text-yellow-light dark:text-yellow-dark bg-yellow-light/10 dark:bg-yellow-dark/10";
      case "Finalizada":
        return "text-green-light dark:text-green-dark bg-green-light/10 dark:bg-green-dark/10";
      default:
        return "text-quaternary bg-quaternary/10";
    };
  };

  const getTaskById = async (id:string) => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
      setTask(res.data);
    } catch (error) {
      console.error("Error fetching task:", error);
    };
  };

  const updateTodoChecklist = async (index:number) => {
    if(!task?.todoChecklist) return;
    const todoChecklist = task.todoChecklist;
    todoChecklist[index].completed = !todoChecklist[index].completed;
    try {
      const res = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId), { todoChecklist });
      setTask(res.data.updatedTask);
      toast.success("Pendiente completado.");
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Error al completar el pendiente.");
    };
  };

  useEffect(() => {
    if(taskId) getTaskById(taskId);
    return () => {};
  },[taskId]);

  return(
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <AppLayout activeMenu="Mis Tareas">
        <div className="mt-5">
          <div className="flex justify-center mt-4">
            <div className="form-card flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg md:text-xl text-primary-dark dark:text-primary-light">{task?.title}</h2>
                <p className={`w-fit px-4 py-1 rounded font-semibold text-[11px] ${getStatusTagColor(task?.status)}`}>{task?.status}</p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <InfoBox label="Descripción" value={task?.description}/>
              </div>
              <div className="flex flex-wrap gap-y-4">
                <div className="flex flex-col gap-2 min-w-1/2">
                  <InfoBox label="Prioridad" value={task?.priority}/>
                </div>
                <div className="flex flex-col gap-2 min-w-1/2">
                  <InfoBox label="Fecha de entrega" value={task?.dueDate && format(task?.dueDate, "dd/MM/yyyy")}/>
                </div>
                <div className="flex-1 flex flex-col gap-2 min-w-full">
                  <label className="font-semibold text-xs text-quaternary">Asignados</label>
                  <AvatarGroup avatars={task?.assignedTo.map(assigned => ({ name:assigned.name||"", img:assigned.profileImageUrl||getAvatars()[0].src })) || []} maxVisible={5}/>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-semibold text-xs text-quaternary">Pendientes</label>
                  <div className="flex flex-col gap-2">
                  {task?.todoChecklist.map((todo, index) => (
                    <Todo
                      key={`todo_${index}`}
                      text={todo.text}
                      check={todo.completed}
                      onChange={() => updateTodoChecklist(index)}
                    />
                  ))}
                  </div>
                </div>
                <div className="w-full">
                  <label className="font-semibold text-xs text-quaternary">Anexos</label>
                  <div className="flex flex-col">
                  {task?.attachments.map((link, index) => (
                    <Attachment key={`attachment_${index}`} link={link}/>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};
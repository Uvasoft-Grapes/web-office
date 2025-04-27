"use client"

import Attachment from "@components/Attachment";
import AvatarGroup from "@components/AvatarGroup";
import InfoBox from "@components/cards/InfoBox";
import AppLayout from "@components/layouts/AppLayout";
import Skeleton from "@components/Skeleton";
import Todo from "@components/Todo";
import { userContext } from "@context/UserContext";
import { API_PATHS } from "@utils/apiPaths";
import { getAvatars } from "@utils/avatars";
import axiosInstance from "@utils/axiosInstance";
import { TypeTask } from "@utils/types";
import ProtectedRoute from "@app/ProtectedRoute";
import { format } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TaskPage() {
  const { user } = useContext(userContext);
  const taskId = usePathname().split("/")[2];

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
      <AppLayout activeMenu={user?.role === "admin" ? "Tareas" : "Mis Tareas"}>
      {!task ?
        <Skeleton/>
      :
        <div className="flex flex-col gap-5">
          <div className="flex justify-center mt-4">
            <div className="form-card flex flex-col gap-3 w-full">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg md:text-xl text-primary-dark dark:text-primary-light">{task?.title}</h2>
                <p className={`w-fit px-4 py-1 rounded font-semibold text-[11px] ${getStatusTagColor(task?.status)}`}>{task?.status}</p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <InfoBox label="Descripción" value={task.description}/>
              </div>
              <div className="flex flex-wrap gap-y-4">
                <div className="flex flex-col gap-2 min-w-1/2">
                  <InfoBox label="Prioridad" value={task.priority}/>
                </div>
                <div className="flex flex-col gap-2 min-w-1/2">
                  <InfoBox label="Fecha de entrega" value={task.dueDate && format(task.dueDate, "dd/MM/yyyy")}/>
                </div>
                <div className="flex-1 flex flex-col gap-2 min-w-full">
                  <label className="font-semibold text-xs text-quaternary">Asignados</label>
                  <AvatarGroup avatars={task.assignedTo.map(assigned => ({ name:assigned.name||"", img:assigned.profileImageUrl||getAvatars()[0].src })) || []} maxVisible={5}/>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-semibold text-xs text-quaternary">Pendientes</label>
                  <div className="flex flex-col gap-2">
                  {task.todoChecklist.map((todo, index) => (
                    <Todo
                      key={`todo_${index}`}
                      text={todo.text}
                      check={todo.completed}
                      onChange={() => updateTodoChecklist(index)}
                    />
                  ))}
                  </div>
                </div>
                <div className={`w-full ${task.attachments.length < 1 && "hidden"}`}>
                  <label className="font-semibold text-xs text-quaternary">Anexos</label>
                  <div className="flex flex-col">
                  {task.attachments.map((link, index) => (
                    <Attachment key={`attachment_${index}`} link={link}/>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        {user?.role === "admin" &&
          <div className="flex w-full">
            <Link href={`/tasks/create/${taskId}`} className="card-btn-fill">Editar</Link>
          </div>
        }
        </div>
      }
      </AppLayout>
    </ProtectedRoute>
  );
};
"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { useAuth } from "@context/AuthContext";
import { API_PATHS } from "@utils/apiPaths";
import { getAvatars } from "@utils/avatars";
import axiosInstance from "@utils/axiosInstance";
import { TypeTask } from "@utils/types";
import ProtectedRoute from "@app/ProtectedRoute";
import AppLayout from "@components/layouts/AppLayout";
import Attachment from "@components/tasks/Attachment";
import AvatarGroup from "@components/users/AvatarGroup";
import Todo from "@components/tasks/Todo";
import Modal from "@components/Modal";
import FormTask from "@components/tasks/Form";
import Skeleton from "@components/Skeleton";
import { LuPencil } from "react-icons/lu";

export default function TaskPage() {
  const { user } = useAuth();
  const taskId = usePathname().split("/")[2];

  const [task, setTask] = useState<TypeTask|undefined>();
  const [taskForm, setTaskForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const getTaskById = async (id:string) => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
      setTask(res.data);
    } catch (error) {
      console.error("Error fetching task:", error);
    };
  };

  useEffect(() => {
    getTaskById(taskId);
    return () => {};
  },[taskId]);

  const updateTodoChecklist = async (index:number) => {
    setLoading(true);
    if(!task?.todoChecklist) return;
    const todoChecklist = task.todoChecklist;
    todoChecklist[index].completed = !todoChecklist[index].completed;
    try {
      const res = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId), { todoChecklist });
      toast.success(res.data.message);
      setTask(res.data.task);
      setLoading(false);
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Error al completar el pendiente.");
      setLoading(false);
    };
  };

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

  const getPriorityTagColor = (priority?:string) => {
    switch (priority) {
      case "Alta":
        return "text-red-light dark:text-red-dark bg-red-light/10 dark:bg-red-dark/10";
      case "Media":
        return "text-yellow-light dark:text-yellow-dark bg-yellow-light/10 dark:bg-yellow-dark/10";
      case "Baja":
        return "text-green-light dark:text-green-dark bg-green-light/10 dark:bg-green-dark/10";
      default:
        return "text-quaternary bg-quaternary/10";
    };
  };

  return(
    <ProtectedRoute>
      <AppLayout activeMenu="Tareas">
      {!task ?
        <div className="flex-1 flex flex-col">
          <Skeleton/>
        </div>
      :
        <div className="flex flex-col gap-5">
          <div className="flex justify-center">
            <article className="form-card flex flex-col gap-6 w-full">
              <section className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold text-lg md:text-xl text-basic">{task?.title}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <p className={`w-fit px-4 py-1 rounded text-nowrap font-semibold text-xs ${getPriorityTagColor(task?.priority)}`}>{task?.priority}</p>
                  <p className={`w-fit px-4 py-1 rounded text-nowrap font-semibold text-xs ${getStatusTagColor(task?.status)}`}>{task?.status}</p>
                </div>
              </section>
              <section className="info-box">
                <label className="info-box-label">Descripción</label>
                <p className="info-box-value">{task.description}</p>
              </section>
              <section className="flex flex-col sm:flex-row gap-4">
                <div className="info-box">
                  <label className="info-box-label">Carpeta</label>
                  <p className="info-box-value">{task.folder.title}</p>
                </div>
                <div className="info-box">
                  <label className="info-box-label">Asignados</label>
                  <AvatarGroup avatars={task.assignedTo.map(assigned => ({ name:assigned.name||"", img:assigned.profileImageUrl||getAvatars()[0].src })) || []} maxVisible={5}/>
                </div>
              </section>
              <section className="flex flex-wrap gap-4">
                <div className="info-box">
                  <label className="info-box-label">Fecha Inicial</label>
                  <p className="info-box-value">{task.createdAt && format(task.createdAt, "dd/MM/yyyy", { locale:es })}</p>
                </div>
                <div className="info-box">
                  <label className="info-box-label">Fecha Final</label>
                  <p className="info-box-value">{task.dueDate && format(task.dueDate, "dd/MM/yyyy", { locale:es })}</p>
                </div>
              </section>
              <section className="flex flex-col gap-2 w-full">
                <label className="font-semibold text-xs text-quaternary">Pendientes</label>
                <div className="flex flex-col gap-2">
                {task.todoChecklist.map((todo, index) => (
                  <Todo
                    key={`todo_${index}`}
                    text={todo.text}
                    check={todo.completed}
                    onChange={() => updateTodoChecklist(index)}
                    loading={loading}
                  />
                ))}
                </div>
              </section>
              <section className={`w-full ${task.attachments.length < 1 && "hidden"}`}>
                <label className="font-semibold text-xs text-quaternary">Anexos</label>
                <div className="flex flex-col">
                {task.attachments.map((link, index) => (
                  <Attachment key={`attachment_${index}`} link={link}/>
                ))}
                </div>
              </section>
            </article>
          </div>
        </div>
      }
      {user && (user.role === "owner" || user.role === "admin") &&
        <div className="fixed bottom-2 xl:bottom-4 left-0 w-full flex justify-center">
          <div className="flex flex-wrap justify-end gap-2 w-full max-w-[1750px] px-3">
            <button type="button" onClick={()=>setTaskForm(true)} className="tool-btn">
              <LuPencil className="text-lg"/>
              Editar
            </button>
          </div>
        </div>
      }
        <Modal title="Editar Tarea" isOpen={taskForm} onClose={()=>setTaskForm(false)}>
          {task && taskForm && <FormTask closeForm={()=>setTaskForm(false)} values={task} setTask={(updatedTask:TypeTask)=>setTask(updatedTask)}/>}
        </Modal>
      </AppLayout>
    </ProtectedRoute>
  );
};
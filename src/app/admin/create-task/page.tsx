"use client"

import AttachmentInput from "@components/inputs/AttachmentInput";
import SelectDropdown from "@components/inputs/SelectDropdown";
import SelectUsers from "@components/inputs/SelectUsers";
import TodoListInput from "@components/inputs/TodoListInput";
import AppLayout from "@components/layouts/AppLayout";
import { API_PATHS } from "@utils/apiPaths";
import axiosInstance from "@utils/axiosInstance";
import { PRIORITY_DATA } from "@utils/data";
import { TypeAssigned, TypeTodo } from "@utils/types";
import ProtectedRoute from "@app/ProtectedRoute";
import { parseISO, format } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { es } from "date-fns/locale";

export default function CreateTaskPage() {
  const router = useRouter();

  const [taskData, setTaskData] = useState<{ title?:string, description:string, priority:string, dueDate?:Date|undefined, assignedTo:TypeAssigned[], todoChecklist:TypeTodo[], attachments?:string[] }>({ description:"", priority:"Baja", assignedTo:[], todoChecklist:[] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createTask = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, taskData);
      toast.success("Tarea creada satisfactoriamente");
      router.push("/admin/tasks");
    } catch (error) {
      console.error("Error creating task:", error)
      setLoading(false);
    } finally {
      setLoading(false);
    };
  };

  const handleSubmit = async () => {
    setError("");
    if(!taskData.title?.trim()) return setError("Título obligatorio.");
    if(!taskData.dueDate) return setError("Fecha de entrega obligatoria.");
    if(taskData.assignedTo.length < 1) return setError("Asignada al menos un usuario.");
    if(taskData.todoChecklist.length < 1) return setError("Añade al menos un pendiente.");
    createTask();
  };

  return(
    <ProtectedRoute allowedRoles={["admin"]}>
      <AppLayout activeMenu="Crear Tarea">
        <div className="flex items-center justify-center">
          <div className="flex w-fit">
            <form className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-xl md:text-2xl text-primary-dark dark:text-primary-light">Crear Tarea</h2>
              </div>
              <div className="mt-4">
                <label htmlFor="" className="text-sm font-semibold text-tertiary-dark dark:text-tertiary-light">Título</label>
                <input
                  type="text"
                  placeholder="Título de la tarea"
                  defaultValue={taskData.title}
                  onChange={(e)=>setTaskData({ ...taskData, title:e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="mt-3">
                <label htmlFor="" className="text-sm font-semibold text-tertiary-dark dark:text-tertiary-light">Descripción</label>
                <textarea
                  placeholder="Descripción de la tarea"
                  rows={4}
                  defaultValue={taskData.description}
                  onChange={(e)=>setTaskData({ ...taskData, description:e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                <div className="">
                  <label htmlFor="" className="text-sm font-semibold text-tertiary-dark dark:text-tertiary-light">Prioridad</label>
                  <SelectDropdown
                    options={PRIORITY_DATA}
                    value={taskData.priority}
                    placeholder="Seleccionar prioridad"
                    onChange={(priority:string)=>setTaskData({ ...taskData, priority })}
                  />
                </div>
                <div className="">
                  <label htmlFor="" className="text-sm font-semibold text-tertiary-dark dark:text-tertiary-light">Fecha de entrega</label>
                  <input
                    type="date"
                    placeholder="Fecha"
                    defaultValue={taskData.dueDate && format(taskData.dueDate, "yyyy-MM-dd")}
                    min={format(new Date(), 'yyyy-MM-dd', { locale:es })}
                    onChange={(e) => setTaskData({ ...taskData, dueDate:e.target.value ? parseISO(e.target.value) : undefined })}
                    className="form-input"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                  <label htmlFor="" className="text-sm font-semibold text-tertiary-dark dark:text-tertiary-light">Participantes</label>
                  <SelectUsers
                    selectedUsers={taskData.assignedTo || []}
                    setSelectedUsers={(assignedTo:TypeAssigned[])=>setTaskData({ ...taskData, assignedTo })}
                  />
                </div>
              </div>
              <div className="mt-3">
                <label htmlFor="" className="text-sm font-semibold text-tertiary-dark dark:text-tertiary-light">Lista de control</label>
                <TodoListInput
                  todoList={taskData.todoChecklist || []}
                  setTodoList={(todoChecklist:TypeTodo[]) => setTaskData({ ...taskData, todoChecklist })}
                />
              </div>
              <div className="mt-3">
                <label htmlFor="" className="text-sm font-semibold text-tertiary-dark dark:text-tertiary-light">Añadir anexos</label>
                <AttachmentInput
                  attachments={taskData.attachments || []}
                  setAttachments={(attachments:string[]) => setTaskData({ ...taskData, attachments })}
                />
              </div>
            {error &&
              <p className="mt-5 font-medium text-xs text-red-light dark:text-red-dark">{error}</p>
            }
              <div className="flex justify-end mt-7">
                <button type="button" disabled={loading} onClick={handleSubmit} className="add-btn">Crear Tarea</button>
              </div>
            </form>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};
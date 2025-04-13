"use client"

import AttachmentInput from "@components/inputs/AttachmentInput";
import SelectDropdown from "@components/inputs/SelectDropdown";
import SelectUsers from "@components/inputs/SelectUsers";
import TodoListInput from "@components/inputs/TodoListInput";
import AppLayout from "@components/layouts/AppLayout";
import { API_PATHS } from "@utils/apiPaths";
import axiosInstance from "@utils/axiosInstance";
import { PRIORITY_DATA } from "@utils/data";
import { TypeAssigned, TypeTask, TypeTodo } from "@utils/types";
import ProtectedRoute from "@app/ProtectedRoute";
import { parseISO, format } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuTrash2 } from "react-icons/lu";
import { es } from "date-fns/locale";
import Modal from "@/src/components/Modal";
import DeleteAlert from "@/src/components/DeleteAlert";

export default function CreateTaskPage() {
  const taskId = usePathname().split("/")[3];
  const router = useRouter();

  const [taskData, setTaskData] = useState<TypeTask>({ _id:"", title:"", description:"", priority:"Baja", dueDate:new Date(), assignedTo:[], todoChecklist:[], attachments:[], progress:0 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const updateTask = async () => {
    setLoading(true);
    try {
      // const todoList = taskData.todoChecklist.map((item) => {
      //   const prevTodoChecklist = currentTask?.todoChecklist || [];
      //   const matchedTask = prevTodoChecklist.find(task => task.text === item.text);
      //   return { text:item, complete:matchedTask ? matchedTask.completed : false };
      // });
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), taskData);
      toast.success("Tarea actualizada satisfactoriamente.");
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    };
  };
  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    setError("");
    if(!taskData.title?.trim()) return setError("Título obligatorio.");
    if(!taskData.dueDate) return setError("Fecha de entrega obligatoria.");
    if(taskData.assignedTo.length < 1) return setError("Asignada al menos un usuario.");
    if(taskData.todoChecklist.length < 1) return setError("Añade al menos un pendiente.");
    updateTask();
  };
  const getTaskDetailsByID = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      if(res.data) {
        const taskInfo = res.data;
        setTaskData(taskInfo);
      };
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    };
  };
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      setOpenDeleteAlert(false);
      toast.success("Tarea eliminada satisfactoriamente.");
      router.push("/admin/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    getTaskDetailsByID();
  },[taskId]);

  const handlePriority = (priority:string) => {
    if(priority === "Baja" || priority === "Media" || priority === "Alta") setTaskData({ ...taskData, priority });
  };

  return(
    <ProtectedRoute allowedRoles={["admin"]}>
      <AppLayout activeMenu="Crear Tarea">
        <div className="flex items-center justify-center">
          <div className="flex w-fit">
            <form onSubmit={(e)=>handleSubmit(e)} className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-xl md:text-2xl text-primary-dark dark:text-primary-light">Editar Tarea</h2>
                <button
                  type="button"
                  onClick={()=>setOpenDeleteAlert(true)}
                  className="card-btn-red"
                >
                  <LuTrash2 className="text-sm"/> Eliminar
                </button>
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
                    onChange={(priority:string)=>handlePriority(priority)}
                  />
                </div>
                <div className="">
                  <label htmlFor="" className="text-sm font-semibold text-tertiary-dark dark:text-tertiary-light">Fecha de entrega</label>
                  <input
                    type="date"
                    placeholder="Fecha"
                    defaultValue={taskData.dueDate && format(taskData.dueDate, "yyyy-MM-dd")}
                    onChange={(e) => setTaskData({ ...taskData, dueDate:e.target.value ? parseISO(e.target.value) : undefined })}
                    className="form-input"
                    min={format(new Date(), 'yyyy-MM-dd', { locale:es })}
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
                <button disabled={loading} className="add-btn">Editar Tarea</button>
              </div>
            </form>
          </div>
        </div>
        <Modal isOpen={openDeleteAlert} onClose={()=>setOpenDeleteAlert(false)} title="Eliminar Tarea">
          <DeleteAlert
            content="¿Estas seguro de eliminar esta tarea?"
            onDelete={deleteTask}
          />
        </Modal>
      </AppLayout>
    </ProtectedRoute>
  );
};
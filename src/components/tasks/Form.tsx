import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { LuCheck, LuTrash2 } from "react-icons/lu";
import { useAuth } from "@context/AuthContext";
import { TypeAssigned, TypeFolder, TypeTask, TypeTodo } from "@utils/types";
import axiosInstance from "@utils/axiosInstance";
import { API_PATHS } from "@utils/apiPaths";
import { PRIORITY_DATA } from "@utils/data";
import SelectDropdown from "@components/inputs/Dropdown";
import InputText from "@components/inputs/Text";
import Textarea from "@components/inputs/Textarea";
import InputDate from "@components/inputs/Date";
import SelectAssigned from "@components/inputs/Assigned";
import TodoListInput from "@components/inputs/TodoList";
import AttachmentInput from "@components/inputs/Attachment";
import Modal from "@components/Modal";
import DeleteAlert from "@components/DeleteAlert";
import FolderSelect from "@components/folders/Select";

export default function TaskForm({ closeForm, values, setTask, }:{ closeForm:()=>void, values?:TypeTask, setTask?:(updatedTask:TypeTask)=>void }) {
  const { user } = useAuth();
  const router = useRouter();

  const [priority, setPriority] = useState<string>(values ? values.priority : "Baja");
  const [assignedTo, setAssignedTo] = useState<TypeAssigned[]>(values ? values.assignedTo : []);
  const [todoChecklist, setTodoChecklist] = useState<TypeTodo[]>(values ? values.todoChecklist : []);
  const [attachments, setAttachments] = useState<string[]>(values ? values.attachments : []);
  const [folder, setFolder] = useState<TypeFolder|undefined>(values?.folder);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const createTask = async (data:{ title:string, description:string, dueDate:Date }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, { ...data, folder:folder?._id, priority, assignedTo, todoChecklist, attachments });
      toast.success(res.data.message);
      router.push(`/tasks/${res.data.task._id}`);
    } catch (error) {
      console.error("Error creating task:", error)
      setLoading(false);
    } finally {
      setLoading(false);
    };
  };

  const updateTask = async (data:{ title:string, description:string, dueDate:Date }) => {
    if(!values || !setTask) return;
    setLoading(true);
    try {
      const res = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(values?._id), { ...data, folder:folder?._id, priority, assignedTo, todoChecklist, attachments });
      if(res.status === 201) {
        toast.success(res.data.message);
        setTask(res.data.task);
        closeForm();
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error(error);
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      };
    } finally {
      setLoading(false);
    };
  };

  const deleteTask = async () => {
    if(!values) return;
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(values._id));
      router.push("/tasks");
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error deleting desk:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    };
  };

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title')?.toString() || "";
    const description = formData.get('description')?.toString() || "";
    const date = formData.get('due-date')?.toString() || undefined;
    const dueDate = date ? parseISO(date) : undefined;

//! Validate form data
    if(!title?.trim()) return setError("Título obligatorio.");
    if(!dueDate) return setError("Fecha de final obligatoria.");
    if(assignedTo.length < 1) return setError("Asignada al menos un miembro.");
    if(todoChecklist.length < 1) return setError("Añade al menos un pendiente.");
    if(!folder) return setError("Selecciona una carpeta.");

    if(!values) createTask({ title, description, dueDate });
    if(values) updateTask({ title, description, dueDate });
  };

  return(
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4 max-h-full">
      <div className="flex flex-col gap-4 pr-4 overflow-y-auto">
        <InputText
          name="title"
          label="Título"
          placeholder="Título de la tarea"
          defaultValue={values?.title || ""}
        />
        <Textarea
          name="description"
          label="Descripción"
          placeholder="Descripción de la tarea"
          defaultValue={values?.description || ""}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FolderSelect
            label
            selectedFolder={folder}
            setSelectedFolder={(selectedFolder:TypeFolder|undefined)=>setFolder(selectedFolder)}
          />
          <SelectAssigned
            label="Miembros asignados"
            selectedUsers={assignedTo}
            setSelectedUsers={(assignedToList:TypeAssigned[])=>setAssignedTo(assignedToList)}
          />
          <SelectDropdown
            label="Prioridad"
            options={PRIORITY_DATA}
            placeholder="Seleccionar prioridad"
            defaultValue={values?.priority || PRIORITY_DATA[0].value}
            handleValue={(value:string)=>setPriority(value)}
          />
          <InputDate
            name="due-date"
            label="Fecha final"
            placeholder="Fecha de entrega"
            defaultValue={values?.dueDate ? format(values.dueDate, "yyyy-MM-dd", { locale:es }) : undefined}
          />
        </div>
        <TodoListInput
          label="Pendientes"
          todoList={todoChecklist}
          setTodoList={(todoList:TypeTodo[]) => setTodoChecklist(todoList)}
        />
        <AttachmentInput
          label="Anexos"
          attachments={attachments}
          setAttachments={(attachmentsList:string[]) => setAttachments(attachmentsList)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <p className="flex-1 flex items-center min-h-2 font-medium text-xs text-red-light dark:text-red-dark overflow-hidden">{error}</p>
        <div className="flex flex-wrap-reverse gap-2">
        {user?.role === "owner" && values && 
          <button type="button" onClick={()=>setOpenAlert(true)} className="flex-1 sm:flex-auto card-btn-red w-fit sm:min-w-52">
            <LuTrash2 className="text-xl"/>
            Eliminar
          </button>
        }
          <button type="submit" disabled={loading} className="flex-1 sm:flex-auto card-btn-fill w-fit sm:min-w-52">
            <LuCheck className="text-xl"/>
            Confirmar
          </button>
        </div>
      </div>
      <Modal title="Eliminar Tarea" isOpen={openAlert} onClose={()=>setOpenAlert(false)}>
        {<DeleteAlert content="¿Estás seguro de que quieres eliminar esta tarea?" onDelete={deleteTask}/>}
      </Modal>
    </form>
  );
};
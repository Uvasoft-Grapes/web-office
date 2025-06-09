import { FormEvent, useState } from "react";
import { isAxiosError } from "axios";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { LuCheck, LuTrash2 } from "react-icons/lu";
import { useAuth } from "@context/AuthContext";
import { TypeAssigned, TypeEvent, TypeFolder } from "@utils/types";
import { EVENTS_FREQUENCY_DATA } from "@utils/data";
import axiosInstance from "@utils/axiosInstance";
import { API_PATHS } from "@utils/apiPaths";
import TextInput from "@components/inputs/Text";
import Textarea from "@components/inputs/Textarea";
import FolderSelect from "@components/folders/Select";
import AssignedSelect from "@components/inputs/Assigned";
import Modal from "@components/Modal";
import DeleteAlert from "@components/DeleteAlert";
import DateTimeInput from "@components/inputs/DateTimeInput";
import DropdownSelect from "@components/inputs/Dropdown";

export default function EventForm({ closeForm, values, refresh }:{ closeForm:()=>void, values?:TypeEvent, refresh:()=>void }) {
  const { user } = useAuth();

  const [folder, setFolder] = useState<TypeFolder|undefined>(values?.folder);
  const [assignedTo, setAssignedTo] = useState<TypeAssigned[]>(values ? values.assignedTo : []);
  const [frequency, setFrequency] = useState("none");
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createEvent = async (data:{ startDate:Date, endDate:Date, endFrequency?:Date, title:string, description:string }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.EVENTS.CREATE_EVENT, { folder, assignedTo, frequency, ...data });
      if(res.status === 201) {
        toast.success(res.data.message);
        closeForm();
        refresh();
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error creating event:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    } finally {
      setLoading(false);
    };
  };

  const updateEvent = async (data:{ startDate:Date, endDate:Date, endFrequency?:Date, title:string, description:string }) => {
    if(!values) return;
    setLoading(true);
    try {
      const res = await axiosInstance.put(API_PATHS.EVENTS.UPDATE_EVENT(values._id), { folder, assignedTo, frequency, ...data });
      if(res.status === 201) {
        toast.success(res.data.message);
        closeForm();
        refresh();
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error updating event:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    } finally {
      setLoading(false);
    };
  };

  const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const textStartDate = formData.get("start-date")?.toString() || "";
    const startDate = textStartDate ? parseISO(textStartDate) : undefined;
    const textEndDate = formData.get("end-date")?.toString() || "";
    const endDate = textEndDate ? parseISO(textEndDate) : undefined;
    const textEndFrequency = formData.get("end-frequency")?.toString() || "";
    const endFrequency = textEndFrequency ? parseISO(textEndFrequency) : undefined;
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";

//! Validate form data
    if(!startDate) return setError("Introduce una fecha inicial.");
    if(!endDate) return setError("Introduce una fecha final.");
    if(frequency !== "none" && !endFrequency) return setError("Introduce una fecha limite.");
    if(!folder) return setError("Selecciona una carpeta.");
    if(assignedTo.length === 0) return setError("Asigna al menos un miembro.");
    if(!title) return setError("Introduce un título.");
  
    if(!values) createEvent({ startDate, endDate, endFrequency, title, description });
    if(values) updateEvent({ startDate, endDate, endFrequency, title, description });
  };

  const deleteEvent = async () => {
    if(!values) return;
    setLoading(true);
    try {
      const res = await axiosInstance.delete(API_PATHS.EVENTS.DELETE_EVENT(values._id));
      if(res.status === 200) {
        toast.success(res.data.message);
        closeForm();
        refresh();
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error fetching accounts:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    } finally {
      setLoading(false);
    }
  };

  return(
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4 max-h-full">
      <div className="flex flex-col gap-4 pr-4 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DateTimeInput
            name="start-date"
            label="Fecha inicial"
            defaultValue={values?.startDate ? format(values.startDate, "yyyy-MM-dd'T'HH:mm", { locale:es }) : format(new Date(), "yyyy-MM-dd'T'HH:mm", { locale:es })}
          />
          <DateTimeInput
            name="end-date"
            label="Fecha final"
            defaultValue={values?.startDate ? format(values.endDate, "yyyy-MM-dd'T'HH:mm", { locale:es }) : format(new Date(), "yyyy-MM-dd'T'HH:mm", { locale:es })}
          />
          <DropdownSelect label="Frecuencia" options={EVENTS_FREQUENCY_DATA} defaultValue={values?.recurrence?.frequency || "none"} handleValue={(value:string)=>setFrequency(value)}/>
          <DateTimeInput
            name="end-frequency"
            label="Final limite"
            disabled={frequency === "none"}
            defaultValue={values?.recurrence?.endFrequency ? format(values.recurrence.endFrequency, "yyyy-MM-dd'T'HH:mm", { locale:es }) : undefined}
          />
          <FolderSelect
            selectedFolder={folder}
            setSelectedFolder={(selectedFolder:TypeFolder|undefined)=>setFolder(selectedFolder)}
          />
          <AssignedSelect
            label="Miembros asignados"
            selectedUsers={assignedTo}
            setSelectedUsers={(assignedToList:TypeAssigned[])=>setAssignedTo(assignedToList)}
          />
        </div>
        <TextInput
          name="title"
          label="Título"
          placeholder="Título del evento"
          defaultValue={values?.title || ""}
        />
        <Textarea
          name="description"
          label="Descripción"
          placeholder="Descripción del evento"
          defaultValue={values?.description || ""}
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
      <Modal title="Eliminar Event" isOpen={openAlert} onClose={()=>setOpenAlert(false)}>
        {<DeleteAlert content="¿Estás seguro de que quieres eliminar este evento?" onDelete={deleteEvent}/>}
      </Modal>
    </form>
  );
};
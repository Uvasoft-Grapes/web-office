import { useState } from "react";
import { isAxiosError } from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { LuPencil } from "react-icons/lu";
import { getAvatars } from "@utils/avatars";
import { TypeGoal } from "@utils/types";
import axiosInstance from "@utils/axiosInstance";
import { API_PATHS } from "@utils/apiPaths";
import AvatarGroup from "@components/users/AvatarGroup";
import Modal from "@components/Modal";
import GoalForm from "@components/goals/Form";

export default function Goal({ goal, refresh }:{ goal:TypeGoal, refresh:()=>void }) {
  const { _id, folder, description, priority, status, createdAt, dueDate, assignedTo, objectives  } = goal;
  const selectedUsersAvatars = assignedTo.map((assigned) => ({ name:assigned.name||"", img:assigned.profileImageUrl||getAvatars()[0].src }));

  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const getStatusTagColor = () => {
    switch (status) {
      case "Pendiente":
        return "text-red-light dark:text-red-dark bg-red-light/20 dark:bg-red-dark/20 border-red-light dark:border-red-dark";
      case "En curso":
        return "text-yellow-light dark:text-yellow-dark bg-yellow-light/20 dark:bg-yellow-dark/20 border-yellow-light dark:border-yellow-dark";
      case "Finalizada":
        return "text-green-light dark:text-green-dark bg-green-light/20 dark:bg-green-dark/20 border-green-light dark:border-green-dark";
      default:
        return "text-quaternary bg-quaternary/25 border-quaternary";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Alta":
        return "text-red-light dark:text-red-dark bg-red-light/20 dark:bg-red-dark/20 border-red-light dark:border-red-dark";
      case "Media":
        return "text-yellow-light dark:text-yellow-dark bg-yellow-light/20 dark:bg-yellow-dark/20 border-yellow-light dark:border-yellow-dark";
      case "Baja":
        return "text-green-light dark:text-green-dark bg-green-light/20 dark:bg-green-dark/20 border-green-light dark:border-green-dark";
      default:
        return "text-quaternary bg-quaternary/25 border-quaternary";
    }
  };

  
  const updateObjective = async (index:number) => {
    setLoading(true);
    const newObjectives = objectives;
    newObjectives[index].completed = !newObjectives[index].completed;
    try {
      const res = await axiosInstance.put(API_PATHS.GOALS.UPDATE_OBJECTIVES(_id), { objectives:newObjectives });
      if(res.status === 201) {
        toast.success(res.data.message);
        refresh();
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error updating objective:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    } finally {
      setLoading(false);
    };
  };

  const onRefresh = () => {
    refresh();
    setOpenForm(false);
  };

  return(
    <div className="flex-1 flex flex-col gap-5 max-h-full">
      <article className="flex-1 flex flex-col gap-6 w-full overflow-y-auto">
        <section className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`w-fit px-4 py-1 rounded text-nowrap font-semibold text-xs ${getPriorityTagColor()}`}>{priority}</p>
            <p className={`w-fit px-4 py-1 rounded text-nowrap font-semibold text-xs ${getStatusTagColor()}`}>{status}</p>
          </div>
        </section>
        <section className="info-box">
          <label className="info-box-label">Descripción</label>
          <p className="info-box-value">{description}</p>
        </section>
        <section className="flex flex-col sm:flex-row gap-4">
          <div className="info-box">
            <label className="info-box-label">Carpeta</label>
            <p className="info-box-value">{folder.title}</p>
          </div>
          <div className="info-box">
            <label className="info-box-label">Asignados</label>
            <AvatarGroup avatars={selectedUsersAvatars} maxVisible={5}/>
          </div>
        </section>
        <section className="flex flex-wrap gap-4">
          <div className="info-box">
            <label className="info-box-label">Fecha Inicial</label>
            <p className="info-box-value">{createdAt && format(createdAt, "dd/MM/yyyy", { locale:es })}</p>
          </div>
          <div className="info-box">
            <label className="info-box-label">Fecha Final</label>
            <p className="info-box-value">{dueDate && format(dueDate, "dd/MM/yyyy", { locale:es })}</p>
          </div>
        </section>
        <section className="flex flex-col gap-2 w-full">
          <label className="font-semibold text-xs text-quaternary">Objetivos</label>
          <div className="flex flex-col gap-4">
          {objectives.map((obj, index) => (
            <div key={index} className="flex items-start gap-1 w-full">
              <input type="checkbox" checked={obj.completed} disabled={loading} onChange={()=>updateObjective(index)} className="min-w-5 min-h-5 rounded-sm outline-none text-blue-light bg-quaternary border-quaternary cursor-pointer"/>
              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-x-2 pr-5">
                <p className="font-medium text-sm text-basic">{obj.text}</p>
                <p className="font-medium text-xs text-quaternary">{format(obj.dueDate, "dd/MM/yyyy")}</p>
              </div>
            </div>
          ))}
          </div>
        </section>
      </article>
      <div className="flex justify-end">
        <button type="button" onClick={()=>setOpenForm(true)} className="card-btn-fill">
          <LuPencil className="text-base"/>
          Editar
        </button>
      </div>
      <Modal title="Editar Meta" isOpen={openForm} onClose={()=>setOpenForm(false)}>
        {openForm && <GoalForm values={goal} refresh={onRefresh}/>}
      </Modal>
    </div>
  );
};
import { useState } from "react";
import InputText from "../inputs/Text";
import Modal from "../Modal";
import { isAxiosError } from "axios";
import axiosInstance from "@/src/utils/axiosInstance";
import { API_PATHS } from "@/src/utils/apiPaths";
import { TypeDesk } from "@/src/utils/types";

export default function DeskForm({ value, isOpen, onClose, action }:{ value?:TypeDesk, isOpen:boolean, onClose:()=>void, action:(desk:TypeDesk)=>void }) {
  const [error, setError] = useState("");
  const [title, setTitle] = useState(value?.title || "");

  const handleSubmitCreate = async () => {
    setError("");
    if(!title) return setError("* El título es requerido");
    try {
      const res = await axiosInstance.post(API_PATHS.DESKS.CREATE_DESK, { title });
      action(res.data);
      setTitle("");
      onClose()
    } catch (error) {
      if(!isAxiosError(error)) return console.error(error);
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      };
    };
  };

  const handleSubmitUpdate = async () => {
    if(!value) return;
    setError("");
    if(!title) return setError("* El título es requerido");
    try {
      const res = await axiosInstance.put(API_PATHS.DESKS.UPDATE_DESK(value._id), { title });
      action(res.data);
      setTitle("");
      onClose()
    } catch (error) {
      if(!isAxiosError(error)) return console.error(error);
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      };
    };
  };

  return(
    <Modal title={`${!value ? "Crear" : "Editar"} Escritorio`} isOpen={isOpen} onClose={onClose}>
      <InputText onChange={(value)=>setTitle(value)} label="Título" placeholder="Título del escritorio" value={title}/>
      <p className="min-h-5 min-w-full text-xs text-red-light dark:text-red-dark">{error}</p>
      <div className="flex justify-end">
        <button onClick={!value ? handleSubmitCreate : handleSubmitUpdate} className="card-btn-fill">Confirmar</button>
      </div>
    </Modal>
  );
}
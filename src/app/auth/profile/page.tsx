"use client"

import AppLayout from "@components/layouts/AppLayout";
import ProtectedRoute from "@app/ProtectedRoute";
import { useContext, useEffect, useState } from "react";
import { userContext } from "@context/UserContext";
import Image from "next/image";
import Modal from "@components/Modal";
import InputText from "@components/inputs/Text";
import InputEmail from "@components/inputs/Email";
import ProfilePhotoSelector from "@components/inputs/ProfilePhotoSelector";
import axiosInstance from "@utils/axiosInstance";
import InputPassword from "@components/inputs/Password";
import { isAxiosError } from "axios";
import { PiDesktopBold } from "react-icons/pi";
import { TbUser } from "react-icons/tb";
import Link from "next/link";
import DeskForm from "@/src/components/desk/form";
import { TypeDesk } from "@/src/utils/types";
import { API_PATHS } from "@/src/utils/apiPaths";

export default function Profile() {
  const { user, updateUser, desk, changeDesk } = useContext(userContext);

  const [openUserForm, setOpenUserForm] = useState(false);
  const [openDeskForm, setOpenDeskForm] = useState(false);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || "");
  const [newPassword, setNewPassword] = useState<string>("");
  const [password, setPassword] = useState("");

  useEffect(()=>{
    setName(user?.name || "");
    setEmail(user?.email || "");
    setProfileImageUrl(user?.profileImageUrl || "");
    setNewPassword("");
    setPassword("");
    return () => {};
  },[user]);

  const getValidation = () => {
    if(!name) return "* El nombre es requerido";
    if(!email) return "* El correo es requerido";
    if(!password) return "* La contraseña actual es requerida";
    if(newPassword.length > 0 && newPassword.length < 8) return "La nueva contraseña debe tener al menos 8 caracteres";
    if(newPassword === password) return "La nueva contraseña no puede ser igual a la actual";
    return "";
  };

  const handleSubmit = async () => {
    if(!user) return;
    setError("");
    const validation = getValidation();
    if(validation) return setError(validation);
    try {
      const res = await axiosInstance.put(API_PATHS.USERS.UPDATE_USER(user._id), { name, email, profileImageUrl, newPassword, password });
      updateUser(res.data);
      return setOpenUserForm(false);
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error updating user:", error);
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      };
    }
  };

  const handleDeleteDesk = async () => {
    if(!desk) return;
    try {
      await axiosInstance.delete(API_PATHS.DESKS.DELETE_DESK(desk._id)); 
      changeDesk(undefined);
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error deleting desk:", error);
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      };
    };
  };

  return(
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <AppLayout activeMenu="">
        <div className="flex flex-col gap-10">
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-5 py-5 px-7 rounded-md border border-secondary-light dark:border-secondary-dark shadow-md dark:shadow-secondary-dark/50">
              <Image src={user?.profileImageUrl || ""} alt="Avatar" width={1000} height={1000} className="size-16 rounded-full"/>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <h1 className="font-medium text-xl text-primary-dark dark:text-primary-light">{user?.name}</h1>
                  <span className="px-3 py-1 rounded font-semibold text-xs bg-blue-light dark:bg-blue-dark text-primary-light dark:text-primary-dark">{user?.role}</span>
                </div>
                <div>
                  <p className="font-medium text-xs text-quaternary">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-5">
              <button onClick={()=>setOpenUserForm(true)} className="card-btn-fill">
                <TbUser className="text-lg"/>
                Editar
              </button>
            </div>
          </section>
{/* Desk */}
          <section className="flex flex-col gap-3">
            <div className="flex justify-between items-center gap-4 py-5 px-7 rounded-md border border-secondary-light dark:border-secondary-dark shadow-md dark:shadow-secondary-dark/50">
              <p className="font-semibold text-lg text-primary-dark dark:text-primary-light">{desk?.title}</p>
              <span className="px-3 py-1 rounded font-semibold text-xs bg-blue-light dark:bg-blue-dark text-primary-light dark:text-primary-dark">Escritorio</span>
            </div>
            <div className="flex flex-wrap gap-5">
              <Link href="/auth/desk" className="card-btn-fill">
                <PiDesktopBold className="text-lg"/>
                Cambiar
              </Link>
              <button onClick={()=>setOpenDeskForm(true)} className="card-btn-fill">
                <PiDesktopBold className="text-lg"/>
                Editar
              </button>
              <button onClick={()=>setAlert(true)} className="card-btn-red">
                <PiDesktopBold className="text-lg"/>
                Eliminar
              </button>
            </div>
          </section>
        </div>
      {openUserForm &&
        <Modal title="Editar Perfil" isOpen={openUserForm} onClose={()=>setOpenUserForm(false)}>
          <ProfilePhotoSelector imageUrl={profileImageUrl} setImageUrl={setProfileImageUrl}/>
          <InputText onChange={(value)=>setName(value)} label="*Nombre" placeholder="Nombre Completo" autoComplete="name" value={name}/>
          <InputEmail onChange={(value)=>setEmail(value)} label="*Correo" placeholder="Correo@Ejemplo.com" value={email}/>
          <InputPassword onChange={(value)=>setNewPassword(value)} label="Contraseña nueva" autoComplete="new-password" placeholder="Mínimo 8 caracteres" value={newPassword}/>
          <InputPassword onChange={(value)=>setPassword(value)} label="*Contraseña actual" autoComplete="current-password" placeholder="Mínimo 8 caracteres" value={password}/>
          <p className="min-h-5 min-w-full text-xs text-red-light dark:text-red-dark">{error}</p>
          <div className="flex justify-end">
            <button onClick={handleSubmit} className="card-btn-fill">Confirmar</button>
          </div>
        </Modal>
      }
      <DeskForm value={desk} isOpen={openDeskForm} onClose={()=>setOpenDeskForm(false)} action={(desk:TypeDesk)=>changeDesk(desk)}/>
      {alert &&
        <Modal title="Eliminar Escritorio" isOpen={alert} onClose={()=>setAlert(false)}>
          <p className="min-h-5 text-primary-dark dark:text-primary-light">¿Estás seguro de que quieres borrar el escritorio?</p>
          <div className="flex justify-end">
            <button onClick={handleDeleteDesk} className="card-btn-red">Eliminar</button>
          </div>
        </Modal>
      }
      </AppLayout>
    </ProtectedRoute>
  );
};
"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PiDesktopBold } from "react-icons/pi";
import { LuFolder, LuUser } from "react-icons/lu";
import { useAuth } from "@context/AuthContext";
import { getAvatars } from "@utils/avatars";
import { ROLES_DATA } from "@utils/data";
import ProtectedRoute from "@app/ProtectedRoute";
import AppLayout from "@components/layouts/AppLayout";
import Modal from "@components/Modal";
// import DeskForm from "@components/desk/Form";
import FormProfile from "@components/auth/FormProfile";
import Folders from "@components/folders/Folders";
import AvatarGroup from "@components/users/AvatarGroup";

export default function Profile() {
  const { user, desk } = useAuth();

  const [openFoldersForm, setOpenFoldersForm] = useState(false);
  const [openUserForm, setOpenUserForm] = useState(false);
  const [openDeskForm, setOpenDeskForm] = useState(false);

  return(
    <ProtectedRoute>
      <AppLayout activeMenu="desk">
        <div className="flex flex-col gap-10">
{/* Desk */}
          <section className="flex flex-col gap-3">
            <div className="flex flex-col gap-4 py-5 px-7 rounded-md border border-secondary-light dark:border-secondary-dark shadow-md dark:shadow-secondary-dark/50">
              <div className="flex justify-between items-center gap-4 w-full">
                <p className="font-semibold text-lg text-basic">{desk?.title}</p>
                <span className="px-3 py-1 rounded font-semibold text-xs bg-blue-light dark:bg-blue-dark text-primary-light dark:text-primary-dark">Escritorio</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="info-box-label">Miembros</label>
                <AvatarGroup maxVisible={10} avatars={desk?.members.map(user => ({ name:user.name||"", img:user.profileImageUrl||getAvatars()[0].src })) || []}/>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div className="flex flex-wrap gap-4">
                <button onClick={()=>setOpenDeskForm(true)} className="flex-1 sm:flex-none card-btn-fill">
                  <PiDesktopBold className="text-lg"/>
                  Editar
                </button>
                <button onClick={()=>setOpenFoldersForm(true)} className="flex-1 sm:flex-none card-btn-fill">
                  <LuFolder className="text-lg"/>
                  Carpetas
                </button>
              </div>
              <Link href="/" className="flex-1 sm:flex-none card-btn-red">
                <PiDesktopBold className="text-lg"/>
                Salir del escritorio
              </Link>
            </div>
          </section>
{/* User */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-5 py-5 px-7 rounded-md border border-secondary-light dark:border-secondary-dark shadow-md dark:shadow-secondary-dark/50">
              <Image src={user?.profileImageUrl || ""} alt="Avatar" width={1000} height={1000} className="size-16 rounded-full"/>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <h1 className="font-medium text-xl text-basic">{user?.name}</h1>
                  <span className="px-3 py-1 rounded font-semibold text-xs bg-blue-light dark:bg-blue-dark text-primary-light dark:text-primary-dark">{ROLES_DATA.find((role) => role.value === user?.role)?.label}</span>
                </div>
                <div>
                  <p className="font-medium text-xs text-quaternary">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-5">
              <button onClick={()=>setOpenUserForm(true)} className="card-btn-fill">
                <LuUser className="text-lg"/>
                Editar
              </button>
            </div>
          </section>
        </div>
        <Modal title="Carpetas" isOpen={openFoldersForm} onClose={()=>setOpenFoldersForm(false)}>
          {openFoldersForm && <Folders/>}
        </Modal>
        <Modal title="Editar Perfil" isOpen={openUserForm} onClose={()=>setOpenUserForm(false)}>
          {openUserForm && <FormProfile closeForm={()=>setOpenUserForm(false)}/>}
        </Modal>
        {/* <Modal title="Editar Escritorio" isOpen={openDeskForm} onClose={()=>setOpenDeskForm(false)}>
          {desk && openDeskForm && <DeskForm value={desk} closeForm={()=>setOpenDeskForm(false)}/>}
        </Modal> */}
      </AppLayout>
    </ProtectedRoute>
  );
};
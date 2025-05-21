"use client"

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { LuLogOut } from "react-icons/lu";
import { PiDesktopBold, PiDesktopDuotone } from "react-icons/pi";
import { useAuth } from "@context/AuthContext";
import { API_PATHS } from "@utils/apiPaths";
import axiosInstance from "@utils/axiosInstance";
import { TypeDesk } from "@utils/types";
import ProtectedRoute from "@app/ProtectedRoute";
import DeskForm from "@components/desk/Form";
import Modal from "@components/Modal";

export default function DeskPage() {
  const { user, logout, desk, changeDesk, removeDesk } = useAuth();
  // const router = useRouter();

  const [desks, setDesks] = useState<TypeDesk[]>();
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    if(desk) removeDesk();
    const fetchDesks = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.DESKS.GET_ALL_DESKS);
        setDesks(res.data);
      } catch (error) {
        if(!isAxiosError(error)) return console.error(error);
        if(error.response && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong. Please try again.");
        };
      };
    };
    fetchDesks();
  },[]);

  const handleDesk = (desk:TypeDesk) => {
    if(!desk) return;
    changeDesk(desk._id);
  };

  return(
    <ProtectedRoute>
      <main className="flex flex-col gap-5 p-5 min-h-screen">
        <div className="flex items-center gap-1 w-fit text-basic">
          <PiDesktopDuotone className="text-2xl"/>
          <h1 className="text-xl font-medium">Web Office</h1>
        </div>
        <div className="flex-1 flex flex-col gap-5 min-h-96 min-w-3/5 p-5 rounded border border-secondary-light dark:border-secondary-dark shadow">
          <div>
            <h1 className="font-medium text-xl text-basic">Mis Escritorios</h1>
            <p className="text-sm text-quaternary">Selecciona{user?.role === "owner" ? " o crea " : " "}un escritorio para continuar</p>
          </div>
        {desks === undefined &&
          <div className="flex flex-col gap-2">
            <span className="min-w-full min-h-16 rounded bg-secondary-light dark:bg-secondary-dark animate-pulse"/>
            <span className="min-w-full min-h-16 rounded bg-secondary-light dark:bg-secondary-dark animate-pulse"/>
            <span className="min-w-full min-h-16 rounded bg-secondary-light dark:bg-secondary-dark animate-pulse"/>
          </div>
        }
        {desks?.length === 0 && 
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center font-semibold text-lg sm:text-xl text-basic">No hay escritorios para mostrar</p>
          </div>
        }
        {desks && desks.length > 0 &&
          <ul className="flex-1 flex flex-col gap-1 max-h-72 overflow-y-auto">
          {desks?.map((desk) => (
            <li key={desk._id} className="rounded bg-transparent hover:bg-secondary-light dark:hover:bg-secondary-dark duration-300">
              <button onClick={()=>handleDesk(desk)} type="button" className="w-full overflow-hidden flex gap-2 py-3 px-4 text-start text-sm text-basic cursor-pointer">
                <span className="min-w-fit">
                  <PiDesktopBold className="text-lg"/>
                </span>
                <span className="truncate">{desk.title}</span>
              </button>
            </li>
          ))}
          </ul>
        }
        <section className={`${desks === undefined ? "hidden" : "flex"} flex-wrap-reverse justify-end gap-2`}>
          <button type="button" onClick={logout} className="flex-1 card-btn-red sm:max-w-52">
            <LuLogOut className="text-base sm:text-lg"/>
            Cerrar sesión
          </button>
          <button type="button" onClick={()=>setOpenForm(true)} className={`${user?.role === "owner" ? "card-btn-fill" : "hidden"} flex-1 sm:max-w-52`}>
            <PiDesktopBold className="text-base sm:text-lg"/>
            Crear escritorio
          </button>
        </section>
        </div>
        <Modal title="Crear Escritorio" isOpen={openForm} onClose={()=>setOpenForm(false)}>
          {user?.role === "owner" && openForm && <DeskForm closeForm={()=>setOpenForm(false)}/>}
        </Modal>
      </main>
    </ProtectedRoute>
  );
};
"use client"

import DeskForm from "@/src/components/desk/form";
import { userContext } from "@/src/context/UserContext";
import { API_PATHS } from "@/src/utils/apiPaths";
import axiosInstance from "@/src/utils/axiosInstance";
import { TypeDesk } from "@/src/utils/types";
import ProtectedRoute from "@app/ProtectedRoute";
import { useContext, useEffect, useState } from "react";
import { LuLogOut } from "react-icons/lu";
import { PiDesktopBold, PiDesktopDuotone } from "react-icons/pi";

export default function DeskPage() {
  const { user, clearUser, changeDesk } = useContext(userContext);

  const [desks, setDesks] = useState<TypeDesk[]>();
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    const fetchDesks = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.DESKS.GET_ALL_DESKS);
        setDesks(res.data);
      } catch (error) {
        console.error("Error fetching desks:", error);
      };
    };

    fetchDesks();
  },[]);

  const handleDesk = (desk:TypeDesk) => {
    if(!desk) return;
    sessionStorage.setItem("desk", desk._id);
    changeDesk(desk);
  };

  const addDesk = async (desk:TypeDesk) => {
    if(!desk) return;
    setDesks((prev) => prev ? [...prev, desk] : [desk]);
  };

  return(
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <main className="flex flex-col gap-5 p-5 min-h-screen">
        <div className="flex items-center gap-1 w-fit text-primary-dark dark:text-primary-light">
          <PiDesktopDuotone className="text-2xl"/>
          <h1 className="text-xl font-medium">Web Office</h1>
        </div>
        <div className="flex flex-col gap-5 min-h-96 min-w-3/5 p-5 rounded border border-secondary-light dark:border-secondary-dark shadow">
          <div>
            <h1 className="font-medium text-xl text-primary-dark dark:text-primary-light">Mis Escritorios</h1>
            <p className="text-sm text-quaternary">Selecciona un escritorio para continuar</p>
          </div>
        {desks === undefined &&
          <div className="flex flex-col gap-2">
            <span className="min-w-full min-h-16 rounded bg-secondary-light dark:bg-secondary-dark animate-pulse"/>
            <span className="min-w-full min-h-16 rounded bg-secondary-light dark:bg-secondary-dark animate-pulse"/>
            <span className="min-w-full min-h-16 rounded bg-secondary-light dark:bg-secondary-dark animate-pulse"/>
          </div>
        }
        {desks?.length === 0 && 
          <div className="flex-1 flex items-center justify-center flex-col gap-5">
            <p className="text-sm text-center">No hay escritorios para mostrar</p>
          </div>
        }
        <ul className="flex-1 flex flex-col gap-1 max-h-72 overflow-y-auto">
        {desks?.map((desk) => (
          <li key={desk._id} className="rounded bg-transparent hover:bg-secondary-light dark:hover:bg-secondary-dark duration-300">
            <button onClick={()=>handleDesk(desk)} type="button" className="w-full overflow-hidden flex gap-2 py-3 px-4 text-start text-sm text-primary-dark dark:text-primary-light cursor-pointer">
              <span className="min-w-fit">
                <PiDesktopBold className="text-lg"/>
              </span>
              <span className="truncate">{desk.title}</span>
            </button>
          </li>
        ))}
        </ul>
        <section className={`${desks === undefined ? "hidden" : "flex"} flex-wrap items-center justify-end gap-4`}>
          <button type="button" onClick={()=>setOpenForm(true)} className={`${user?.role === "admin" ? "card-btn-fill" : "hidden"}`}>
            <PiDesktopBold className="text-lg sm:text-xl"/>
            Crear escritorio
          </button>
          <button type="button" onClick={clearUser} className="card-btn-red">
            <LuLogOut className="text-lg sm:text-xl"/>
            Cerrar sesión
          </button>
        </section>
        </div>
        <DeskForm action={(desk:TypeDesk)=>addDesk(desk)} isOpen={openForm} onClose={()=>setOpenForm(false)}/>
      </main>
    </ProtectedRoute>
  );
};
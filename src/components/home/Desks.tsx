import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { PiDesktopBold } from "react-icons/pi";
import { LuLogOut } from "react-icons/lu";
import { useAuth } from "@context/AuthContext";
import { TypeDesk } from "@utils/types";
import { API_PATHS } from "@utils/apiPaths";
import axiosInstance from "@utils/axiosInstance";
// import DeskForm from "@components/desk/Form";
// import Modal from "@components/Modal";
import Skeleton from "@components/Skeleton";

export default function HomeDesks() {
  const { user, logout, desk, changeDesk, removeDesk } = useAuth();

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
    <section className="flex-1 flex flex-col gap-2 min-h-96 min-w-3/5 p-2 sm:p-5 rounded border border-secondary-light dark:border-secondary-dark shadow">
      <div>
        <h1 className="font-medium text-lg sm:text-xl text-basic">Mis Escritorios</h1>
        <p className="text-xs sm:text-sm text-quaternary">Selecciona{user?.role === "owner" ? " o crea " : " "}un escritorio para continuar</p>
      </div>
    {desks === undefined &&
      <div className="flex-1 flex flex-col gap-2 min-h-full">
      {[1,2].map((i)=>(
        <div key={`tab-${i}`} className="flex min-h-14 sm:min-h-16 max-h-16 min-w-full">
          <Skeleton/>
        </div>
      ))}
      </div>
    }
    {desks?.length === 0 && 
      <span className="flex-1 flex items-center justify-center">
        <p className="text-center font-semibold text-lg sm:text-xl text-basic">No hay escritorios para mostrar</p>
      </span>
    }
    {desks && desks.length > 0 &&
      <ul className="flex-1 flex flex-col gap-1 overflow-y-auto">
      {desks?.map((desk) => (
        <li key={desk._id} className="flex items-center rounded-lg bg-transparent min-h-16 hover:bg-secondary-light dark:hover:bg-secondary-dark duration-300">
          <button onClick={()=>handleDesk(desk)} type="button" className="flex items-center gap-2 w-full px-5 py-1 overflow-hidden text-start text-sm text-basic cursor-pointer">
            <span className="min-w-fit">
              <PiDesktopBold className="text-2xl"/>
            </span>
            <span className="truncate text-xl">{desk.title}</span>
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
      {/* <Modal title="Crear Escritorio" isOpen={openForm} onClose={()=>setOpenForm(false)}>
        {user?.role === "owner" && openForm && <DeskForm closeForm={()=>setOpenForm(false)}/>}
      </Modal> */}
    </section>
  );
};
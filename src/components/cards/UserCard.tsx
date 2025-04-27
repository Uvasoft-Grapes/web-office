import { getAvatars } from "@utils/avatars";
import { TypeUser } from "@utils/types";
import Image from "next/image";
import StatCard from "@components/cards/StatCard";
import DeleteAlert from "@components/DeleteAlert";
import { useContext, useState } from "react";
import Modal from "@components/Modal";
import axiosInstance from "@utils/axiosInstance";
import { API_PATHS } from "@utils/apiPaths";
import { userContext } from "@context/UserContext";
import toast from "react-hot-toast";

export default function UserCard({ info }:{ info:TypeUser }) {
  const user = useContext(userContext).user;

  const [openAlert, setOpenAlert] = useState(false);
  const [changeRole, setChangeRole] = useState(false);

  const handleAlert = () => {
    if(user?._id !== info._id) setOpenAlert(!openAlert);
  };

  const deleteUser = async () => {
    try {
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(info._id));
      setOpenAlert(false);
    } catch (error) {
      console.error({ message:"Error deleting user:" }, error)
    }
  };

  const handleRole = async (role:"admin"|"user") => {
    try {
      await axiosInstance.put(API_PATHS.USERS.UPDATE_ROLE(info._id), { role });
      toast.success("Rol modificado.");
      info.role = role;
      setChangeRole(false);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Error al modificar el rol.");
    }
  };

  return(
    <li className="user-card p-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 w-full">
          <Image onClick={handleAlert} src={info.profileImageUrl || getAvatars()[0]} alt={info.name} width={100} height={100} className={`size-12 rounded-full border-2 border-quaternary ${user?._id !== info._id && "hover:border-red-light cursor-pointer"} duration-300`}/>
          <div className="w-full">
            <div className="flex items-center justify-between">
              <p className="text-sm text-primary-dark dark:text-primary-light">{info.name}</p>
              <button type="button" onClick={()=>setChangeRole(true)} className="font-semibold text-[10px] px-2 py-0.5 rounded bg-blue-light dark:bg-blue-dark text-primary-light dark:text-primary-dark hover:opacity-50 cursor-pointer duration-300">{info.role}</button>
            </div>
            <p className="text-xs text-quaternary">{info.email}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-5">
        <StatCard label="Pendientes" count={info.pendingTasks || 0}/>
        <StatCard label="En curso" count={info.inProgressTasks || 0}/>
        <StatCard label="Finalizadas" count={info.completedTasks || 0}/>
      </div>
      <Modal isOpen={openAlert} onClose={()=>setOpenAlert(false)} title="Eliminar Usuario">
        <DeleteAlert
          content="¿Estas seguro de eliminar este usuario?"
          onDelete={deleteUser}
        />
      </Modal>
      <Modal isOpen={changeRole} onClose={()=>setChangeRole(false)} title="Modificar Rol">
        <div className="flex flex-col gap-4">
          <h4 className="text-primary-dark dark:text-primary-light">Elige un tipo de usuario</h4>
          <div className="flex gap-2">
            <button onClick={()=>handleRole("admin")} className={`w-20 h-8 rounded-md font-medium text-sm border-2 border-primary-dark dark:border-primary-light ${info.role === "admin" ? "text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light" : "text-primary-dark dark:text-primary-light bg-transparent opacity-75"} cursor-pointer duration-300`}>Admin</button>
            <button onClick={()=>handleRole("user")} className={`w-20 h-8 rounded-md font-medium text-sm border-2 border-primary-dark dark:border-primary-light ${info.role === "user" ? "text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light" : "text-primary-dark dark:text-primary-light bg-transparent opacity-75"} cursor-pointer duration-300`}>User</button>
          </div>
        </div>
      </Modal>
    </li>
  );
};
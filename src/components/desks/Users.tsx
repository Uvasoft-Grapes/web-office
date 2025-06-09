import { useEffect, useState } from "react";
import Image from "next/image";
import { LuCheck, LuUsers } from "react-icons/lu";
import { useAuth } from "@context/AuthContext";
import { API_PATHS } from "@utils/apiPaths";
import axiosInstance from "@utils/axiosInstance";
import { TypeUser } from "@utils/types";
import { getAvatars } from "@utils/avatars";
import Modal from "@components/Modal";
import AvatarGroup from "@components/users/AvatarGroup";

export default function UsersSelect({ label, selectedUsers, setSelectedUsers }:{ label?:string, selectedUsers:TypeUser[], setSelectedUsers:(users:TypeUser[])=>void }) {
  const { user } = useAuth();

  const [allUsers, setAllUsers] = useState<TypeUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState<TypeUser[]>([]);

  const getAllUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      setAllUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleUserSelection = (user:TypeUser) => {
    if(tempSelectedUsers.some(temp => temp._id === user._id)) return setTempSelectedUsers(tempSelectedUsers.filter(temp => temp._id !== user._id));
    setTempSelectedUsers([ ...tempSelectedUsers, user ]);
  };

  const handleMembers = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  useEffect(() => {
    getAllUsers();
  },[]);

  useEffect(() => {
    setTempSelectedUsers(selectedUsers);
    return () => {};
  },[selectedUsers]);

  return(
    <div className="flex flex-col gap-2">
      <label className="font-medium text-sm text-tertiary-dark dark:text-tertiary-light">{label}</label>
      <div className="flex flex-wrap justify-between gap-4">
        <div onClick={()=>setIsModalOpen(true)} className="w-fit">
          <AvatarGroup
            maxVisible={10}
            avatars={tempSelectedUsers.map(user => ({ name:user.name||"", img:user.profileImageUrl||getAvatars()[0].src })) || []}
          />
        </div>
        <button type="button" onClick={() => setIsModalOpen(true)} className="card-btn">
          <LuUsers className="text-sm"/>
          Agregar miembros
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} title="Seleccionar miembros">
        <ul className="flex-1 overflow-y-auto">
        {allUsers.map(member => (
          <li key={member._id} className="flex items-center gap-4 p-3 border-b border-secondary-light dark:border-secondary-dark">
            <div className="flex flex-col items-center gap-1">
              <Image
                src={member.profileImageUrl || getAvatars()[0].src}
                alt={member.name}
                width={50}
                height={50}
                className="size-12 rounded-full"
              />
              <span className="rounded-md w-12 py-0.5 text-center font-semibold text-xs text-primary-light dark:text-primary-dark bg-blue-light dark:bg-blue-dark">{member.role}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-medium text-base sm:text-lg text-basic">{member.name}</p>
              <p className="text-xs sm:text-sm text-quaternary">{member.email}</p>
            </div>
            <input
              type="checkbox"
              disabled={member._id === user?._id}
              checked={tempSelectedUsers.some(temp => temp._id === member._id)}
              onChange={() => toggleUserSelection(member)}
              className="size-4"
            />
          </li>
        ))}
        </ul>
        <div className="flex flex-wrap-reverse justify-end gap-2 w-full">
          <button type="button" onClick={handleMembers} className="flex-1 card-btn-fill sm:max-w-52">
            <LuCheck className="text-xl"/>
            Confirmar
          </button>
        </div>
      </Modal>
    </div>
  );
};
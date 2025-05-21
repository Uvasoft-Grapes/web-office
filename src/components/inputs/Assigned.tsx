import { useEffect, useState } from "react";
import Image from "next/image";
import { LuCheck, LuUsers } from "react-icons/lu";
import axiosInstance from "@utils/axiosInstance";
import { API_PATHS } from "@utils/apiPaths";
import { TypeAssigned, TypeUser } from "@utils/types";
import { getAvatars } from "@utils/avatars";
import Modal from "@components/Modal";
import AvatarGroup from "@components/users/AvatarGroup";

export default function AssignedSelect({ label, selectedUsers, setSelectedUsers }:{ label?:string, selectedUsers:TypeAssigned[], setSelectedUsers:(users:TypeAssigned[])=>void }) {
  const [allUsers, setAllUsers] = useState<TypeUser[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState<TypeAssigned[]>([]);

  const getAllUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USERS.GET_MEMBERS);
      setAllUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleUserSelection = (userId:string) => {
    if(tempSelectedUsers.some(temp => temp._id === userId)) return setTempSelectedUsers(tempSelectedUsers.filter(temp => temp._id !== userId));
    setTempSelectedUsers([ ...tempSelectedUsers, { _id:userId } ]);
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setOpenModal(false);
  };

  const selectedUsersAvatars = allUsers.filter(user => selectedUsers.some(someUser => someUser._id === user._id)).map((assigned) => ({ name:assigned.name||"", img:assigned.profileImageUrl||getAvatars()[0].src }));

  useEffect(() => {
    getAllUsers();
  },[]);

  useEffect(() => {
    setTempSelectedUsers(selectedUsers);
    return () => {};
  },[selectedUsers]);

  return(
    <div className="flex flex-col gap-1">
      <label className="font-medium text-sm text-tertiary-dark dark:text-tertiary-light">{label}</label>
    {selectedUsersAvatars.length <= 0 ?
      <button type="button" onClick={() => setOpenModal(true)} className="card-btn">
        <LuUsers className="text-sm"/>
        Asignar miembros
      </button>
    :
      <div onClick={()=>setOpenModal(true)} className="w-full h-full cursor-pointer">
        <AvatarGroup
          avatars={selectedUsersAvatars}
          maxVisible={3}
        />
      </div>
    }
      <Modal isOpen={openModal} onClose={()=>setOpenModal(false)} title="Seleccionar miembros">
        <ul className="flex-1 overflow-y-auto">
        {allUsers.map(user => (
          <li key={user._id} className="flex items-center gap-4 p-3 border-b border-secondary-light dark:border-secondary-dark">
            <Image
              src={user.profileImageUrl || getAvatars()[0].src}
              alt={user.name}
              width={50}
              height={50}
              className="size-10 rounded-full"
            />
            <div className="flex-1 overflow-hidden">
              <p className="font-medium text-sm sm:text-base text-basic">{user.name}</p>
              <p className="text-xs sm:text-sm text-quaternary">{user.email}</p>
            </div>
            <input
              type="checkbox"
              checked={tempSelectedUsers.some(temp => temp._id === user._id)}
              onChange={() => toggleUserSelection(user._id)}
              className="size-4"
            />
          </li>
        ))}
        </ul>
        <div className="flex flex-wrap-reverse justify-end gap-2">
          <button type="button" onClick={handleAssign} className="flex-1 card-btn-fill sm:max-w-52">
            <LuCheck className="text-xl"/>
            Confirmar
          </button>
        </div>
      </Modal>
    </div>
  );
};
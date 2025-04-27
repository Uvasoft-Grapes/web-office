import { API_PATHS } from "@utils/apiPaths";
import axiosInstance from "@utils/axiosInstance";
import { TypeAssigned, TypeUser } from "@utils/types";
import { useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";
import Modal from "@components/Modal";
import Image from "next/image";
import { getAvatars } from "@utils/avatars";
import AvatarGroup from "@components/AvatarGroup";

export default function SelectUsers({ selectedUsers, setSelectedUsers }:{ selectedUsers:TypeAssigned[], setSelectedUsers:(users:TypeAssigned[])=>void }) {
  const [allUsers, setAllUsers] = useState<TypeUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState<TypeAssigned[]>([]);
  
  const getAllUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
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
    setIsModalOpen(false);
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
    <div className="space-y-4 mt-2">
    {selectedUsersAvatars.length <= 0 ?
      <button type="button" onClick={() => setIsModalOpen(true)} className="card-btn">
        <LuUsers className="text-sm"/>
        Agregar participantes
      </button>
    :
      <div onClick={()=>setIsModalOpen(true)} className="w-fit cursor-pointer">
        <AvatarGroup
          avatars={selectedUsersAvatars}
          maxVisible={3}
        />
      </div>
    }
      <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} title="Seleccionar usuarios">
        <ul className="space-y-4 h-[60vh] overflow-y-auto">
        {allUsers.map(user => (
          <li key={user._id} className="flex items-center gap-4 p-3 border-b border-secondary-light dark:border-secondary-dark">
            <Image
              src={user.profileImageUrl || getAvatars()[0].src}
              alt={user.name}
              width={50}
              height={50}
              className="size-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium text-primary-dark dark:text-primary-light">{user.name}</p>
              <p className="text-[12px] text-quaternary">{user.email}</p>
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
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={() => setIsModalOpen(false)} className="card-btn-red">Cancelar</button>
          <button type="button" onClick={handleAssign} className="card-btn-fill">Confirmar</button>
        </div>
      </Modal>
    </div>
  );
};
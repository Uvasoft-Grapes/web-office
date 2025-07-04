import { getAvatars } from "@utils/avatars";
import { TypeInventory } from "@utils/types";
import { addThousandsSeparator } from "@utils/helper";
import AvatarGroup from "@components/users/AvatarGroup";
import { LuMapPin, LuPencil } from "react-icons/lu";
import { useState } from "react";
import Modal from "../Modal";
import Items from "./Items";
import InventoryForm from "./InventoryForm";

export default function InventoryCard({ inventory, refresh }:{ inventory:TypeInventory, refresh:()=>void }) {
  const { _id, folder, title, assignedTo, location, items, quantity } = inventory;
  const selectedUsersAvatars = assignedTo.map((assigned) => ({ name:assigned.name||"", img:assigned.profileImageUrl||getAvatars()[0].src }));

  const [openForm, setOpenForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const onRefresh = () => {
    refresh();
    setOpenForm(false);
  };

  return(
    <>
      <li className="flex flex-col gap-2 bg-secondary-light dark:bg-secondary-dark hover:bg-transparent rounded-xl p-6 border border-tertiary-light dark:border-tertiary-dark shadow-md shadow-quaternary dark:shadow-secondary-dark duration-300">
        <section className="flex-1 flex gap-2">
          <div className="flex-1 flex flex-col gap-1">
            <p className="px-2 sm:px-4 py-0.5 w-fit rounded text-nowrap font-semibold text-xs text-blue-light dark:text-blue-dark bg-blue-light/20 dark:bg-blue-dark/20">{folder.title}</p>
            <p className="line-clamp-1 font-semibold text-xl text-basic">{title}</p>
            <span className="flex items-center gap-0.5 text-quaternary">
              <LuMapPin className="text-xs min-w-fit"/>
              <p className="line-clamp-1 text-xs">{location}</p>
            </span>
          </div>
          <button type="button" onClick={()=>setOpenForm(true)} className="flex items-center justify-center size-10 rounded-md hover:bg-secondary-light dark:hover:bg-secondary-dark cursor-pointer duration-300">
            <LuPencil/>
          </button>
        </section>
        <section className="">
          <AvatarGroup avatars={selectedUsersAvatars || []} maxVisible={3}/>
        </section>
        <section className="flex flex-wrap justify-between gap-2 py-2">
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-xs text-quaternary">Artículos</p>
            <p className="font-semibold text-xl">{addThousandsSeparator(items?.length || 0)}</p>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-xs text-quaternary">Stock</p>
            <p className="font-semibold text-xl">{addThousandsSeparator(quantity || 0)}</p>
          </div>
        </section>
        <section className="flex flex-wrap items-end gap-2">
          <button type="button" onClick={()=>setOpenModal(true)} className="flex-1 card-btn-fill">Abrir</button>
        </section>
      </li>
      <Modal title="Editar Inventario" isOpen={openForm} onClose={()=>setOpenForm(false)}>
        {openForm && <InventoryForm values={inventory} refresh={onRefresh}/>}
      </Modal>
      <Modal title={inventory.title} isOpen={openModal} onClose={()=>setOpenModal(false)}>
        <Items inventory={_id} items={items || []} refresh={refresh}/>
      </Modal>
    </>
  );
};
import { useState } from "react";
import { format, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { TypeEvent } from "@utils/types";
import { getAvatars } from "@utils/avatars";
import Modal from "@components/Modal";
import AvatarGroup from "@components/users/AvatarGroup";
import EventDetails from "@components/calendar/Details";

export default function EventCard({ event, refresh }:{ event:TypeEvent, refresh:()=>void }) {

  const { folder, title, description, startDate, endDate, assignedTo } = event;
  const avatars = assignedTo.map((assigned) => ({ name:assigned.name||"", img:assigned.profileImageUrl||getAvatars()[0].src }));

  const [openModal, setOpenModal] = useState(false);

  return(
    <>
      <li onClick={()=>setOpenModal(true)} className="flex flex-col gap-3 h-full bg-secondary-light dark:bg-secondary-dark hover:bg-transparent rounded-xl py-4 border border-tertiary-light dark:border-tertiary-dark shadow-md shadow-quaternary dark:shadow-secondary-dark cursor-pointer duration-300">
        <span className="self-end w-fit mx-4 px-2 sm:px-4 py-0.5 rounded text-nowrap font-semibold text-xs text-blue-light dark:text-blue-dark bg-blue-light/20 dark:bg-blue-dark/20">{folder.title}</span>
        <div className={`flex flex-col gap-0.5 px-4 mr-4 border-l-[3px] ${isToday(startDate) || isToday(endDate) ? "border-primary-dark dark:border-primary-light" : "border-tertiary-light dark:border-tertiary-dark" }`}>
          <p className="line-clamp-1 font-semibold text-sm text-basic">{title}</p>
          <p className="line-clamp-1 leading-[18px] text-xs text-quaternary">{description}</p>
        </div>
        <div className="flex items-center justify-between my-1 mx-4">
          <div className="">
            <label className="font-medium text-xs text-quaternary">Inicio</label>
            <p className="font-medium text-[13px] text-tertiary-dark dark:text-tertiary-light">{format(startDate, "dd/MM/yyyy", { locale:es })}</p>
            <p className="font-medium text-[13px] text-tertiary-dark dark:text-tertiary-light">{format(startDate, "hh:mm:ss a", { locale:es })}</p>
          </div>
          <div className="">
            <label className="font-medium text-xs text-quaternary">Final</label>
            <p className="font-medium text-[13px] text-tertiary-dark dark:text-tertiary-light">{format(endDate, "dd/MM/yyyy", { locale:es })}</p>
            <p className="font-medium text-[13px] text-tertiary-dark dark:text-tertiary-light">{format(endDate, "hh:mm:ss a", { locale:es })}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mx-4">
          <AvatarGroup avatars={avatars} maxVisible={3}/>
        </div>
      </li>
      <Modal title={title} isOpen={openModal} onClose={()=>setOpenModal(false)}>
        {openModal && <EventDetails event={event} avatars={avatars} refresh={refresh}/>}
      </Modal> 
    </>
  );
};
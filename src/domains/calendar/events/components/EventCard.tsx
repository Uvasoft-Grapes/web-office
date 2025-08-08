import { useState } from "react";
import { format, isBefore, isSameMonth, isToday, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import { TypeEvent } from "@shared/utils/types";
import { getAvatars } from "@shared/utils/avatars";
import Modal from "@shared/components/Modal";
import AvatarGroup from "@users/components/AvatarGroup";
import EventDetails from "@events/components/EventDetails";

export default function EventCard({ date, event, refresh }:{ date:Date, event:TypeEvent, refresh:()=>void }) {

  const { folder, title, description, allDay, start, end, assignedTo } = event;
  const avatars = assignedTo.map((assigned) => ({ name:assigned.name||"", img:assigned.profileImageUrl||getAvatars()[0].src }));

  const [openModal, setOpenModal] = useState(false);

  return(
    <>
      <li onClick={()=>setOpenModal(true)} className={`flex flex-col gap-3 h-full bg-secondary-light dark:bg-secondary-dark hover:bg-transparent dark:hover:bg-transparent rounded-xl py-4 border border-tertiary-light dark:border-tertiary-dark shadow-md shadow-quaternary dark:shadow-secondary-dark cursor-pointer duration-300 ${isSameMonth(start, date) ? "opacity-100" : "opacity-50 hover:opacity-100" }`}>
        <span className="self-end w-fit mx-4 px-2 sm:px-4 py-0.5 rounded text-nowrap font-semibold text-xs text-blue-light dark:text-blue-dark bg-blue-light/20 dark:bg-blue-dark/20">{folder.title}</span>
        <div className={`flex flex-col gap-0.5 px-4 mr-4 border-l-[3px] ${isBefore(start, startOfToday()) && isBefore(end, startOfToday()) ? "border-red-light dark:border-red-dark" : isToday(start) || isToday(end) ? "border-green-light dark:border-green-dark" : isSameMonth(start, date) ? "border-yellow-light dark:border-yellow-dark" : "border-primary-dark dark:border-primary-light"}`}>
          <p className="line-clamp-1 font-semibold text-sm text-basic">{title}</p>
          <p className="line-clamp-1 leading-[18px] text-xs text-quaternary">{description}</p>
        </div>
        <div className="flex items-center justify-between my-1 mx-4">
          <div className="">
            <label className="font-medium text-xs text-quaternary">Inicio</label>
            <p className="font-medium text-[13px] text-tertiary-dark dark:text-tertiary-light">{format(start, "dd/MM/yyyy", { locale:es })}</p>
            {!allDay && <p className="font-medium text-[13px] text-tertiary-dark dark:text-tertiary-light">{format(start, "hh:mm:ss a", { locale:es })}</p>}
          </div>
          <div className="">
            <label className="font-medium text-xs text-quaternary">Final</label>
            <p className="font-medium text-[13px] text-tertiary-dark dark:text-tertiary-light">{format(end, "dd/MM/yyyy", { locale:es })}</p>
            {!allDay && <p className="font-medium text-[13px] text-tertiary-dark dark:text-tertiary-light">{format(end, "hh:mm:ss a", { locale:es })}</p>}
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
import { useState } from "react";
import { format, isEqual, isWithinInterval, setHours, setMinutes, startOfHour } from "date-fns";
import { es } from "date-fns/locale";
import { TypeEvent } from "@shared/utils/types";
import Modal from "@shared/components/Modal";

export default function Day({ isSameMonth, isToday, day, events }:{ isSameMonth:boolean, isToday:boolean, day:Date, events:TypeEvent[] }) {
  const [openModal, setOpenModal] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => setMinutes(setHours(day, i), 0));

  const getEventsForHour = (hour: Date) => {
    return events.filter(event =>
      isWithinInterval(hour, { start:event.startDate, end:event.endDate }) || isEqual(startOfHour(hour), startOfHour(event.startDate))
    );
  };

  return(
    <>
      <button
        type="button"
        onClick={events.length > 0 ? ()=>setOpenModal(true) : ()=>{}}
        className={`relative p-2 w-10 sm:w-14 h-10 sm:h-14 rounded-lg ${isSameMonth ? "text-primary-dark dark:text-primary-light" : "text-quaternary/50"} ${isToday ? "font-semibold bg-secondary-light dark:bg-secondary-dark" : "font-medium"} hover:bg-tertiary-light dark:hover:bg-tertiary-dark border-2 ${events.length > 0 ? "border-primary-dark dark:border-quaternary cursor-pointer" : "border-transparent"} duration-300 group`}
      >
        <span className="w-full text-end text-xs sm:text-sm">{format(day, "d")}</span>
        {events.length > 0  && <span className="absolute top-1 right-1 hidden sm:group-hover:flex items-center justify-center size-5 rounded-full font-semibold text-[10px] text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light">{events.length < 10 ? events.length : "+9"}</span>}
      </button>
      {openModal &&
        <Modal title={format(day, "EEEE, d MMMM yyyy", { locale:es })} isOpen={openModal} onClose={()=>setOpenModal(false)}>
          <div className="border-t border-tertiary-light dark:border-tertiary-dark overflow-auto">
            {hours.map((hour, index) => {
              const hourEvents = getEventsForHour(hour);
              return (
                <div key={index} className="min-h-32 border-b border-tertiary-light dark:border-tertiary-dark p-2 flex flex-col sm:flex-row items-center gap-2 group">
                  <span className="font-semibold text-xl sm:text-base text-quaternary group-hover:text-primary-dark group-hover:dark:text-primary-light duration-300">{format(hour, "hh:mm a", { locale:es })}</span>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 w-full overflow-x-auto">
                    {hourEvents.length < 1 && <span className="col-span-1 sm:col-span-2 xl:col-span-3 flex items-center justify-center py-2 px-6 min-h-28 rounded-lg font-semibold text-lg text-quaternary/50">Sin eventos</span>}
                    {hourEvents.map((event, i) => (
                      <div key={i} className="flex flex-col gap-0.5 py-2 px-6 min-h-28 w-full rounded-lg text-start bg-secondary-light dark:bg-secondary-dark hover:bg-transparent duration-300">
                        <div className="flex flex-wrap justify-between gap-2 font-semibold text-xs text-quaternary">
                          <div className="flex flex-col gap-0.5">
                            <span>{format(event.startDate, "dd/MM/yyyy", { locale:es })}</span>
                            <span>{format(event.startDate, "hh:mm:ss", { locale:es })}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span>{format(event.endDate, "dd/MM/yyyy", { locale:es })}</span>
                            <span>{format(event.endDate, "hh:mm:ss", { locale:es })}</span>
                          </div>
                        </div>
                        <p className="font-medium text-xs sm:text-sm text-primary-dark dark:text-primary-light">{event.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      }
    </>
  );
};
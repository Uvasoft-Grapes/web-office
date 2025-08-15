import { useState } from "react";
import { format, isEqual, isWithinInterval, setHours, setMinutes, startOfHour } from "date-fns";
import { es } from "date-fns/locale";
import { TypeEvent } from "@shared/utils/types";
import Modal from "@shared/components/Modal";
import EventForm from "../events/components/EventForm";


export default function Day({
  isSameMonth,
  isToday,
  day,
  events,
  refresh,
}: {
  isSameMonth: boolean;
  isToday: boolean;
  day: Date;
  events: TypeEvent[];
  refresh: () => void;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) =>
    setMinutes(setHours(day, i), 0)
  );

  const getEventsForHour = (hour: Date) => {
    return events.filter(
      (event) =>
        isWithinInterval(hour, { start: event.start, end: event.end }) ||
        isEqual(startOfHour(hour), startOfHour(event.start))
    );
  };

  const hasEvents = events.length > 0;
  const dayNumber = format(day, "d", { locale:es });
  const dayLabel = format(day, "EEEE, d 'de' MMMM yyyy", { locale: es });

  return (
    <>
      <div
        role="gridcell"
        aria-selected={isToday}
        aria-label={`Día ${dayNumber}, ${dayLabel}${
          hasEvents ? ", contiene eventos" : ""
        }`}
        className="flex items-center justify-center w-full h-full"
      >
        <button
          type="button"
          onClick={hasEvents ? () => setOpenModal(true) : () => setOpenForm(true)}
          aria-label={`Ver eventos para el ${dayLabel}`}
          className={`
            relative p-2 w-full h-full rounded-lg hover:bg-tertiary-light dark:hover:bg-tertiary-dark cursor-pointer duration-300 group border-2
            ${hasEvents ? "border-primary-dark dark:border-quaternary" : "border-transparent"}
            ${isSameMonth ? "text-primary-dark dark:text-primary-light" : "opacity-25"}
            ${isToday ? "font-semibold bg-secondary-light dark:bg-secondary-dark" : "font-medium"}
          `}
        >
          <span className="sr-only">{dayLabel}</span>
          <span className="w-full text-xs sm:text-sm">{dayNumber}</span>
          {hasEvents && <span className="absolute top-1 right-1 hidden sm:group-hover:flex items-center justify-center size-5 rounded-full font-semibold text-[10px] text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light">{events.length < 10 ? events.length : "+9"}</span>}
        </button>
      </div>

      <Modal title="Crear Evento" isOpen={openForm} onClose={() => setOpenForm(false)}>
        {openForm && <EventForm defaultDate={day} closeForm={()=>setOpenForm(false)} refresh={refresh}/>}
      </Modal>

      {openModal && (
        <Modal
          title={dayLabel}
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <div className="border-t border-tertiary-light dark:border-tertiary-dark overflow-auto">
            <table
              className="w-full text-left border-collapse"
              aria-label={`Tabla de eventos por hora para el ${dayLabel}`}
            >
              <thead>
                <tr className="flex gap-5">
                  <th className="p-2 text-quaternary text-sm font-semibold w-1/10">
                    Hora
                  </th>
                  <th className="flex-1 p-2 text-quaternary text-sm font-semibold">
                    Eventos
                  </th>
                </tr>
              </thead>
              <tbody>
                {hours.map((hour, index) => {
                  const hourEvents = getEventsForHour(hour);
                  return (
                    <tr
                      key={index}
                      className="flex gap-2 border-b border-tertiary-light dark:border-tertiary-dark opacity-50 hover:opacity-100 duration-300"
                    >
                      <td className="min-w-fit w-1/10 p-2 align-top whitespace-nowrap text-sm text-quaternary font-semibold">
                        {format(hour, "hh:mm a", { locale: es })}
                      </td>
                      <td className="flex-1 p-2">
                        {hourEvents.length < 1 ? (
                          <span className="block text-quaternary/50 font-semibold py-2 px-4">
                            Sin eventos
                          </span>
                        ) : (
                          <ul className="flex flex-col sm:flex-row flex-wrap gap-2">
                            {hourEvents.map((event, i) => (
                              <li
                                key={i}
                                role="group"
                                aria-label={`Evento: ${event.title}`}
                                className="flex-1 min-w-60 py-2 px-4 rounded-lg bg-secondary-light dark:bg-secondary-dark hover:bg-transparent duration-300"
                              >
                                <div className="flex justify-between text-xs font-semibold text-quaternary">
                                  <div>
                                    <div>
                                      {format(event.start, "dd/MM/yyyy", { locale:es })}
                                    </div>
                                    <div>
                                      {format(event.start, "hh:mm:ss", { locale:es })}
                                    </div>
                                  </div>
                                  <div>
                                    <div>
                                      {format(event.end, "dd/MM/yyyy", { locale:es })}
                                    </div>
                                    <div>
                                      {format(event.end, "hh:mm:ss", { locale:es })}
                                    </div>
                                  </div>
                                </div>
                                <p className="mt-1 font-medium text-xs sm:text-sm text-primary-dark dark:text-primary-light">
                                  {event.title}
                                </p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </>
  );
}





// export default function Day({
//   isSameMonth,
//   isToday,
//   day,
//   events,
// }: {
//   isSameMonth: boolean;
//   isToday: boolean;
//   day: Date;
//   events: TypeEvent[];
// }) {
//   const [openModal, setOpenModal] = useState(false);

//   const hours = Array.from({ length: 24 }, (_, i) =>
//     setMinutes(setHours(day, i), 0)
//   );

//   const hasEvents = events.length > 0;
//   const dayNumber = format(day, "d");
//   const dayLabel = format(day, "EEEE, d 'de' MMMM yyyy", { locale: es });

//   return (
//     <>
//       <div
//         role="gridcell"
//         aria-selected={isToday}
//         aria-label={`Día ${dayNumber}, ${dayLabel}${hasEvents ? ", contiene eventos" : ""}`}
//         className="flex items-center justify-center w-full h-full p-0.5"
//       >
//         {hasEvents ? (
//           <button
//             type="button"
//             onClick={() => setOpenModal(true)}
//             aria-label={`Ver eventos para el ${dayLabel}`}
//             className={`relative p-2 w-full h-10 sm:h-14 rounded-lg ${
//               isSameMonth
//                 ? "text-primary-dark dark:text-primary-light"
//                 : "text-quaternary/50"
//             } ${
//               isToday
//                 ? "font-semibold bg-secondary-light dark:bg-secondary-dark"
//                 : "font-medium"
//             } hover:bg-tertiary-light dark:hover:bg-tertiary-dark border-2 border-primary-dark dark:border-quaternary cursor-pointer duration-300 group`}
//           >
//             <span className="w-full text-xs sm:text-sm">
//               {dayNumber}
//             </span>
//             <span className="sr-only">{dayLabel}</span>
//             <span className="absolute top-1 right-1 hidden sm:group-hover:flex items-center justify-center size-5 rounded-full font-semibold text-[10px] text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light">
//               {events.length < 10 ? events.length : "+9"}
//             </span>
//           </button>
//         ) : (
//           <div
//             className={`relative flex items-center justify-center p-2 w-full h-10 sm:h-14 rounded-lg ${
//               isSameMonth
//                 ? "text-primary-dark dark:text-primary-light"
//                 : "text-quaternary/50"
//             } ${
//               isToday
//                 ? "font-semibold bg-secondary-light dark:bg-secondary-dark"
//                 : "font-medium"
//             } border-2 border-transparent duration-300`}
//           >
//             <span className="w-full text-xs sm:text-sm">
//               {dayNumber}
//             </span>
//             <span className="sr-only">{dayLabel}</span>
//           </div>
//         )}
//       </div>

//       {openModal && (
//         <Modal
//           title={dayLabel}
//           isOpen={openModal}
//           onClose={() => setOpenModal(false)}
//         >
//           <div
//             className="relative h-[1440px] border-t border-tertiary-light dark:border-tertiary-dark overflow-y-auto"
//             aria-label={`Listado de eventos visuales por hora para el ${dayLabel}`}
//           >
//             {/* Líneas horarias opcionales */}
//             {hours.map((hour, i) => (
//               <div
//                 key={i}
//                 className="absolute left-0 w-full border-b border-tertiary-light dark:border-tertiary-dark text-xs text-quaternary bg-green-200"
//                 style={{ top: `${i * 60}px`, height: '60px' }}
//               >
//                 <span className="absolute -left-12">{format(hour, "HH:mm")}</span>
//               </div>
//             ))}

//             {/* Eventos posicionados */}
//             {events.map((event, index) => {
//               const startMinutes = differenceInMinutes(event.start, startOfDay(day));
//               const endMinutes = differenceInMinutes(event.end, startOfDay(day));
//               const duration = Math.max(endMinutes - startMinutes, 30); // mínimo visual

//               return (
//                 <div
//                   key={index}
//                   role="group"
//                   aria-label={`Evento: ${event.title}`}
//                   className="absolute left-12 right-2 px-2 py-1 rounded-lg bg-secondary-light dark:bg-secondary-dark overflow-hidden text-xs sm:text-sm shadow-md"
//                   style={{
//                     top: `${startMinutes}px`,
//                     height: `${duration}px`,
//                   }}
//                 >
//                   <p className="font-semibold text-primary-dark dark:text-primary-light truncate">
//                     {event.title}
//                   </p>
//                   <p className="text-quaternary">
//                     {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </Modal>
//       )}
//     </>
//   );
// }
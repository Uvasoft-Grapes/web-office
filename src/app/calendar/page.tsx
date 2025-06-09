"use client"

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { addMonths, format, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { LuCircleChevronLeft, LuCircleChevronRight, LuPlus } from "react-icons/lu";
import { useAuth } from "@context/AuthContext";
import axiosInstance from "@utils/axiosInstance";
import { TypeEvent, TypeFolder } from "@utils/types";
import { API_PATHS } from "@utils/apiPaths";
import ProtectedRoute from "@app/ProtectedRoute"
import AppLayout from "@components/layouts/AppLayout"
import Calendar from "@components/calendar/Calendar";
import EventCard from "@components/calendar/Card";
import FolderSelect from "@components/folders/Select";
import Skeleton from "@components/Skeleton";
import Modal from "@components/Modal";
import EventForm from "@components/calendar/Form";

export default function CalendarPage() {
  const { user } = useAuth();

  const [events, setEvents] = useState<TypeEvent[]>();
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd", { locale:es }));
  const [filterFolder, setFilterFolder] = useState<TypeFolder|undefined>();
  const [openForm, setOpenForm] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await axiosInstance.get(`${API_PATHS.EVENTS.GET_ALL_EVENTS}?date=${date}`);
      if(res.status === 200) {
        setEvents(res.data.length > 0 ? res.data : []);
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error fetching accounts:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    };
  };

  useEffect(() => {
    fetchEvents();
    return () => {};
  },[date, filterFolder]);

  const handleFilterFolder = (value:TypeFolder|undefined) => {
    setEvents(undefined);
    setFilterFolder(value);
  };

  const handleMonth = (type:boolean) => {
    const newDate = type ? addMonths(new Date(date), 1) : subMonths(new Date(date), 1);
    setDate(format(newDate, "yyyy-MM-dd", { locale:es }));
  };

  return(
    <ProtectedRoute>
      <AppLayout activeMenu="Calendario">
        <div className="flex-1 flex flex-col gap-4 mb-10 text-basic">
          <section className="flex flex-col bg-primary-light dark:bg-primary-dark border-2 border-secondary-light dark:border-secondary-dark shadow-md rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 text-primary-dark dark:text-primary-light bg-secondary-light dark:bg-secondary-dark">
              <button onClick={()=>handleMonth(false)}>
                <LuCircleChevronLeft className="text-3xl hover:text-quaternary cursor-pointer duration-300"/>
              </button>
              <span className="text-center font-semibold">{format(new Date(date), "MMMM yyyy", { locale:es })}</span>
              <button onClick={()=>handleMonth(true)}>
                <LuCircleChevronRight className="text-3xl hover:text-quaternary cursor-pointer duration-300"/>
              </button>
            </div>
            <Calendar date={date} events={events || []}/>
          </section>
          <section className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 w-full">
              <h2 className="font-semibold text-3xl">Eventos</h2>
              <div className="flex-1 sm:flex-none sm:min-w-64">
                <FolderSelect disabled={!events ? true : false} selectedFolder={filterFolder} setSelectedFolder={handleFilterFolder}/>
              </div>
            </div>
{/* Loading */}
          {events === undefined &&
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
            {[1,2].map((i) => (
              <div key={`card-${i}`} className="flex min-h-56 md:min-h-64 min-w-full">
                <Skeleton/>
              </div>
            ))}
            </div>
          }
{/* There are tasks */}
            <ul className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
            {events?.map((event, index) => (
              <EventCard key={index} event={event} refresh={fetchEvents}/>
            ))}
            </ul>
{/* There are no tasks */}
          {events && events.length < 1 &&
            <div className="flex-1 flex items-center justify-center min-h-72">
              <p className="font-semibold text-2xl text-quaternary">No hay eventos</p>
            </div>
          }
          </section>
{/* Tools (sort, create) */}
          <section className="fixed bottom-2 xl:bottom-4 left-0 flex flex-wrap justify-end gap-2 w-full max-w-[1750px] px-3">
          {user && (user.role === "owner" || user.role === "admin") &&
            <button type="button" onClick={()=>setOpenForm(true)} className="tool-btn">
              <LuPlus className="text-xl"/>
              Crear Evento
            </button>
          }
          </section>
        </div>
{/* Modals */}
        <Modal title="Crear Evento" isOpen={openForm} onClose={()=>setOpenForm(false)}>
          {openForm && <EventForm closeForm={()=>setOpenForm(false)} refresh={fetchEvents}/>}
        </Modal>
      </AppLayout>
    </ProtectedRoute>
  );
};


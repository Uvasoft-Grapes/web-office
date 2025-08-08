import { NextResponse } from "next/server";
import { parse } from "cookie";
import { startOfMonth, endOfMonth, format, getHours, isBefore, addDays, addWeeks, addMonths, addYears, getDayOfYear } from "date-fns";
import { es } from "date-fns/locale";
import { connectDB } from "@config/db";
import { verifyDeskToken, verifyUserToken } from "@shared/middlewares/authMiddleware";
import EventModel from "@events/models/Event";
import { EVENTS_RECURRENCE_DATA } from "@shared/utils/data";
import { TypeDesk, TypeEvent, TypeUser } from "@shared/utils/types";

const addRecurrence = (allEvents:TypeEvent[], today:Date) => {
  const newEvents: TypeEvent[] = [];

  allEvents.forEach(event => {
    const cleanEvent = JSON.parse(JSON.stringify(event)); // 🔥 Elimina metadatos Mongoose
    const occurrences: TypeEvent[] = [];
    let currentStart = event.start;
    let currentEnd = event.end;
    if (!event.recurrence) {
      occurrences.push({ ...cleanEvent, startDate:currentStart, endDate:currentEnd });
    } else {
      if(!event.recurrenceEnd) return;
      switch (event.recurrence) {
        case "daily":
          while (isBefore(currentStart, event.recurrenceEnd)) {
            occurrences.push({ ...cleanEvent, startDate: currentStart, endDate: currentEnd });
            currentStart = addDays(currentStart, 1);
            currentEnd = addDays(currentEnd, 1);
          }
          break;
        case "weekly":
          while (isBefore(currentStart, event.recurrenceEnd)) {
            occurrences.push({ ...cleanEvent, startDate: currentStart, endDate: currentEnd });
            currentStart = addWeeks(currentStart, 1);
            currentEnd = addWeeks(currentEnd, 1);
          }
          break;
        case "monthly":
          while (isBefore(currentStart, event.recurrenceEnd)) {
            occurrences.push({ ...cleanEvent, startDate: currentStart, endDate: currentEnd });
            currentStart = addMonths(currentStart, 1);
            currentEnd = addMonths(currentEnd, 1);
          }
          break;
        case "yearly":
          while (isBefore(currentStart, event.recurrenceEnd)) {
            occurrences.push({ ...cleanEvent, startDate: currentStart, endDate: currentEnd });
            currentStart = addYears(currentStart, 1);
            currentEnd = addYears(currentEnd, 1);
          }
          break;
        default:
          break;
      }
    }
    newEvents.push(...occurrences);
  });
  return newEvents.filter(event => getDayOfYear(event.start) >= getDayOfYear(today) || getDayOfYear(event.end) >= getDayOfYear(today));
};

export async function GET(req:Request) {
  try {
    await connectDB();
    const cookieHeader = req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const authToken = cookies.authToken;
    const deskToken = cookies.deskToken;

//! Validate user token
    const userToken:TypeUser|NextResponse = await verifyUserToken(authToken);
    if(userToken instanceof NextResponse) return userToken;

//! Validate desk token
    const desk:TypeDesk|undefined = await verifyDeskToken(deskToken, userToken._id);
    if(!desk) return NextResponse.json({ message:"Acceso denegado" }, { status:403 });

    const today = new Date();
    const allEvents = await EventModel.find({ desk:desk._id }).populate("folder");
    const recurrenceEvents = addRecurrence(allEvents, today);

    //* ⏳ Eventos por hora del día
    const eventsByHour:{ label:string; count:number; }[] = [];
    allEvents.forEach(event => {
      const hour = getHours(new Date(event.startDate));
      const existingEntry = eventsByHour.find(e => e.label === hour.toString());
      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        eventsByHour.push({ label: hour.toString(), count: 1 });
      };
    });

    //* 🔄 Distribución de eventos recurrentes
    const recurrenceStats:{ label:string; count:number }[] = [
      { label:"daily", count:0 },
      { label:"weekly", count:0 },
      { label:"monthly", count:0 },
      { label:"yearly", count:0 },
    ];
    allEvents.forEach(event => {
      if (event.recurrence?.frequency) {
        const stat = recurrenceStats.find(e => e.label === event.recurrence.frequency);
        if (stat) stat.count += 1;
      }
    });
    recurrenceStats.forEach(stat => {
      stat.label = EVENTS_RECURRENCE_DATA.find(item => item.value === stat.label)?.label || stat.label;
    })

    //* 🗂 Eventos por carpeta
    const eventsByFolder: { label: string; count: number }[] = [];
    allEvents.forEach(event => {
      const folder = event.folder.title;
      const existingEntry = eventsByFolder.find(e => e.label === folder);
      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        eventsByFolder.push({ label:folder, count: 1 });
      };
    });

    //* 📅 Eventos del dia
    const eventsToday = recurrenceEvents.filter(event => 
      format(event.start, "yyyy-MM-dd", { locale:es }) === format(today, "yyyy-MM-dd", { locale:es }) ||
      format(event.end, "yyyy-MM-dd", { locale:es }) === format(today, "yyyy-MM-dd", { locale:es }) ||
      (event.start <= today && event.end >= today)
    );

    //* 📅 Eventos por día del mes
    const startMonth = startOfMonth(today);
    const endMonth = endOfMonth(today);
    const eventsByMonth: { label: string; count: number }[] = [];
    const eventsInCurrentMonth = recurrenceEvents.filter(event => 
      event.start >= startMonth && event.start <= endMonth
    );
    eventsInCurrentMonth.forEach(event => {
      let date = event.start
      let currentDay = getDayOfYear(event.start);
      const endDay = getDayOfYear(event.end);
      while (currentDay <= endDay) {
        if (currentDay >= getDayOfYear(today)) { // SOLO incluir días actuales o futuros
          const formattedDay = format(date, "dd/MMMM", { locale:es });
          const existingEntry = eventsByMonth.find(e => e.label === formattedDay);
          if (existingEntry) {
            existingEntry.count += 1;
          } else {
            eventsByMonth.push({ label: formattedDay, count: 1 });
          }
        }
        date = addDays(date, 1);
        currentDay += 1; // Avanzar día por día
      }
    });

    const data = {
      totalEvents:recurrenceEvents.length,
      eventsByHour,
      eventsByFolder,
      recurrence:{
        eventsToday,
        eventsByMonth,
        recurrenceStats,
      },
    };

    return NextResponse.json(data, { status:200 });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ message:"Internal Server Error" }, { status:500 });
  }
}
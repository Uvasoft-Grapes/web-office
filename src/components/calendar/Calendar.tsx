import { startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isToday, isEqual, isAfter, format, isBefore, isWithinInterval, addWeeks, addMonths, addYears } from "date-fns";
import { es } from "date-fns/locale";
import { WEEK_DAYS_DATA } from "@utils/data";
import { TypeEvent } from "@utils/types";
import Day from "@components/calendar/Day";

export default function Calendar({ date, events }:{ date:string, events:TypeEvent[] }) {
  const firstDay = startOfMonth(new Date(date));
  const lastDay = endOfMonth(firstDay);
  const startDay = startOfWeek(firstDay, { weekStartsOn:1 });

  const days = [];
  let currentDay = startDay;

  while (currentDay <= lastDay) {
    days.push(currentDay);
    currentDay = addDays(currentDay, 1);
  };

  const addRecurrence = () => {
    const newEvents:TypeEvent[] = [];
    events.forEach(event => {
      const occurrences:TypeEvent[] = [];
      let currentStart = event.startDate;
      let currentEnd = event.endDate;
      if(!event.recurrence) {
        occurrences.push({ ...event, startDate:currentStart, endDate:currentEnd });
      } else {
        switch (event.recurrence.frequency) {
          case "daily":
            while (isBefore(currentStart, event.recurrence.endFrequency)) {
              occurrences.push({ ...event, startDate: currentStart, endDate: currentEnd });
              currentStart = addDays(currentStart, 1);
              currentEnd = addDays(currentEnd, 1);
            }
            break;
          case "weekly":
            while (isBefore(currentStart, event.recurrence.endFrequency)) {
              occurrences.push({ ...event, startDate: currentStart, endDate: currentEnd });
              currentStart = addWeeks(currentStart, 1);
              currentEnd = addWeeks(currentEnd, 1);
            }
            break;
          case "monthly":
            while (isBefore(currentStart, event.recurrence.endFrequency)) {
              occurrences.push({ ...event, startDate: currentStart, endDate: currentEnd });
              currentStart = addMonths(currentStart, 1);
              currentEnd = addMonths(currentEnd, 1);
            }
            break;
          case "yearly":
            while (isBefore(currentStart, event.recurrence.endFrequency)) {
              occurrences.push({ ...event, startDate: currentStart, endDate: currentEnd });
              currentStart = addYears(currentStart, 1);
              currentEnd = addYears(currentEnd, 1);
            }
            break;
          default:
            break;
        }
      };
      newEvents.push(...occurrences);
    });
    return newEvents;
  };

  const getDayEvents = (day:Date) => {
    const expandedEvents = addRecurrence();
    return expandedEvents.filter(event => 
      isEqual(format(event.startDate, "yyyy-MM-dd", { locale:es }), format(day, "yyyy-MM-dd", { locale:es })) ||
      isEqual(format(event.endDate, "yyyy-MM-dd", { locale:es }), format(day, "yyyy-MM-dd", { locale:es })) ||
      isAfter(event.startDate, day) && isBefore(event.endDate, day) ||
      isWithinInterval(day, { start:event.startDate, end:event.endDate })
    );
  };

  return(
    <div className="max-w-full overflow-x-auto">
      <div className="grid grid-cols-7 gap-2 py-6 px-2 text-center justify-items-center min-w-80 ">
        {WEEK_DAYS_DATA.map((day) => (
          <span key={day.value} className="w-10 sm:w-14 h-10 sm:h-14 font-bold text-xs sm:text-sm text-quaternary">{day.label}</span>
        ))}
        {days.map((day, index) => (
          <Day key={index} isSameMonth={isSameMonth(day, firstDay)} isToday={isToday(day)} day={day} events={getDayEvents(day)} />
        ))}
      </div>
    </div>
  );
};


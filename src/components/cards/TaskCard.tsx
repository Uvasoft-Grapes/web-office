import { TypeTask } from "@/src/utils/types";
import Progress from "../Progress";
import { format } from "date-fns";
import AvatarGroup from "../AvatarGroup";
import { IoLink } from "react-icons/io5";
import Link from "next/link";
import { getAvatars } from "@/src/utils/avatars";
import { usePathname } from "next/navigation";

export default function TaskCard({ task }:{ task:TypeTask }) {
  const admin = usePathname().includes("admin");
  const { _id, title, description, priority, status, progress, createdAt, dueDate, assignedTo, attachments, completedTodoCount, todoChecklist  } = task;
  const selectedUsersAvatars = assignedTo.map((assigned) => ({ name:assigned.name||"", img:assigned.profileImageUrl||getAvatars()[0].src }));

  const getStatusTagColor = () => {
    switch (status) {
      case "Pendiente":
        return "text-red-light dark:text-red-dark bg-red-light/20 dark:bg-red-dark/20 border-red-light dark:border-red-dark";
      case "En curso":
        return "text-yellow-light dark:text-yellow-dark bg-yellow-light/20 dark:bg-yellow-dark/20 border-yellow-light dark:border-yellow-dark";
      case "Finalizada":
        return "text-green-light dark:text-green-dark bg-green-light/20 dark:bg-green-dark/20 border-green-light dark:border-green-dark";
      default:
        return "text-quaternary bg-quaternary/25 border-quaternary";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Alta":
        return "text-red-light dark:text-red-dark bg-red-light/20 dark:bg-red-dark/20 border-red-light dark:border-red-dark";
      case "Media":
        return "text-yellow-light dark:text-yellow-dark bg-yellow-light/20 dark:bg-yellow-dark/20 border-yellow-light dark:border-yellow-dark";
      case "Baja":
        return "text-green-light dark:text-green-dark bg-green-light/20 dark:bg-green-dark/20 border-green-light dark:border-green-dark";
      default:
        return "text-quaternary bg-quaternary/25 border-quaternary";
    }
  };



  return(
    <Link href={`/${admin ? "admin" : "user"}/tasks/${_id}`}>
      <li className="bg-secondary-light dark:bg-secondary-dark opacity-80 hover:opacity-100 rounded-xl py-4 border border-tertiary-light dark:border-tertiary-dark shadow-md shadow-quaternary dark:shadow-secondary-dark cursor-pointer duration-300">
        <div className="flex items-end gap-3 px-4">
          <p className={`px-4 py-0.5 rounded font-semibold text-[11px] ${getStatusTagColor()}`}>{status}</p>
          <p className={`px-4 py-0.5 rounded font-semibold text-[11px] ${getPriorityTagColor()}`}>{priority}</p>
        </div>
        <div className={`px-4 border-l-[3px] ${status === "Pendiente" ? "border-red-dark" : status === "En curso" ? "border-yellow-dark" : "border-green-dark"}`}>
          <p className="mt-4 line-clamp-2 font-semibold text-sm text-primary-dark dark:text-primary-light">{title}</p>
          <p className="mt-1.5 line-clamp-2 leading-[18px] text-xs text-quaternary">{description}</p>
          <p className="my-2 leading-[18px] font-semibold text-[13px] text-tertiary-dark dark:text-tertiary-light">
            Pendientes:{" "}
            <span className="rounded px-2 py-0.5 bg-tertiary-light dark:bg-tertiary-dark">{completedTodoCount} / {todoChecklist?.length || 0}</span>
          </p>
          <Progress progress={progress <= 2 ? "2%" : `${progress}%`} color={progress < 25 ? "red" : progress < 75 ? "orange" : progress < 100 ? "yellow" : "green"}/>
        </div>
        <div className="px-4">
          <div className="flex items-center justify-between my-1">
            <div className="">
              <label className="font-medium text-xs text-quaternary">Inicio</label>
              <p className="font-medium text-[13px] text-tertiary-dark dark:text-tertiary-light">{createdAt && format(createdAt, "dd/MM/yyyy")}</p>
            </div>
            <div className="">
              <label className="font-medium text-xs text-quaternary">Entrega</label>
              <p className="font-medium text-[13px] text-tertiary-dark dark:text-tertiary-light">{dueDate && format(dueDate, "dd/MM/yyyy")}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <AvatarGroup avatars={selectedUsersAvatars || []} maxVisible={3}/>
          {attachments.length > 0 &&
            <div className="flex items-center gap-2 bg-primary-dark dark:bg-primary-light px-2.5 py-1.5 rounded-lg">
              <IoLink className="text-primary-light dark:text-primary-dark"/>
              <span className="font-semibold text-xs text-primary-light dark:text-primary-dark">{` ${attachments.length}`}</span>
            </div>
          }
          </div>
        </div>
      </li>
    </Link>
  );
};
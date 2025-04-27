import { IconType } from "react-icons";
import { LuLayoutDashboard, LuUsers, LuClipboardCheck } from "react-icons/lu";

export interface TypeMenuData {
  id:string;
  label:string;
  icon:IconType;
  path:string;
};

export const SIDE_MENU_DATA:TypeMenuData[] = [
  {
    id:"01",
    label:"Dashboard",
    icon:LuLayoutDashboard,
    path:"/dashboard",
  },
  {
    id:"02",
    label:"Tareas",
    icon:LuClipboardCheck,
    path:"/tasks",
  },
  {
    id:"03",
    label:"Usuarios",
    icon:LuUsers,
    path:"/users",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id:"01",
    label:"Dashboard",
    icon:LuLayoutDashboard,
    path:"/dashboard",
  },
  {
    id:"02",
    label:"Mis Tareas",
    icon:LuClipboardCheck,
    path:"/tasks",
  },
];

export const PRIORITY_DATA = [
  { label:"Baja", value:"Baja" },
  { label:"Media", value:"Media" },
  { label:"Alta", value:"Alta" },
];

export const STATUS_DATA = [
  { label:"Pendiente", value:"Pendiente" },
  { label:"En curso", value:"En curso" },
  { label:"Finalizada", value:"Finalizada" },
];
import { IconType } from "react-icons";

export const BRAND_NAME = "Neva"; // Brand name for the application

import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuWalletMinimal,
  LuBanknote,
  LuShoppingCart,
  LuBaggageClaim,
  LuArrowLeftRight,
  LuBuilding2,
  LuStore,
  LuCalendar,
  LuClipboardList,
  LuWarehouse,
  LuPackage2,
  LuGoal,
  LuCircleDashed,
  LuCircleHelp,
} from "react-icons/lu";

export const ICONS = [
  LuCircleDashed,
  LuCircleHelp,
  LuBanknote,
  LuBaggageClaim,
  LuShoppingCart,
  LuArrowLeftRight,
  LuBuilding2,
  LuStore,
];

export const COLORS = [
  "#0085EB",
  "#E5EA00",
  "#EB5C00",
  "#84EB00",
  "#EB00BB",
  "#1000EB",
  "#EBCF00",
  "#00EBA8",
  "#6B00EB",
  "#FF0066",
  "#01E0EB",
  "#BA01EB",
];

export const PROFILE_PICTURE = "https://res.cloudinary.com/diddhgjew/image/upload/v1752085228/profile_wdbg0b.webp";
export const PRODUCT_PICTURE = "https://res.cloudinary.com/diddhgjew/image/upload/v1752167832/product_jk3io7.webp";

export const ROLES_DATA:{ value:"owner"|"admin"|"user"|"client", label:string }[] = [
  { value:"owner", label:"Ownership" }, // level === 0 (index)
  { value:"admin", label:"Administrador" }, // level === 1 (index)
  { value:"user", label:"Usuario" }, // level === 2 (index)
  { value:"client", label:"Cliente" }, // level === 3 (index)
];

export interface TypeMenuData {
  id:string;
  label:string;
  icon:IconType;
  path:string;
  level:0|1|2|3;
};

export const SIDE_MENU_DATA:TypeMenuData[] = [
  {
    id:"01",
    label:"Dashboard",
    icon:LuLayoutDashboard,
    path:"/dashboard",
    level:2,
  },
  {
    id:"02",
    label:"Tareas",
    icon:LuClipboardCheck,
    path:"/tasks",
    level:2,
  },
  {
    id:"03",
    label:"Calendario",
    icon:LuCalendar,
    path:"/calendar",
    level:2,
  },
  {
    id:"04",
    label:"Cuentas",
    icon:LuWalletMinimal,
    path:"/accounts",
    level:2,
  },
  {
    id:"05",
    label:"Inventarios",
    icon:LuWarehouse,
    path:"/inventories",
    level:1,
  },
  {
    id:"06",
    label:"Productos",
    icon:LuPackage2,
    path:"/products",
    level:1,
  },
  {
    id:"07",
    label:"Reportes",
    icon:LuClipboardList,
    path:"/reports",
    level:2,
  },
  {
    id:"08",
    label:"Miembros",
    icon:LuUsers,
    path:"/members",
    level:1,
  },
  {
    id:"09",
    label:"Metas",
    icon:LuGoal,
    path:"/goals",
    level:1,
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

export const TASKS_SORT_DATA = [
  "Fecha Final",
  "Fecha Inicial",
  "Estado",
  "Prioridad",
  "Pendientes",
  "Título",
];

export const MONTHS_DATA = [
  { label:"Enero", value:"enero" },
  { label:"Febrero", value:"febrero" },
  { label:"Marzo", value:"marzo" },
  { label:"Abril", value:"abril" },
  { label:"Mayo", value:"mayo" },
  { label:"Junio", value:"junio" },
  { label:"Julio", value:"julio" },
  { label:"Agosto", value:"agosto" },
  { label:"Septiembre", value:"septiembre" },
  { label:"Octubre", value:"octubre" },
  { label:"Noviembre", value:"noviembre" },
  { label:"Diciembre", value:"diciembre" },
];

export const TRANSACTIONS_STATUS_DATA = [
  { label:"Pendiente", value:"Pendiente" },
  { label:"Finalizado", value:"Finalizado" },
  { label:"Cancelado", value:"Cancelado" },
];

export const TRANSACTIONS_SORT_DATA = [
  "Fecha",
  "Estado",
  "Título",
];

export const WEEK_DAYS_DATA = [
  { value:"lun", label:"Lun"},
  { value:"mar", label:"Mar"},
  { value:"mie", label:"Mié"},
  { value:"jue", label:"Jue"},
  { value:"vie", label:"Vie"},
  { value:"sab", label:"Sáb"},
  { value:"dom", label:"Dom"}
];

export const EVENTS_RECURRENCE_DATA = [
  { value: "none", label: "Ninguna" },
  { value: "daily", label: "Diaria" },
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensual" },
  { value: "yearly", label: "Anual" }
];

export const REPORTS_SORT_DATA = [
  "Fecha",
  "Título",
];

export const  PRODUCTS_SORT_DATA = [
  "Título",
  "Precio",
  "Stock"
];

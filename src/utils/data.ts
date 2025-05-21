import { IconType } from "react-icons";
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
} from "react-icons/lu";

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
    label:"Cuentas",
    icon:LuWalletMinimal,
    path:"/accounts",
    level:2,
  },
  {
    id:"04",
    label:"Miembros",
    icon:LuUsers,
    path:"/members",
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

export interface TypeTransactionCategory {
  label:string;
  icon:IconType;
};

export const TRANSACTIONS_CATEGORIES_DATA:TypeTransactionCategory[] = [
  { label:"Salario", icon:LuBanknote },
  { label:"Venta", icon:LuShoppingCart },
  { label:"Compra", icon:LuBaggageClaim },
  { label:"Devolución", icon:LuArrowLeftRight },
  { label:"Mobiliario", icon:LuStore },
  { label:"Renta", icon:LuBuilding2 },
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
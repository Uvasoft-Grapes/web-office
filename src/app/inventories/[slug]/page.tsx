"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { LuCircleMinus, LuCirclePlus, LuFilter, LuMapPin, LuMoveRight, LuWarehouse } from "react-icons/lu";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { TypeAssigned, TypeInventory } from "@utils/types";
import axiosInstance from "@utils/axiosInstance";
import { API_PATHS } from "@utils/apiPaths";
import { getAvatars } from "@utils/avatars";
import { addThousandsSeparator } from "@utils/helper";
import { TRANSACTIONS_SORT_DATA, TRANSACTIONS_STATUS_DATA } from "@utils/data";
import ProtectedRoute from "@app/ProtectedRoute";
import AppLayout from "@components/layouts/AppLayout";
import AvatarGroup from "@components/users/AvatarGroup";
import Modal from "@components/Modal";
import TabCard from "@components/tasks/TabCard";
import DropdownSelect from "@components/inputs/Dropdown";
import CategorySelect from "@components/inputs/CategorySelect";
import Skeleton from "@components/Skeleton";
import Movement from "@components/inventory/Movement";
import MovementForm from "@components/inventory/MovementForm";
import ProductsList from "@components/inventory/ProductsList";

export default function InventoryPage() {
  const inventoryId = usePathname().split("/")[2];

  const [inventory, setInventory] = useState<TypeInventory|undefined>();
  const [selectedUsersAvatars, setSelectedUsersAvatars] = useState([]);
  const [type, setType] = useState<string|undefined>();
  const [status, setStatus] = useState<string|undefined>();
  const [category, setCategory] = useState<string|undefined>();
  const [sortForm, setSortForm] = useState(false);
  const [sortLabel, setSortLabel] = useState(TRANSACTIONS_SORT_DATA[0]);
  const [sortType, setSortType] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [inflowForm, setInflowForm] = useState(false);
  const [outflowForm, setOutflowForm] = useState(false);

  const fetchInventory = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.INVENTORIES.GET_INVENTORY_BY_ID(inventoryId), {
        params:{
          type:!type ? "" : type,
          status:!status ? "" : status,
          category:!category ? "" : category,
          sort:`${sortLabel} ${sortType ? "(asc)" : "(desc)"}`,
        },
      });
      if(res.status === 200) {
        setInventory(res.data);
        setSelectedUsersAvatars(res.data.assignedTo.map((assigned:TypeAssigned) => ({ name:assigned.name||"", img:assigned.profileImageUrl||getAvatars()[0].src })));
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error fetching inventory:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    };
  };

  useEffect(() => {
    fetchInventory();
    return () => {};
  },[type, status, category, sortType, sortLabel]);

  const handleSortLabel = (label:string) => {
    setSortLabel(label);
    setSortForm(false);
  };

  const refresh = () => {
    fetchInventory();
    setInflowForm(false);
    setOutflowForm(false);
    setOpenProducts(false);
  };

  return(
    <ProtectedRoute>
      <AppLayout activeMenu="Inventarios">
        <div className="flex-1 flex flex-col gap-4">
        {!inventory ?
          <div className="flex min-h-44">
            <Skeleton/>
          </div>
        :
          <section className="card flex flex-col gap-2">
            <div className="flex flex-wrap justify-between gap-2">
              <div className="flex items-center gap-2 text-basic">
                <LuWarehouse className="text-2xl min-w-fit"/>
                <p className="font-medium text-xl md:text-2xl">{inventory.title}</p>
              </div>
              <button type="button" onClick={()=>setOpenProducts(true)} className="flex flex-wrap items-center gap-0.5 w-fit text-nowrap font-medium text-xs text-quaternary/75 hover:text-quaternary cursor-pointer duration-300">
                Ver Productos
                <LuMoveRight className="text-base"/>
              </button>
            </div>
              <div className="flex items-center gap-0.5 text-quaternary">
                <LuMapPin className="text-xs"/>
                <p className="font-medium text-xs">{inventory.location}</p>
              </div>
            <div className="flex items-center justify-between">
              <AvatarGroup avatars={selectedUsersAvatars || []} maxVisible={6}/>
            </div>
            <section className="flex flex-wrap gap-x-2 gap-y-1">
              <TabCard label="" count={inventory?.folder.title} style="min-w-1/2 truncate text-blue-light dark:text-blue-dark bg-blue-light/20 dark:bg-blue-dark/20"/>
              <TabCard label="" count={`${addThousandsSeparator(Math.abs(inventory.products?.length || 0))}`} style="text-green-light dark:text-green-dark bg-green-light/20 dark:bg-green-dark/20 border-green-light dark:border-green-dark"/>
            </section>
            <section className="flex flex-wrap gap-x-2 gap-y-1">
              <TabCard label="Pendiente" count={inventory.statusSummary?.pending || 0} style="text-yellow-light dark:text-yellow-dark bg-yellow-light/10 dark:bg-yellow-dark/10"/>
              <TabCard label="Finalizado" count={inventory.statusSummary?.completed || 0} style="text-green-light dark:text-green-dark bg-green-light/10 dark:bg-green-dark/10"/>
              <TabCard label="Cancelado" count={inventory.statusSummary?.canceled || 0} style="text-red-light dark:text-red-dark bg-red-light/10 dark:bg-red-dark/10"/>
            </section>
          </section>
        }
{/* Filters */}
          <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-x-5 gap-y-2 min-w-full">
            <h2 className="font-semibold text-3xl text-basic">Movimientos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex-1 min-w-48">
                <DropdownSelect disabled={!inventory ? true : false} options={[{ label:"Todos", value:"" }, ...TRANSACTIONS_STATUS_DATA]} defaultValue="" icon={<LuFilter className="text-lg"/>} placeholder="Estado" handleValue={(value:string)=>setStatus(value)}/>
              </div>
              <div className="flex-1 min-w-48 ">
                <DropdownSelect disabled={!inventory ? true : false} options={[{ label:"Todos", value:"" }, { label:"Entrada", value:"inflow" }, { label:"Salida", value:"outflow" },]} defaultValue="" icon={<LuFilter className="text-lg"/>} placeholder="Tipo" handleValue={(value:string)=>setType(value)}/>
              </div>
              <div className="flex-1 min-w-48 ">
                <CategorySelect disabled={!inventory ? true : false} currentCategory={category} setCategory={(value:string|undefined)=>setCategory(value)}/>
              </div>
            </div>
          </section>
          <section className="flex-1 flex flex-col gap-6 min-w-full mt-5 mb-10">
          {!inventory &&          
            [1,2,3].map(item => (
              <div key={item} className="flex min-h-32">
                <Skeleton/>
              </div>
            ))
          }
          {inventory?.movements && inventory.movements.length < 1 && 
            <p className="flex-1 flex items-center justify-center font-semibold text-2xl text-quaternary">No hay movimientos</p>
          }
          {inventory?.movements && inventory.movements.map((movement) => (
            <Movement key={movement._id} movement={movement} refresh={fetchInventory}/>
          ))}
          </section>
        </div>
        <section>
          <div className="fixed bottom-2 xl:bottom-4 left-0 w-full max-w-[1750px] flex flex-wrap-reverse justify-between gap-2 px-3">
            <div className="flex gap-1.5 w-fit">
              <button onClick={()=>setSortType(!sortType)} disabled={!inventory ? true : false} className="flex items-center justify-center size-10 rounded-md text-primary-light dark:text-primary-dark hover:text-primary-dark dark:hover:text-primary-light bg-primary-dark dark:bg-primary-light hover:bg-primary-light dark:hover:bg-primary-dark border-2 border-primary-dark dark:border-primary-light cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 duration-300">
              {sortType ? 
                <HiSortAscending className="text-2xl"/>
              :
                <HiSortDescending className="text-2xl"/>
              }
              </button>
              <button onClick={()=>setSortForm(true)} disabled={!inventory ? true : false} className="flex items-center justify-center h-10 w-fit px-4 rounded-md font-medium text-lg text-primary-light dark:text-primary-dark hover:text-primary-dark dark:hover:text-primary-light bg-primary-dark dark:bg-primary-light hover:bg-primary-light dark:hover:bg-primary-dark border-2 border-primary-dark dark:border-primary-light cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 duration-300">
                {sortLabel}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={!inventory ? true : false} onClick={()=>setInflowForm(true)} className="tool-btn">
                <LuCirclePlus className="text-base"/>
                Entrada
              </button>
              <button type="button" disabled={!inventory ? true : false} onClick={()=>setOutflowForm(true)} className="tool-btn-red">
                <LuCircleMinus className="text-base"/>
                Salida
              </button>
            </div>
          </div>
        </section>
        <Modal title="Productos" isOpen={openProducts} onClose={refresh}>
          {inventory && openProducts && <ProductsList products={inventory.products || []}/>}
        </Modal>
        <Modal title="Crear Entrada" isOpen={inflowForm} onClose={()=>setInflowForm(false)}>
          {inventory && inflowForm && <MovementForm inventory={inventory._id} products={inventory?.products || []} type="inflow" refresh={refresh}/>}
        </Modal>
        <Modal title="Crear Salida" isOpen={outflowForm} onClose={()=>setOutflowForm(false)}>
          {inventory && outflowForm && <MovementForm inventory={inventory._id} products={inventory?.products || []} type="outflow" refresh={refresh}/>}
        </Modal>
        <Modal title="Ordenar Transacciones" isOpen={sortForm} onClose={()=>setSortForm(false)}>
          <ul className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
          {TRANSACTIONS_SORT_DATA.map((value:string) => (
            <li key={value}>
              <button onClick={()=>handleSortLabel(value)} className="flex items-center px-5 h-14 w-full rounded-md text-basic bg-transparent hover:bg-secondary-light dark:hover:bg-secondary-dark border border-secondary-light dark:border-tertiary-dark cursor-pointer duration-300">{value}</button>
            </li>
          ))}
          </ul>
        </Modal>
      </AppLayout>
    </ProtectedRoute>
  );
};
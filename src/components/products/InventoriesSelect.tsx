import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { LuCheck, LuWarehouse } from "react-icons/lu";
import axiosInstance from "@utils/axiosInstance";
import { API_PATHS } from "@utils/apiPaths";
import { TypeInventory } from "@utils/types";
import Modal from "@components/Modal";

export default function InventoriesSelect({ disabled, label, stocks, setValue }:{ disabled?:boolean, label?:boolean, stocks:{ inventory:string, stock:number }[], setValue:(value:{ inventory:string, stock:number }[])=>void }) {
  const [inventories, setInventories] = useState<TypeInventory[]>([]);
  const [tempInventories, setTempInventories] = useState<{ inventory:string, stock:number }[]>(stocks);
  const [openModal, setOpenModal] = useState(false);

  const fetchInventories = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.INVENTORIES.GET_ALL_INVENTORIES);
      if(res.status === 200) {
        setInventories(res.data);
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error fetching accounts:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    }
  };

  useEffect(() => {
    fetchInventories();
    return () => {};
  },[]);

  const toggleSelection = (inventory:TypeInventory) => {
    const index = tempInventories.findIndex(temp => temp.inventory === inventory._id);
    if(index >= 0 && tempInventories[index].stock > 0) return;
    if(index >= 0) return setTempInventories(tempInventories.filter(temp => temp.inventory !== inventory._id));
    setTempInventories([ ...tempInventories, { inventory:inventory._id, stock:0 }])
  };

  const handleStocks = () => {
    setValue(tempInventories);
    setOpenModal(false);
  };

  return(
    <div className={`flex flex-col gap-1 ${disabled && "opacity-50"}`}>
      {label && <label className="font-medium text-sm text-tertiary-dark dark:text-tertiary-light">Inventarios</label>}
      <button type="button" disabled={disabled} onClick={()=>setOpenModal(true)} className="card-btn">
        <LuWarehouse className="text-base"/>
        Seleccionar inventarios
      {stocks.length > 0 &&
        <span className="text-xs">({stocks.length})</span>
      }
      </button>
      <Modal title="Seleccionar inventarios" isOpen={openModal} onClose={()=>setOpenModal(false)}>
        <ul className="flex-1 flex flex-col gap-5">
        {inventories.map((inventory, index) => (
          <li key={index} className="flex items-center gap-4 p-3 border-b border-secondary-light dark:border-secondary-dark">
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-sm sm:text-base text-basic">{inventory.title}</p>
              <p className="font-medium text-xs sm:text-sm text-quaternary">{inventory.location}</p>
            </div>
            <input
              type="checkbox"
              checked={tempInventories.some(temp => temp.inventory === inventory._id)}
              disabled={tempInventories.some(temp => temp.inventory === inventory._id && temp.stock > 0)}
              onChange={() => toggleSelection(inventory)}
              className="size-4"
            />
          </li>
        ))}
        </ul>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={handleStocks} className="flex-1 sm:flex-auto card-btn-fill sm:max-w-52">
            <LuCheck className="text-xl"/>
            Confirmar
          </button>
        </div>
      </Modal>
    </div>
  );
};
import { API_PATHS } from "@/src/utils/apiPaths";
import axiosInstance from "@/src/utils/axiosInstance";
import { ICONS } from "@/src/utils/data";
import { TypeItem } from "@/src/utils/types";
import { isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function Item({ item, refresh }:{ item:TypeItem, refresh:()=>void }) {

  const [loading, setLoading] = useState(false);

  const getIcon = (index:number, size:"sm"|"lg") => {
    const Icon = ICONS[index];
    return <Icon className={`${size === "sm" ? "text-lg" : "text-xl"}`}/>
  };

  const handleSubtract = async () => {
    if(item.stock <= 0) return;
    setLoading(true);
    try {
      const res = await axiosInstance.put(API_PATHS.INVENTORIES.ITEMS.UPDATE_STOCK(item._id), { stock:item.stock - 1 });
      if(res.status === 201) {
        toast.success(res.data.message);
        refresh();
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error creating item:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    } finally {
      setLoading(false);
    };
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.put(API_PATHS.INVENTORIES.ITEMS.UPDATE_STOCK(item._id), { stock:item.stock + 1 });
      if(res.status === 201) {
        toast.success(res.data.message);
        refresh();
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error creating item:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    } finally {
      setLoading(false);
    };
  };

  return(
    <div key={item._id} className="flex items-center justify-between gap-2 hover:bg-secondary-light dark:hover:bg-secondary-dark p-4 rounded-md duration-300">
      <div className="flex flex-col items-center justify-center">
        <span className="flex items-center justify-center min-h-10 min-w-10 rounded-full text-primary-light dark:text-primary-dark bg-primary-dark">
          {getIcon(item.category.icon, "lg")}
        </span>
        <p className="font-medium text-xs text-quaternary line-clamp-1">${item.price}</p>
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
        <p className="font-semibold text-base line-clamp-1">{item.title}</p>
        <span className="text-quaternary text-xs line-clamp-1">{item.description}</span>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={handleSubtract} disabled={loading || item.stock === 0} className="flex items-center justify-center size-10 rounded-md hover:bg-tertiary-light dark:hover:bg-tertiary-dark border border-tertiary-light dark:border-tertiary-dark disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed duration-300">
          <LuChevronLeft className="text-xl"/>
        </button>
        <p className="flex items-center justify-center min-w-10 font-semibold text-xl">{item.stock}</p>
        <button type="button" onClick={handleAdd} disabled={loading} className="flex items-center justify-center size-10 rounded-md hover:bg-tertiary-light dark:hover:bg-tertiary-dark border border-tertiary-light dark:border-tertiary-dark disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed duration-300">
          <LuChevronRight className="text-xl"/>
        </button>
      </div>
    </div>
  );
};
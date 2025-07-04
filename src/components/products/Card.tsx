import { useState } from "react";
import { LuArrowDownUp, LuInfo } from "react-icons/lu";
import { ICONS } from "@utils/data";
import { TypeProduct } from "@utils/types";
import Modal from "@components/Modal";
import ProductDetails from "./Details";
import Movements from "./Movements";

export default function ProductCard({ product, refresh }:{ product:TypeProduct, refresh:()=>void }) {
  const { title, description, category, price, stock } = product;

  const [openDetails, setOpenDetails] = useState(false);
  const [openMovements, setOpenMovements] = useState(false);

  const getIcon = (index:number) => {
    const Icon = ICONS[index];
    return <Icon className="text-xl text-primary-dark dark:text-primary-light"/>
  };

  return(
    <>
      <div className="card flex flex-col gap-2 min-h-60 bg-secondary-light dark:bg-secondary-dark hover:bg-primary-light dark:hover:bg-primary-dark duration-300">
        <div className="relative flex flex-col gap-2 w-full">
          <span className="flex items-center justify-center h-32 rounded-md text-primary-dark dark:text-primary-light bg-tertiary-light dark:bg-tertiary-dark">
            {getIcon(category ? category.icon : 0)}
          </span>
          <span className="absolute top-2 left-2 px-3 py-0.5 max-w-4/5 rounded-full line-clamp-1 font-semibold text-xs text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light">{category ? category.label : "Sin categoría"}</span>
          <span className="absolute bottom-2 left-2 px-3 py-0.5 rounded-full font-semibold text-xs text-blue-light dark:text-blue-dark bg-blue-light/20 dark:bg-blue-dark/20">${price}</span>
          <span className={`absolute bottom-2 right-2 px-3 py-0.5 rounded-full font-semibold text-xs ${stock > 10 ? "text-green-light dark:text-green-dark bg-green-light/20 dark:bg-green-dark/20" : stock > 0 ? "text-yellow-light dark:text-yellow-dark bg-yellow-light/20 dark:bg-yellow-dark/20" : "text-red-light dark:text-red-dark bg-red-light/20 dark:bg-red-dark/20"}`}>{stock || 0}</span>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <p className="font-semibold text-base sm:text-lg text-basic line-clamp-2">{title}</p>
          <p className="font-medium text-xs sm:text-sm text-quaternary line-clamp-1">{description}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button type="button" onClick={()=>setOpenDetails(true)} className="flex-1 card-btn-fill">
            <LuInfo className="text-lg"/>
            Información
          </button>
          <button type="button" onClick={()=>setOpenMovements(true)} className="flex-1 card-btn-fill">
            <LuArrowDownUp className="text-lg"/>
            Movimientos
          </button>
        </div>
      </div>
      <Modal title={title} isOpen={openDetails} onClose={()=>setOpenDetails(false)}>
        {openDetails && <ProductDetails product={product} refresh={refresh}/>}
      </Modal>
      {openMovements && <Movements isOpen={openMovements} onClose={()=>setOpenMovements(false)} product={product} refresh={refresh}/>}
    </>
  );
};
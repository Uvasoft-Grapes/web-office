import { useState } from "react";
import { IconType } from "react-icons";
import { LuPencil } from "react-icons/lu";
import { useAuth } from "@context/AuthContext";
import { TRANSACTIONS_CATEGORIES_DATA } from "@utils/data";
import { TypeProduct } from "@utils/types";
import Modal from "@components/Modal";
import ProductForm from "@components/products/Form";

export default function ProductCard({ product, refresh }:{ product:TypeProduct, refresh:()=>void }) {
  const { title, description, category, price, stock } = product;
  const { user } = useAuth();

  const [openDetails, setOpenDetails] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const getIcon = (category:string) => {
    const index = TRANSACTIONS_CATEGORIES_DATA.findIndex((item:{ label:string, icon:IconType }) => item.label === category);
    const Icon = TRANSACTIONS_CATEGORIES_DATA[index].icon;
    return <Icon className="text-4xl"/>
  };

  const onRefresh = () => {
    refresh();
    setOpenForm(false);
  };

  return(
    <>
      <div onClick={()=>setOpenDetails(true)} className="card flex flex-wrap gap-2 min-h-36 bg-secondary-light dark:bg-secondary-dark hover:bg-primary-light dark:hover:bg-primary-dark duration-300 cursor-pointer">
        <div className="flex flex-wrap gap-2 min-w-full">
          <span className="flex-1 flex items-center justify-center text-center font-semibold text-xs sm:text-sm px-4 py-1 rounded-full text-primary-dark dark:text-primary-light bg-tertiary-light dark:bg-tertiary-dark">{stock}</span>
          <span className="flex-1 flex items-center justify-center text-center font-semibold text-xs sm:text-sm px-4 py-1 rounded-full text-primary-dark dark:text-primary-light bg-tertiary-light dark:bg-tertiary-dark">${price}</span>
          <span className="flex-1 flex items-center justify-center text-center font-semibold text-xs sm:text-sm px-4 py-1 rounded-full text-primary-dark dark:text-primary-light bg-tertiary-light dark:bg-tertiary-dark">{category}</span>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center justify-center size-16 md:size-20 rounded-xl text-primary-dark dark:text-primary-light bg-tertiary-light dark:bg-tertiary-dark">
            {getIcon(category)}
          </span>
          <div className="flex-1 flex flex-col gap-0.5">
            <p className="font-semibold text-base sm:text-lg text-basic line-clamp-2">{title}</p>
            <p className="font-medium text-xs sm:text-sm text-quaternary line-clamp-1">{description}</p>
          </div>
        </div>
      </div>
      <Modal title={title} isOpen={openDetails} onClose={()=>setOpenDetails(false)}>
      {openDetails && <>
        <div className="flex flex-wrap gap-2 min-w-full">
          <span className="flex-1 flex items-center justify-center text-center font-semibold text-sm sm:text-base px-4 py-1 rounded-full text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light">{stock}</span>
          <span className="flex-1 flex items-center justify-center text-center font-semibold text-sm sm:text-base px-4 py-1 rounded-full text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light">${price}</span>
          <span className="flex-1 flex items-center justify-center text-center font-semibold text-sm sm:text-base px-4 py-1 rounded-full text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light">{category}</span>
        </div>
        <textarea readOnly defaultValue={description} placeholder="Sin descripción" className="flex-1 p-4 rounded font-medium text-lg bg-secondary-light dark:bg-secondary-dark border border-tertiary-light dark:border-tertiary-dark overflow-y-auto"/>
      {user && (user.role === "owner" || user.role === "admin") &&
        <div className="flex flex-row sm:flex-col items-end">
          <button type="button" onClick={()=>setOpenForm(true)} className="flex-1 sm:flex-auto card-btn-fill w-fit sm:min-w-52">
            <LuPencil className="text-xl"/>
            Editar
          </button>
        </div>
      }
      </>}
        <Modal title={"Editar Producto"} isOpen={openForm} onClose={()=>setOpenForm(false)}>
          {openForm && <ProductForm values={product} refresh={onRefresh}/>}
        </Modal>
      </Modal>
    </>
  );
};
import { TRANSACTIONS_CATEGORIES_DATA, TypeTransactionCategory } from "@/src/utils/data";
import { useState } from "react";
import { LuFilterX, LuSquareDashed } from "react-icons/lu";
import Modal from "../Modal";

export default function CategorySelect({ disabled, label, currentCategory, setCategory }:{ disabled?:boolean, label?:boolean, currentCategory:string|undefined, setCategory:(category:string|undefined)=>void }) {
  const [preview, setPreview] = useState<TypeTransactionCategory|undefined>(TRANSACTIONS_CATEGORIES_DATA.find((category)=>category.label === currentCategory));
  const [openModal, setOpenModal] = useState(false);

  const handleCategory = (index:number|undefined) => {
    if(index === undefined) {
      setCategory(undefined);
      setPreview(undefined);
    } else {
      const selectedCategory = TRANSACTIONS_CATEGORIES_DATA[index];
      setCategory(selectedCategory.label);
      setPreview(selectedCategory);
    };
    setOpenModal(false);
  };

  return(
    <div className={`flex flex-col gap-1 ${disabled && "opacity-50"}`}>
      {label && <label className="font-medium text-sm text-tertiary-dark dark:text-tertiary-light">Categoría</label>}
    {!preview ?
      <button type="button" disabled={disabled} onClick={()=>setOpenModal(true)} className="card-btn">
        <LuSquareDashed className="text-xl"/>
        Seleccionar categoría
      </button>
    :
      <button type="button" disabled={disabled} onClick={()=>setOpenModal(true)} className="card-btn">
        <preview.icon className="text-xl"/>
        {preview.label}
      </button>
    }
      <Modal title="Categorías" isOpen={openModal} onClose={()=>setOpenModal(false)}>
        <ul className="flex flex-wrap items-center justify-center gap-5">
        {!label &&
          <li className="relative h-fit rounded border border-transparent hover:border-quaternary group duration-300">
            <button type="button" onClick={()=>handleCategory(undefined)} className="flex items-center justify-center size-20 cursor-pointer">
              <LuFilterX className="text-4xl text-primary-dark dark:text-primary-light"/>
            </button>
            <label className="absolute -bottom-1/2 z-10 min-w-full py-1 px-2 rounded text-center text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light opacity-0 group-hover:opacity-100 duration-300">Ninguna</label>
          </li>
        }
        {TRANSACTIONS_CATEGORIES_DATA.map((category, index) => (
          <li key={category.label} className="relative h-fit rounded border border-transparent hover:border-quaternary group duration-300">
            <button type="button" onClick={()=>handleCategory(index)} className="flex items-center justify-center size-20 cursor-pointer">
              <category.icon className="text-4xl text-primary-dark dark:text-primary-light"/>
            </button>
            <label className="absolute -bottom-1/2 z-10 min-w-full py-1 px-2 rounded text-center text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light opacity-0 group-hover:opacity-100 duration-300">{category.label}</label>
          </li>
        ))}
        </ul>
      </Modal>
    </div>
  );
};
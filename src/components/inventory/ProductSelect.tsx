import { useState } from "react";
import { IconType } from "react-icons";
import { LuFilterX, LuShoppingBag, LuX } from "react-icons/lu";
import { TypeMovementProduct, TypeProduct } from "@utils/types";
import { TRANSACTIONS_CATEGORIES_DATA } from "@utils/data";
import Modal from "@components/Modal";

export default function ProductSelect({ products, disabled, label, currentProduct, setProduct }:{ products:TypeProduct[], disabled?:boolean, label?:boolean, currentProduct:TypeMovementProduct|undefined, setProduct:(product:TypeMovementProduct|undefined)=>void }) {
  const [preview, setPreview] = useState<TypeMovementProduct|undefined>(currentProduct);
  const [openModal, setOpenModal] = useState(false);

  const handleProduct = (index:number|undefined) => {
    if(index === undefined) {
      setProduct(undefined);
      setPreview(undefined);
    } else {
      const selectedProduct = products[index];
      setProduct(selectedProduct);
      setPreview(selectedProduct);
    };
    setOpenModal(false);
  };

  const getIcon = (category:string) => {
    const index = TRANSACTIONS_CATEGORIES_DATA.findIndex((item:{ label:string, icon:IconType }) => item.label === category);
    const Icon = TRANSACTIONS_CATEGORIES_DATA[index].icon;
    return <Icon className="text-4xl"/>
  };

  return(
    <div className={`flex flex-col gap-1 ${disabled && "opacity-50"}`}>
      {label && <label className="font-medium text-sm text-tertiary-dark dark:text-tertiary-light">Producto</label>}
      <button type="button" disabled={disabled} onClick={()=>setOpenModal(true)} className="card-btn">
        <LuShoppingBag className="text-base min-w-fit"/>
        <span className="truncate">{!preview ? "Seleccionar producto" : preview.title}</span>
      </button>
      <Modal title="Productos" isOpen={openModal} onClose={()=>setOpenModal(false)}>
        <ul className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 px-2 overflow-y-auto">
        {!label &&
          <li className="relative h-fit rounded border border-transparent hover:border-quaternary group duration-300">
            <button type="button" onClick={()=>handleProduct(undefined)} className="flex items-center justify-center size-20 cursor-pointer">
              <LuFilterX className="text-4xl text-primary-dark dark:text-primary-light"/>
            </button>
            <label className="absolute -bottom-1/2 z-10 min-w-full py-1 px-2 rounded text-center text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light opacity-0 group-hover:opacity-100 duration-300">Ninguno</label>
          </li>
        }
        {products.map((product, index) => (
          <li key={product._id} onClick={()=>handleProduct(index)} className="card flex flex-col gap-2 h-48 bg-secondary-light dark:bg-secondary-dark hover:bg-primary-light dark:hover:bg-primary-dark duration-300 cursor-pointer">
            <div className="flex flex-wrap gap-2 min-w-full">
              <span className="flex-1 flex items-center justify-center text-center font-semibold text-xs sm:text-sm px-4 h-8 rounded-full text-primary-dark dark:text-primary-light bg-tertiary-light dark:bg-tertiary-dark">{product.stock}</span>
              <span className="flex-1 flex items-center justify-center text-center font-semibold text-xs sm:text-sm px-4 h-8 rounded-full text-primary-dark dark:text-primary-light bg-tertiary-light dark:bg-tertiary-dark">${product.price}</span>
              <span className="flex-1 flex items-center justify-center text-center font-semibold text-xs sm:text-sm px-4 h-8 rounded-full text-primary-dark dark:text-primary-light bg-tertiary-light dark:bg-tertiary-dark">{product.category}</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <span className="flex items-center justify-center size-16 md:size-20 rounded-xl text-primary-dark dark:text-primary-light bg-tertiary-light dark:bg-tertiary-dark">
                {getIcon(product.category)}
              </span>
              <div className="flex-1 flex flex-col gap-0.5">
                <p className="font-semibold text-base sm:text-lg text-basic line-clamp-2">{product.title}</p>
                <p className="font-medium text-xs sm:text-sm text-quaternary line-clamp-1">{product.description}</p>
              </div>
            </div>
          </li>
        ))}
        </ul>
      {!label &&
        <div className="flex justify-end">
          <button type="button" onClick={()=>handleProduct(undefined)} className="card-btn-red">
            <LuX className="text-base"/>
            Remover
          </button>
        </div>
      }
      </Modal>
    </div>
  );
};
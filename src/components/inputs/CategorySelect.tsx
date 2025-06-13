import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { LuFilterX, LuPlus, LuSquareDashed } from "react-icons/lu";
import { ICONS } from "@utils/data";
import { TypeCategory } from "@utils/types";
import axiosInstance from "@utils/axiosInstance";
import { API_PATHS } from "@utils/apiPaths";
import Modal from "@components/Modal";
import CategoryForm from "../categories/Form";

export default function CategorySelect({ disabled, label, type, currentCategory, setCategory }:{ disabled?:boolean, label?:boolean, type:"transaction"|"product"|"movement", currentCategory:TypeCategory|undefined, setCategory:(category:TypeCategory|undefined)=>void }) {
  const [categories, setCategories] = useState<TypeCategory[]|undefined>();
  const [preview, setPreview] = useState<TypeCategory|undefined>();
  const [openModal, setOpenModal] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.CATEGORIES.GET_CATEGORIES_BY_TYPE, {
        params:{ type },
      });
      if(res.status === 200) {
        setCategories(res.data);
        setPreview(res.data.find((category:TypeCategory)=>category._id === currentCategory?._id));
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error fetching accounts:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    };
  };

  useEffect(() => {
    fetchCategories();
    return () => {};
  },[]);

  const handleCategory = (index:number|undefined) => {
    if(categories === undefined) return;
    if(index === undefined) {
      setCategory(undefined);
      setPreview(undefined);
    } else {
      const selectedCategory = categories[index];
      setCategory(selectedCategory);
      setPreview(selectedCategory);
    };
    setOpenModal(false);
  };

  const getIcon = (index:number, size:"sm"|"lg") => {
    const Icon = ICONS[index];
    return <Icon className={`${size === "sm" ? "text-lg" : "text-xl"}`}/>
  };

  const refresh = () => {
    fetchCategories();
    setOpenForm(false);
  };

  return(
    <div className={`flex flex-col gap-1 ${disabled && "opacity-50"}`}>
      {label && <label className="font-medium text-sm text-tertiary-dark dark:text-tertiary-light">Categoría</label>}
    {!preview ?
      <button type="button" disabled={disabled} onClick={()=>setOpenModal(true)} className="card-btn">
        <LuSquareDashed className="text-lg"/>
        Seleccionar categoría
      </button>
    :
      <button type="button" disabled={disabled} onClick={()=>setOpenModal(true)} className="card-btn">
        <span className="text-primary-dark dark:text-primary-light">{getIcon(preview.icon || 0, "sm")}</span>
        <span className="line-clamp-1">{preview.label}</span>
      </button>
    }
      <Modal title="Categorías" isOpen={openModal} onClose={()=>setOpenModal(false)}>
        <ul className="flex-1 flex flex-col gap-2 max-h-full overflow-y-auto">
        {!label &&
          <li className="flex">
            <button type="button" onClick={()=>handleCategory(undefined)} className="flex items-center gap-2 py-2 px-4 w-full h-16 rounded-md hover:bg-secondary-light cursor-pointer duration-300">
              <span className="flex items-center justify-center min-h-10 min-w-10 rounded-full bg-primary-dark">
                <LuFilterX className="text-xl text-primary-light dark:text-primary-dark"/>
              </span>
              <p className="rounded line-clamp-1 text-start text-primary-dark dark:text-primary-light duration-300">Ninguna</p>
            </button>
          </li>
        }
        {categories?.map((category, index) => (
          <li key={category.label} className="flex">
            <button type="button" onClick={()=>handleCategory(index)} className="flex items-center gap-2 py-2 px-4 w-full h-16 rounded-md hover:bg-secondary-light cursor-pointer duration-300">
              <span className="flex items-center justify-center min-h-10 min-w-10 rounded-full text-primary-light dark:text-primary-dark bg-primary-dark">
                {getIcon(category.icon, "lg")}
              </span>
              <p className="rounded line-clamp-1 text-start text-primary-dark dark:text-primary-light duration-300">{category.label}</p>
            </button>
          </li>
        ))}
        </ul>
      {!label &&
        <div className="flex items-center justify-end">
          <button type="button" onClick={()=>setOpenForm(true)} className="card-btn-fill">
            <LuPlus className="text-xl"/>
            Crear
          </button>
        </div>
      }
      </Modal>
      <Modal title="Crear categoría" isOpen={openForm} onClose={()=>setOpenForm(false)}>
        {openForm && <CategoryForm type={type} refresh={refresh}/>}
      </Modal>
    </div>
  );
};
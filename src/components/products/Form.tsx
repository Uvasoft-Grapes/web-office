import { isAxiosError } from "axios";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { LuCheck, LuTrash2 } from "react-icons/lu";
import { useAuth } from "@context/AuthContext";
import { API_PATHS } from "@utils/apiPaths";
import axiosInstance from "@utils/axiosInstance";
import { TypeCategory, TypeProduct } from "@utils/types";
import TextInput from "@components/inputs/Text";
import Modal from "@components/Modal";
import DeleteAlert from "@components/DeleteAlert";
import CategorySelect from "@components/inputs/CategorySelect";
import NumberInput from "@components/inputs/Number";

export default function ProductForm({ values, refresh, }:{ values?:TypeProduct, refresh:()=>void }) {
  const { user } = useAuth();

  const [category, setCategory] = useState<TypeCategory|undefined>(values?.category);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const createProduct = async (data:{ title:string, description:string, price:string }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.PRODUCTS.CREATE_PRODUCT, { ...data, category:category?._id });
      if(res.status === 201) {
        toast.success(res.data.message);
        refresh();
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error creating inventory:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    } finally {
      setLoading(false);
    };
  };

  const updateProduct = async (data:{ title:string, description:string, price:string }) => {
    if(!values) return;
    setLoading(true);
    try {
      const res = await axiosInstance.put(API_PATHS.PRODUCTS.UPDATE_PRODUCT(values?._id), { ...data, category:category?._id });
      if(res.status === 201) {
        toast.success(res.data.message);
        refresh();
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error updating inventory:", error);
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      };
    } finally {
      setLoading(false);
    };
  };

  const deleteProduct = async () => {
    if(!values) return;
    setLoading(true);
    try {
      const res = await axiosInstance.delete(API_PATHS.PRODUCTS.DELETE_PRODUCT(values._id));
      if(res.status === 200) {
        toast.success(res.data.message);
        refresh();
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error deleting inventory:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    } finally {
      setLoading(false);
    };
  };
  
  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title')?.toString() || "";
    const description = formData.get('description')?.toString() || "";
    const price = formData.get('price')?.toString() || "0";

//! Validate form data
    if(!title?.trim()) return setError("Título obligatorio.");
    if(Number(price) < 0) return setError("Precio obligatorio.");

    if(!values) createProduct({ title, description, price });
    if(values) updateProduct({ title, description, price });
  };

  return(
    <form onSubmit={(e) => handleSubmit(e)} className="flex-1 flex flex-col gap-4 max-h-full">
          <div className="flex-1 flex flex-col gap-4 pr-4 overflow-y-auto">
            <TextInput
              name="title"
              label="Título"
              placeholder="Nombre del producto"
              defaultValue={values?.title || ""}
            />
            <TextInput
              name="description"
              label="Descripción"
              placeholder="Descripción del producto"
              defaultValue={values?.title || ""}
            />
            <NumberInput
              name="price"
              label="Precio"
              placeholder="Precio del producto"
              defaultValue={values?.price}
            />
            <div className="grid grid-cols-1 gap-4">
              {/* <InventoriesSelect
                label
                stocks={stocks}
                setValue={(value:{ inventory:string, stock:number }[])=>setStocks(value)}
              /> */}
              <CategorySelect 
                disabled={loading}
                label
                type="product"
                currentCategory={category}
                setCategory={(cat:TypeCategory|undefined)=>setCategory(cat)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <p className="flex-1 flex items-center min-h-2 font-medium text-xs text-red-light dark:text-red-dark overflow-hidden">{error}</p>
            <div className="flex flex-wrap-reverse gap-2">
            {user?.role === "owner" && values &&
              <button type="button" disabled={loading} onClick={()=>setOpenAlert(true)} className="flex-1 sm:flex-auto card-btn-red w-fit sm:min-w-52">
                <LuTrash2 className="text-xl"/>
                Eliminar
              </button>
            }
              <button type="submit" disabled={loading} className="flex-1 sm:flex-auto card-btn-fill w-fit sm:min-w-52">
                <LuCheck className="text-xl"/>
                Confirmar
              </button>
            </div>
          </div>
          <Modal title="Eliminar Producto" isOpen={openAlert} onClose={()=>setOpenAlert(false)}>
            {<DeleteAlert content="¿Estás seguro de que quieres eliminar este producto?" description="Se eliminaran todos sus movimientos y stocks" onDelete={deleteProduct}/>}
          </Modal>
        </form>
  );
};
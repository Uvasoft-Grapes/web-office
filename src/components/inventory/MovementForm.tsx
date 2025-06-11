import { FormEvent, useState } from "react";
import { isAxiosError } from "axios";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { LuCheck, LuTrash2 } from "react-icons/lu";
import { useAuth } from "@context/AuthContext";
import { TypeCategory, TypeMovement, TypeMovementProduct, TypeProduct } from "@utils/types";
import axiosInstance from "@utils/axiosInstance";
import { API_PATHS } from "@utils/apiPaths";
import { TRANSACTIONS_STATUS_DATA } from "@utils/data";
import SelectDropdown from "@components/inputs/Dropdown";
import InputText from "@components/inputs/Text";
import Textarea from "@components/inputs/Textarea";
import InputDate from "@components/inputs/Date";
import Modal from "@components/Modal";
import DeleteAlert from "@components/DeleteAlert";
import NumberInput from "@components/inputs/Number";
import CategorySelect from "@components/inputs/CategorySelect";
import ProductSelect from "@components/inventory/ProductSelect";

export default function MovementForm({ inventory, products, type, values, refresh }:{ inventory:string, products?:TypeProduct[], type:"inflow"|"outflow", values?:TypeMovement, refresh:()=>void }) {
  const { user } = useAuth();

  const [category, setCategory] = useState<TypeCategory|undefined>(values && values.category);
  const [product, setProduct] = useState<TypeMovementProduct|undefined>(values && values.product);
  const [status, setStatus] = useState<string>(values ? values.status : "Finalizado");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const createMovement = async (data:{ title:string, description:string, quantity:number, date:Date }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.MOVEMENTS.CREATE_MOVEMENT, { inventory, product:product?._id, type, category:category?._id, ...data, status });
      if(res.status === 201) {
        toast.success(res.data.message);
        refresh();
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error creating movement:", error);
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      };
    } finally {
      setLoading(false);
    };
  };

  const updateMovement = async (data:{ title:string, description:string, quantity:number, date:Date }) => {
    if(!values) return;
    setLoading(true);
    try {
      const res = await axiosInstance.put(API_PATHS.MOVEMENTS.UPDATE_MOVEMENT(values._id), { product:product?._id, category:category?._id, ...data, status });
      if(res.status === 201) {
        toast.success(res.data.message);
        refresh();
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error updating transaction:", error);
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      };
    } finally {
      setLoading(false);
    };
  };

  const deleteMovement = async () => {
    if(!values) return;
    try {
      const res = await axiosInstance.delete(API_PATHS.MOVEMENTS.DELETE_MOVEMENT(values._id));
      if(res.status === 200) {
        toast.success(res.data.message);
        refresh();
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error deleting transaction:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    };
  };

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title')?.toString() || "";
    const description = formData.get('description')?.toString() || "";
    const quantity = Number(formData.get('quantity')?.toString() || "0");
    const textDate = formData.get('date')?.toString() || undefined;
    const date = textDate ? parseISO(textDate) : undefined;


//! Validate form data
    if(!title?.trim()) return setError("Título obligatorio.");
    if(!date) return setError("Fecha obligatoria.");
    if(!quantity) return setError("Cantidad obligatoria.");
    if(!category) return setError("Categoría obligatoria.");
    if(!product) return setError("Producto obligatorio.");
    if(!status) return setError("Estado obligatorio.");

    if(!values) createMovement({ title, description, quantity, date });
    if(values) updateMovement({ title, description, quantity, date });
  };

  return(
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4 max-h-full">
      <div className="flex flex-col gap-4 pr-4 overflow-y-auto">
        <div className={`grid grid-cols-1 ${products && "sm:grid-cols-2"} gap-6`}>
          <CategorySelect
            label
            type="movement"
            currentCategory={category}
            setCategory={(selectedCategory:TypeCategory|undefined)=>setCategory(selectedCategory)}
          />
        {products &&
          <ProductSelect
            products={products}
            label
            currentProduct={product}
            setProduct={(selectedProduct:TypeMovementProduct|undefined)=>setProduct(selectedProduct)}
          />
        }
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SelectDropdown
            label="Estado"
            options={TRANSACTIONS_STATUS_DATA}
            placeholder="Seleccionar estado"
            defaultValue={values?.status || TRANSACTIONS_STATUS_DATA[1].value}
            handleValue={(value:string)=>setStatus(value)}
          />
          <InputDate
            name="date"
            label="Fecha"
            placeholder="Fecha del movimiento"
            defaultValue={values?.date ? format(values.date, "yyyy-MM-dd", { locale:es }) : undefined}
          />
        </div>
        <InputText
          name="title"
          label="Concepto"
          placeholder="Concepto del movimiento"
          defaultValue={values?.title || ""}
        />
        <Textarea
          name="description"
          label="Descripción"
          placeholder="Descripción del movimiento"
          defaultValue={values?.description || ""}
        />
        <NumberInput
          name="quantity"
          label="Cantidad"
          placeholder="Cantidad del movimiento"
          defaultValue={values ? values.quantity : 1}
          negative={type === "outflow"}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <p className="flex-1 flex items-center min-h-2 font-medium text-xs text-red-light dark:text-red-dark overflow-hidden">{error}</p>
        <div className="flex flex-wrap-reverse gap-2">
        {user?.role === "owner" && values && 
          <button type="button" onClick={()=>setOpenAlert(true)} className="flex-1 sm:flex-auto card-btn-red w-fit sm:min-w-52">
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
      <Modal title="Eliminar Movimiento" isOpen={openAlert} onClose={()=>setOpenAlert(false)}>
        {<DeleteAlert content="¿Estás seguro de que quieres eliminar este movimiento?" onDelete={deleteMovement}/>}
      </Modal>
    </form>
  );
};
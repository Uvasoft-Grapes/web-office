import { FormEvent, useState } from "react";
import { isAxiosError } from "axios";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { TypeTransaction } from "@utils/types";
import axiosInstance from "@utils/axiosInstance";
import { API_PATHS } from "@utils/apiPaths";
import { TRANSACTIONS_STATUS_DATA } from "@utils/data";
import SelectDropdown from "@components/inputs/Dropdown";
import InputText from "@components/inputs/Text";
import Textarea from "@components/inputs/Textarea";
import InputDate from "@components/inputs/Date";
import Modal from "@components/Modal";
import DeleteAlert from "@components/DeleteAlert";
import { LuCheck, LuTrash2 } from "react-icons/lu";
import NumberInput from "../inputs/Number";
import CategorySelect from "../inputs/CategorySelect";
import { useAuth } from "@/src/context/AuthContext";

export default function TransactionForm({ account, closeForm, type, values, refresh }:{ account:string, closeForm:()=>void, type:"income"|"expense", values?:TypeTransaction, refresh:()=>void }) {
  const { user } = useAuth();

  const [category, setCategory] = useState<string|undefined>(values && values.category);
  const [status, setStatus] = useState<string>(values ? values.status : "Finalizado");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const createTransaction = async (data:{ title:string, description:string, amount:number, date:Date }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.ACCOUNTS.CREATE_TRANSACTION, { accountId:account, ...data, type, category, status });
      if(res.status === 201) {
        toast.success(res.data.message);
        closeForm();
        refresh();
      };
    } catch (error) {
      console.error("Error creating transaction:", error)
      setLoading(false);
    } finally {
      setLoading(false);
    };
  };

  const updateTransaction = async (data:{ title:string, description:string, amount:number, date:Date }) => {
    if(!values) return;
    setLoading(true);
    try {
      const res = await axiosInstance.put(API_PATHS.ACCOUNTS.UPDATE_TRANSACTION(values._id), { ...data, category, status });
      if(res.status === 201) {
        toast.success(res.data.message);
        closeForm();
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

  const deleteTransaction = async () => {
    if(!values) return;
    try {
      const res = await axiosInstance.delete(API_PATHS.ACCOUNTS.DELETE_TRANSACTION(values._id));
      if(res.status === 200) {
        toast.success(res.data.message);
        closeForm();
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
    const amount = Number(formData.get('amount')?.toString() || "0");
    const textDate = formData.get('date')?.toString() || undefined;
    const date = textDate ? parseISO(textDate) : undefined;


//! Validate form data
    if(!title?.trim()) return setError("Título obligatorio.");
    if(!date) return setError("Fecha obligatoria.");
    if(!amount) return setError("Monto obligatorio.");

    if(!values) createTransaction({ title, description, amount, date });
    if(values) updateTransaction({ title, description, amount, date });
  };

  return(
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4 max-h-full">
      <div className="flex flex-col gap-4 pr-4 overflow-y-auto">
        <CategorySelect label currentCategory={category} setCategory={(selectedCategory:string|undefined)=>setCategory(selectedCategory)}/>
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
            placeholder="Fecha de la transacción"
            defaultValue={values?.date ? format(values.date, "yyyy-MM-dd", { locale:es }) : undefined}
          />
        </div>
        <InputText
          name="title"
          label="Concepto"
          placeholder="Concepto de la transacción"
          defaultValue={values?.title || ""}
        />
        <Textarea
          name="description"
          label="Descripción"
          placeholder="Descripción de la transacción"
          defaultValue={values?.description || ""}
        />
        <NumberInput
          name="amount"
          label="Monto"
          placeholder="Monto de la transacción"
          defaultValue={values ? `${values.amount}` : ""}
          negative={type === "expense"}
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
      <Modal title="Eliminar Transacción" isOpen={openAlert} onClose={()=>setOpenAlert(false)}>
        {<DeleteAlert content="¿Estás seguro de que quieres eliminar esta transacción?" onDelete={deleteTransaction}/>}
      </Modal>
    </form>
  );
};
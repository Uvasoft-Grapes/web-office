import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@context/AuthContext";
import { getAvatars } from "@utils/avatars";
import { ICONS } from "@utils/data";
import { addThousandsSeparator } from "@utils/helper";
import { TypeTransaction } from "@utils/types";
import Modal from "@components/Modal";
import TransactionForm from "@components/accounts/TransactionForm";

export default function Transaction({ transaction, refresh }:{ transaction:TypeTransaction, refresh:()=>void }) {
  const { user } = useAuth();

  const [openForm, setOpenForm] = useState(false);

  const getStatusBadgeColor = (status?:string) => {
    switch (status) {
      case "Pendiente":
        return "text-yellow-light dark:text-yellow-dark bg-yellow-light/20 dark:bg-yellow-dark/20";
      case "Finalizado":
        return "text-green-light dark:text-green-dark bg-green-light/20 dark:bg-green-dark/20";
      case "Cancelado":
        return "text-red-light dark:text-red-dark bg-red-light/20 dark:bg-red-dark/20";
      default:
        return "text-quaternary border-quaternary";
    };
  };

  const getIcon = (index:number) => {
    const Icon = ICONS[index];
    return <Icon className="text-2xl"/>
  };

  return(
    <>
    <button type="button" onClick={user && (user.role === "owner" || user.role === "admin") ? ()=>setOpenForm(true) : ()=>{}} key={transaction._id} className={`relative flex items-center gap-3 py-1 px-6 min-h-32 rounded-lg rounded-tl-none bg-secondary-light dark:bg-secondary-dark hover:bg-transparent border-2 border-secondary-light dark:border-secondary-dark ${user && (user.role === "owner" || user.role === "admin") && "cursor-pointer"} group duration-300`}>
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="">
          <span className="flex items-center justify-center size-14 rounded-full text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light">
            {getIcon(transaction.category.icon || 0)}
          </span>
          <span className="absolute -top-3.5 -left-0.5 px-2 py-0.5 min-w-16 rounded-xl rounded-b-none font-semibold text-[10px] text-quaternary bg-secondary-light dark:bg-secondary-dark group-hover:bg-primary-light dark:group-hover:bg-primary-dark border-2 border-b-0 border-secondary-light dark:border-secondary-dark duration-300">{transaction.category.label || "Sin categoría"}</span>
        </div>
        <span className={`min-w-16 py-1 h-fit rounded text-center font-semibold text-[10px] ${getStatusBadgeColor(transaction.status)}`}>
          {transaction.status}
        </span>
      </div>
      <div className="flex-1 flex flex-col">
        <p className="text-start font-semibold text-xl text-basic">{transaction.title}</p>
        <p className="text-start font-semibold text-sm text-quaternary">{transaction.description}</p>
        <p className="text-start font-semibold text-sm text-quaternary">{transaction.date ? format(transaction.date, "dd/MM/yyyy", { locale:es }) : "N/D"}</p>
      </div>
      <div className={`flex flex-col items-center gap-1`}>
        <span className={`px-4 py-0.5 h-fit rounded font-semibold text-sm ${transaction.type === "income" ? "text-green-light dark:text-green-dark bg-green-light/20 dark:bg-green-dark/20" : "text-red-light dark:text-red-dark bg-red-light/20 dark:bg-red-dark/20"}`}>
          {`${transaction.type === "income" ? "+" : "-"} $${addThousandsSeparator(transaction.amount)}`}
        </span>
      </div>
      <span className="absolute bottom-full right-0 mb-1 hidden group-hover:flex items-center gap-1 px-5 py-3 rounded-lg bg-primary-light dark:bg-primary-dark border-2 border-secondary-light dark:border-secondary-dark">
        <Image src={transaction.createdBy.profileImageUrl || getAvatars()[0]} alt="Avatar" width={100} height={100} className="size-10 rounded-full"/>
        <div className="flex flex-col">
          <p className="font-medium text-sm text-basic">{transaction.createdBy.name}</p>
          <p className="font-medium text-xs text-quaternary">{transaction.createdBy.email}</p>
        </div>
      </span>
    </button>
    <Modal title="Editar Transacción" isOpen={openForm} onClose={()=>setOpenForm(false)}>
      {user && (user.role === "owner" || user.role === "admin") && openForm && <TransactionForm account={transaction.account} type={transaction.type} values={transaction} closeForm={()=>setOpenForm(false)} refresh={refresh}/>}
    </Modal>
    </>
  );
};
"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { LuCircleMinus, LuCirclePlus, LuFilter, LuSquarePen, LuWallet } from "react-icons/lu";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { TypeAccount, TypeAssigned, TypeCategory } from "@utils/types";
import axiosInstance from "@utils/axiosInstance";
import { API_PATHS } from "@utils/apiPaths";
import { getAvatars } from "@utils/avatars";
import { addThousandsSeparator } from "@utils/helper";
import { TRANSACTIONS_SORT_DATA, TRANSACTIONS_STATUS_DATA } from "@utils/data";
import ProtectedRoute from "@app/ProtectedRoute";
import AppLayout from "@components/layouts/AppLayout";
import AvatarGroup from "@components/users/AvatarGroup";
import Modal from "@components/Modal";
import TransactionForm from "@components/accounts/TransactionForm";
import TabCard from "@components/tasks/TabCard";
import DropdownSelect from "@components/inputs/Dropdown";
import CategorySelect from "@components/inputs/CategorySelect";
import Skeleton from "@components/Skeleton";
import Transactions from "@/src/components/accounts/Transactions";
import { useAuth } from "@/src/context/AuthContext";
import AccountForm from "@/src/components/accounts/Form";

export default function AccountPage() {
  const { user } = useAuth();
  const accountId = usePathname().split("/")[2];

  const [account, setAccount] = useState<TypeAccount|undefined>();
  const [selectedUsersAvatars, setSelectedUsersAvatars] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [incomeForm, setIncomeForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState(false);
  const [type, setType] = useState<string|undefined>();
  const [status, setStatus] = useState<string|undefined>();
  const [category, setCategory] = useState<TypeCategory|undefined>();
  const [sortForm, setSortForm] = useState(false);
  const [sortLabel, setSortLabel] = useState(TRANSACTIONS_SORT_DATA[0]);
  const [sortType, setSortType] = useState(false);

  const fetchAccount = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.ACCOUNTS.GET_ACCOUNT_BY_ID(accountId), {
        params:{
          type:!type ? "" : type,
          status:!status ? "" : status,
          category:!category ? "" : category._id,
          sort:`${sortLabel} ${sortType ? "(asc)" : "(desc)"}`,
        },
      });
      if(res.status === 200) {
        setAccount(res.data);
        setSelectedUsersAvatars(res.data.assignedTo.map((assigned:TypeAssigned) => ({ name:assigned.name||"", img:assigned.profileImageUrl||getAvatars()[0].src })));
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error fetching accounts:", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    }
  };

  useEffect(() => {
    fetchAccount();
    return () => {};
  },[type, status, category, sortType, sortLabel]);

  const handleSortLabel = (label:string) => {
    setSortLabel(label);
    setSortForm(false);
  };

  const refresh = () => {
    fetchAccount();
    setOpenForm(false);
  };

  return(
    <ProtectedRoute>
      <AppLayout activeMenu="Cuentas">
        <div className="flex-1 flex flex-col gap-4">
{/* Filters */}
          <section className="flex flex-col justify-between gap-x-5 gap-y-2 min-w-full">
          {!account ?
            <span className="flex h-24">
              <Skeleton/>
            </span>
          :
            <>
            <div className="flex items-center gap-2">
            {user?.role === "admin" || user?.role === "owner" ?
              <button type="button" onClick={()=>setOpenForm(true)} className="text-primary-dark dark:text-primary-light hover:text-quaternary cursor-pointer duration-300"><LuSquarePen className="text-2xl"/></button>
            :
              <LuWallet className="text-2xl"/>
            }
              <h2 className="font-semibold text-3xl text-basic">{account?.title}</h2>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:flex-wrap-reverse gap-2">
              <AvatarGroup avatars={selectedUsersAvatars || []} maxVisible={10}/>
              <div className="flex-1 flex flex-wrap gap-2">
                <TabCard label="" count={account?.folder.title || ""} style="min-w-1/2 truncate text-blue-light dark:text-blue-dark bg-blue-light/20 dark:bg-blue-dark/20"/>
                <TabCard label="" count={`${account && account.balance < 0 ? "-" : "+"}$${addThousandsSeparator(Math.abs(account?.balance || 0))}`} style={account && account.balance >= 0 ? "text-green-light dark:text-green-dark bg-green-light/20 dark:bg-green-dark/20 border-green-light dark:border-green-dark" : "text-red-light dark:text-red-dark bg-red-light/20 dark:bg-red-dark/20 border-red-light dark:border-red-dark"}/>
              </div>
            </div>
            </>
          }
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex-1 min-w-48">
                <DropdownSelect disabled={!account ? true : false} options={[{ label:"Todos", value:"" }, ...TRANSACTIONS_STATUS_DATA]} defaultValue="" icon={<LuFilter className="text-lg"/>} placeholder="Estado" handleValue={(value:string)=>setStatus(value)}/>
              </div>
              <div className="flex-1 min-w-48 ">
                <DropdownSelect disabled={!account ? true : false} options={[{ label:"Todos", value:"" }, { label:"Ingreso", value:"income" }, { label:"Gasto", value:"expense" },]} defaultValue="" icon={<LuFilter className="text-lg"/>} placeholder="Tipo" handleValue={(value:string)=>setType(value)}/>
              </div>
              <div className="flex-1 min-w-48 ">
                <CategorySelect disabled={!account ? true : false} type="transaction" currentCategory={category} setCategory={(value:TypeCategory|undefined)=>setCategory(value)}/>
              </div>
            </div>
          </section>
          <section className="flex-1 flex flex-col gap-6 min-w-full mb-10">
          {!account && 
            <div className="flex-1 flex min-h-32">
              <Skeleton/>
            </div>
          }
          {account?.transactions && account.transactions.length < 1 && 
            <p className="flex-1 flex items-center justify-center font-semibold text-2xl text-quaternary">No hay transacciones</p>
          }
          {account?.transactions && account.transactions.length > 0 &&
            <Transactions transactions={account.transactions} refresh={fetchAccount}/>
          }
          </section>
        </div>
        <section>
          <div className="fixed bottom-2 xl:bottom-4 left-0 w-full max-w-[1750px] flex flex-wrap-reverse justify-between gap-2 px-3">
            <div className="flex gap-1.5 w-fit">
              <button onClick={()=>setSortType(!sortType)} disabled={!account ? true : false} className="flex items-center justify-center size-10 rounded-md text-primary-light dark:text-primary-dark hover:text-primary-dark dark:hover:text-primary-light bg-primary-dark dark:bg-primary-light hover:bg-primary-light dark:hover:bg-primary-dark border-2 border-primary-dark dark:border-primary-light cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 duration-300">
              {sortType ? 
                <HiSortAscending className="text-2xl"/>
              :
                <HiSortDescending className="text-2xl"/>
              }
              </button>
              <button onClick={()=>setSortForm(true)} disabled={!account ? true : false} className="flex items-center justify-center h-10 w-fit px-4 rounded-md font-medium text-lg text-primary-light dark:text-primary-dark hover:text-primary-dark dark:hover:text-primary-light bg-primary-dark dark:bg-primary-light hover:bg-primary-light dark:hover:bg-primary-dark border-2 border-primary-dark dark:border-primary-light cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 duration-300">
                {sortLabel}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={!account ? true : false} onClick={()=>setIncomeForm(true)} className="tool-btn">
                <LuCirclePlus className="text-base"/>
                Ingreso
              </button>
              <button type="button" disabled={!account ? true : false} onClick={()=>setExpenseForm(true)} className="tool-btn-red">
                <LuCircleMinus className="text-base"/>
                Gasto
              </button>
            </div>
          </div>
        </section>
        <Modal title="Editar Cuenta" isOpen={openForm} onClose={()=>setOpenForm(false)}>
          {openForm && <AccountForm values={account} refresh={refresh}/>}
        </Modal>
        <Modal title="Crear ingreso" isOpen={incomeForm} onClose={()=>setIncomeForm(false)}>
          {account && incomeForm && <TransactionForm account={account._id} type="income" closeForm={()=>setIncomeForm(false)} refresh={fetchAccount}/>}
        </Modal>
        <Modal title="Crear gasto" isOpen={expenseForm} onClose={()=>setExpenseForm(false)}>
          {account && expenseForm && <TransactionForm account={account._id} type="expense" closeForm={()=>setExpenseForm(false)} refresh={fetchAccount}/>}
        </Modal>
        <Modal title="Ordenar Transacciones" isOpen={sortForm} onClose={()=>setSortForm(false)}>
          <ul className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
          {TRANSACTIONS_SORT_DATA.map((value:string) => (
            <li key={value}>
              <button onClick={()=>handleSortLabel(value)} className="flex items-center px-5 h-14 w-full rounded-md text-basic bg-transparent hover:bg-secondary-light dark:hover:bg-secondary-dark border border-secondary-light dark:border-tertiary-dark cursor-pointer duration-300">{value}</button>
            </li>
          ))}
          </ul>
        </Modal>
      </AppLayout>
    </ProtectedRoute>
  );
};
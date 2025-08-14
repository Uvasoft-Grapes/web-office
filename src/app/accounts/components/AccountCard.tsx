import Link from "next/link";
import { getAvatars } from "@shared/utils/avatars";
import { TypeAccount } from "@shared/utils/types";
import { addThousandsSeparator } from "@shared/utils/helper";
import AvatarGroup from "@users/components/AvatarGroup";
import TabCard from "@tasks/components/TabCard";
import { LuPencil, LuWalletCards } from "react-icons/lu";
import Modal from "@shared/components/Modal";
import AccountForm from "./AccountForm";
import { useState } from "react";
import { ACCOUNTS_TYPE } from "@shared/utils/data";
import { useAuth } from "@shared/context/AuthContext";

export default function AccountCard({ account, refresh }:{ account:TypeAccount, refresh:()=>void }) {
  const { user } = useAuth();
  const { _id, folder, title, assignedTo, balance, type } = account;
  const selectedUsersAvatars = assignedTo.map((assigned) => ({ name:assigned.name||"", img:assigned.profileImageUrl||getAvatars()[0].src }));

  const [openForm, setOpenForm] = useState(false);

  const onRefresh = () => {
    refresh();
    setOpenForm(false);
  };

  return(
    <>
      <li className="flex flex-col gap-2 bg-secondary-light dark:bg-secondary-dark hover:bg-transparent dark:hover:bg-transparent rounded-xl p-6 border border-tertiary-light dark:border-tertiary-dark shadow-md shadow-quaternary dark:shadow-secondary-dark duration-300">
        <section className="flex-1 flex gap-2">
          <div className="flex-1 flex flex-col gap-1">
            <p className="px-2 sm:px-4 py-0.5 w-fit rounded text-nowrap font-semibold text-xs text-blue-light dark:text-blue-dark bg-blue-light/20 dark:bg-blue-dark/20">{folder.title}</p>
            <p className="line-clamp-1 font-semibold text-xl text-basic">{title}</p>
            <span className="flex items-center gap-0.5 text-quaternary">
              <LuWalletCards className="text-xs min-w-fit"/>
              <p className="line-clamp-1 text-xs">{ACCOUNTS_TYPE.find(item => item.value === type)?.label}</p>
            </span>
          </div>
        {user && ["owner", "admin"].includes(user.role) &&
          <button type="button" onClick={()=>setOpenForm(true)} className="flex items-center justify-center size-10 rounded-md hover:bg-secondary-light dark:hover:bg-secondary-dark cursor-pointer duration-300">
            <LuPencil/>
          </button>
        }
        </section>
        <section className="flex flex-col gap-1 min-h-20">
          <AvatarGroup avatars={selectedUsersAvatars || []} maxVisible={3}/>
          <TabCard count={`${balance >= 0 ? "+" : "-"}$${addThousandsSeparator(Math.abs(balance))}`} style={balance >= 0 ? "text-green-light dark:text-green-dark bg-green-light/20 dark:bg-green-dark/20 border-green-light dark:border-green-dark" : "text-red-light dark:text-red-dark bg-red-light/20 dark:bg-red-dark/20 border-red-light dark:border-red-dark"}/>
        </section>
        <section className="flex flex-wrap gap-x-2 gap-y-1">
          <TabCard label="Pendiente" count={account.statusSummary?.pending || 0} style="text-yellow-light dark:text-yellow-dark bg-yellow-light/10 dark:bg-yellow-dark/10"/>
          <TabCard label="Finalizado" count={account.statusSummary?.completed || 0} style="text-green-light dark:text-green-dark bg-green-light/10 dark:bg-green-dark/10"/>
          <TabCard label="Cancelado" count={account.statusSummary?.canceled || 0} style="text-red-light dark:text-red-dark bg-red-light/10 dark:bg-red-dark/10"/>
        </section>
        <section className="flex flex-wrap items-end gap-2">
          <Link href={`/accounts/${_id}`} className="flex-1 card-btn-fill">Abrir</Link>
        </section>
      </li>
      <Modal title="Editar Cuenta" isOpen={openForm} onClose={()=>setOpenForm(false)}>
        {openForm && <AccountForm values={account} refresh={onRefresh}/>}
      </Modal>
    </>
  );
};
import Link from "next/link";
import { getAvatars } from "@shared/utils/avatars";
import { TypeAccount } from "@shared/utils/types";
import { addThousandsSeparator } from "@shared/utils/helper";
import AvatarGroup from "@users/components/AvatarGroup";
import TabCard from "@tasks/components/TabCard";

export default function AccountCard({ account }:{ account:TypeAccount }) {
  const { _id, folder, title, assignedTo, balance } = account;
  const selectedUsersAvatars = assignedTo.map((assigned) => ({ name:assigned.name||"", img:assigned.profileImageUrl||getAvatars()[0].src }));

  return(
    <Link href={`/accounts/${_id}`}>
      <li className="flex flex-col gap-2 bg-secondary-light dark:bg-secondary-dark hover:bg-transparent rounded-xl p-4 border border-tertiary-light dark:border-tertiary-dark shadow-md shadow-quaternary dark:shadow-secondary-dark cursor-pointer duration-300">
        <section className="flex-1 flex flex-col">
          <p className="line-clamp-1 font-semibold text-xl text-basic">{title}</p>
        </section>
        <section className="flex items-center justify-between">
          <AvatarGroup avatars={selectedUsersAvatars || []} maxVisible={3}/>
        </section>
        <section className="flex flex-wrap gap-x-2 gap-y-1">
          <TabCard label="" count={folder.title} style="min-w-1/2 truncate text-blue-light dark:text-blue-dark bg-blue-light/20 dark:bg-blue-dark/20"/>
          <TabCard label="" count={`${balance >= 0 ? "+" : "-"}$${addThousandsSeparator(Math.abs(balance))}`} style={balance >= 0 ? "text-green-light dark:text-green-dark bg-green-light/20 dark:bg-green-dark/20 border-green-light dark:border-green-dark" : "text-red-light dark:text-red-dark bg-red-light/20 dark:bg-red-dark/20 border-red-light dark:border-red-dark"}/>
        </section>
        <section className="flex flex-wrap gap-x-2 gap-y-1">
          <TabCard label="Pendiente" count={account.statusSummary?.pending || 0} style="text-yellow-light dark:text-yellow-dark bg-yellow-light/10 dark:bg-yellow-dark/10"/>
          <TabCard label="Finalizado" count={account.statusSummary?.completed || 0} style="text-green-light dark:text-green-dark bg-green-light/10 dark:bg-green-dark/10"/>
          <TabCard label="Cancelado" count={account.statusSummary?.canceled || 0} style="text-red-light dark:text-red-dark bg-red-light/10 dark:bg-red-dark/10"/>
        </section>
      </li>
    </Link>
  );
};
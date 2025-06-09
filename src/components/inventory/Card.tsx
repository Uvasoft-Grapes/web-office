import Link from "next/link";
import { getAvatars } from "@utils/avatars";
import { TypeInventory } from "@utils/types";
import { addThousandsSeparator } from "@utils/helper";
import AvatarGroup from "@components/users/AvatarGroup";
import TabCard from "@components/tasks/TabCard";

export default function InventoryCard({ inventory }:{ inventory:TypeInventory }) {
  const { _id, folder, title, assignedTo, location, products } = inventory;
  const selectedUsersAvatars = assignedTo.map((assigned) => ({ name:assigned.name||"", img:assigned.profileImageUrl||getAvatars()[0].src }));

  return(
    <Link href={`/inventories/${_id}`}>
      <li className="flex flex-col gap-2 bg-secondary-light dark:bg-secondary-dark hover:bg-transparent rounded-xl p-4 border border-tertiary-light dark:border-tertiary-dark shadow-md shadow-quaternary dark:shadow-secondary-dark cursor-pointer duration-300">
        <section className="flex-1 flex flex-col">
          <p className="line-clamp-1 font-semibold text-xl text-basic">{title}</p>
          <p>{location}</p>
        </section>
        <section className="flex items-center justify-between">
          <AvatarGroup avatars={selectedUsersAvatars || []} maxVisible={3}/>
        </section>
        <section className="flex flex-wrap gap-x-2 gap-y-1">
          <TabCard label="" count={folder.title} style="min-w-1/2 truncate text-blue-light dark:text-blue-dark bg-blue-light/20 dark:bg-blue-dark/20"/>
          <TabCard label="" count={`${addThousandsSeparator(Math.abs(products?.length || 0))}`} style="text-green-light dark:text-green-dark bg-green-light/20 dark:bg-green-dark/20 border-green-light dark:border-green-dark"/>
        </section>
        <section className="flex flex-wrap gap-x-2 gap-y-1">
          <TabCard label="Pendiente" count={inventory.statusSummary?.pending || 0} style="text-yellow-light dark:text-yellow-dark bg-yellow-light/10 dark:bg-yellow-dark/10"/>
          <TabCard label="Finalizado" count={inventory.statusSummary?.completed || 0} style="text-green-light dark:text-green-dark bg-green-light/10 dark:bg-green-dark/10"/>
          <TabCard label="Cancelado" count={inventory.statusSummary?.canceled || 0} style="text-red-light dark:text-red-dark bg-red-light/10 dark:bg-red-dark/10"/>
        </section>
      </li>
    </Link>
  );
};
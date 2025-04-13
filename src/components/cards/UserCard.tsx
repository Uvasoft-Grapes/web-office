import { getAvatars } from "@/src/utils/avatars";
import { TypeUser } from "@/src/utils/types";
import Image from "next/image";
import StatCard from "./StatCard";

export default function UserCard({ info }:{ info:TypeUser }) {
  return(
    <li className="user-card p-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={info.profileImageUrl || getAvatars()[0]} alt={info.name} width={50} height={50} className="size-12 rounded-full border-2 border-primary-dark dark:border-primary-light"/>
          <div className="">
            <p className="font-medium text-sm text-primary-dark dark:text-primary-light">{info.name}</p>
            <p className="text-xs text-quaternary">{info.email}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-5">
        <StatCard label="Pendientes" count={info.pendingTasks || 0}/>
        <StatCard label="En curso" count={info.inProgressTasks || 0}/>
        <StatCard label="Finalizadas" count={info.completedTasks || 0}/>
      </div>
    </li>
  );
};
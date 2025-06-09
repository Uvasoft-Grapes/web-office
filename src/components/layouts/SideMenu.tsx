"use client"

import { useAuth } from "@context/AuthContext";
import { ROLES_DATA, SIDE_MENU_DATA, TypeMenuData } from "@utils/data";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PiDesktopDuotone } from "react-icons/pi";

export default function SideMenu({ activeMenu }:{ activeMenu:string }) {
  const { user, desk } = useAuth();

  const [sideMenuData, setSideMenuData] = useState<TypeMenuData[]>([]);

  useEffect(() => {
    if(!user) return;
    const level = ROLES_DATA.findIndex((item) => item.value === user.role);
    setSideMenuData(SIDE_MENU_DATA.filter((item) => item.level >= level));
    return () => {};
  },[user]);

  return(
    <nav className="min-w-64 max-w-64 bg-tertiary-light dark:bg-tertiary-dark border-r border-tertiary-light dark:border-tertiary-dark">
      <div className="flex flex-col gap-1.5 text-basic p-4 max-h-[calc(100vh-56px)] overflow-y-scroll">
        <Link href={`/auth/profile`} className={`flex sm:hidden items-center gap-2 px-6 w-full rounded-xl font-medium text-xs min-h-14 bg-linear-to-r ${activeMenu === "desk" ? "text-secondary-light dark:text-secondary-dark from-primary-dark dark:from-primary-light to-secondary-dark/70 dark:to-secondary-light/70" : "hover:bg-primary-light "} cursor-pointer duration-300`}>
          <PiDesktopDuotone className="text-xl"/>
          <p className="font-semibold text-sm sm:text-base">{desk?.title}</p>
        </Link>
      {sideMenuData.map((item, index) => (
        <Link
          key={`menu_${index}`}
          href={item.path}
          className={`flex items-center gap-2 px-6 w-full rounded-xl font-medium text-xs sm:text-sm min-h-14 bg-linear-to-r ${activeMenu === item.label ? "text-secondary-light dark:text-secondary-dark from-primary-dark dark:from-primary-light to-secondary-dark/70 dark:to-secondary-light/70" : "hover:bg-primary-light dark:hover:bg-primary-dark"} cursor-pointer duration-300`}
        >
          <item.icon className="text-xl"/>
          {item.label}
        </Link>
      ))}
      </div>
    </nav>
  );
};
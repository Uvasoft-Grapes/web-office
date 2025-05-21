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
    <nav className="min-w-64 max-w-64 max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)] overflow-hidden bg-secondary-light dark:bg-secondary-dark border-r border-tertiary-light dark:border-tertiary-dark">
      <Link href={`/auth/profile`} className="flex sm:hidden items-center gap-2 p-5 text-basic hover:text-blue-light dark:hover:text-blue-dark border-b border-tertiary-light dark:border-tertiary-dark duration-300">
        <PiDesktopDuotone className="text-3xl"/>
        <p className="font-semibold text-xl">{desk?.title}</p>
      </Link>
      <div className="max-h-56 min-h-56 overflow-y-auto text-basic">
      {sideMenuData.map((item, index) => (
        <Link 
          key={`menu_${index}`}
          href={item.path}
          className={`flex items-center gap-4 w-full text-[15px] px-5 h-14 cursor-pointer bg-linear-to-r from-transparent ${activeMenu === item.label ? "text-blue-light dark:text-blue-dark to-blue-dark/25 dark:to-blue-light/25 border-r-2 border-blue-light dark:border-blue-dark" : "hover:to-quaternary/25 dark:hover:to-quaternary/25"} duration-300`}
        >
          <item.icon className="text-xl"/>
          {item.label}
        </Link>
      ))}
      </div>
    </nav>
  );
};
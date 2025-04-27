"use client"

import { getAvatars } from "@utils/avatars";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA, TypeMenuData } from "@utils/data";
import { TypeUser } from "@utils/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SideMenu({ user, activeMenu }:{ user?:TypeUser, activeMenu:string }) {
  const [sideMenuData, setSideMenuData] = useState<TypeMenuData[]>([]);

  useEffect(() => {
    if(user) setSideMenuData(user.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    return () => {};
  },[user]);

  return(
    <nav className="max-w-64 max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)] overflow-hidden bg-secondary-light dark:bg-secondary-dark border-r border-secondary-light dark:border-secondary-dark">
      <Link href={`/auth/profile`} className="flex gap-2 p-5">
        <div className="flex justify-center items-center border-2 border-quaternary rounded-full max-w-10 max-h-10 overflow-hidden">
          <Image 
            src={user?.profileImageUrl || getAvatars()[0]}
            alt="Imagen de perfil"
            width={100}
            height={100}
            className="max-w-10 max-h-10 rounded-full"
          />
        </div>
        <div className="flex flex-col overflow-hidden max-w-60">
          <h5 className="font-medium text-ellipsis whitespace-nowrap text-primary-dark dark:text-primary-light leading-6">{user?.name}</h5>
          <p className="font-medium text-ellipsis whitespace-nowrap text-[10px] text-quaternary">{user?.email}</p>
        </div>
      </Link>
      <div className="max-h-56 min-h-56 overflow-y-auto text-primary-dark dark:text-primary-light">
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
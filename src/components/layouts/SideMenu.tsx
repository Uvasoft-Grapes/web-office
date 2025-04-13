"use client"

import { userContext } from "@/src/context/UserContext";
import { getAvatars } from "@/src/utils/avatars";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA, TypeMenuData } from "@/src/utils/data";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { LuLogOut } from "react-icons/lu";

export default function SideMenu({ activeMenu }:{ activeMenu:string }) {
  const router = useRouter();

  const { user, clearUser } = useContext(userContext);
  const [sideMenuData, setSideMenuData] = useState<TypeMenuData[]>([]);

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    router.push("/auth/login");
  };

  useEffect(() => {
    if(user) setSideMenuData(user.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    return () => {};
  },[user]);

  return(
    <nav className="w-64 max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)] overflow-hidden bg-primary-light dark:bg-primary-dark border-r border-secondary-light dark:border-secondary-dark">
      <div className="flex flex-col items-center justify-center gap-1 mb-7 pt-5">
        <div className="border-2 border-primary-dark dark:border-primary-light rounded-full">
          <Image 
            src={user?.profileImageUrl || getAvatars()[0]}
            alt="Imagen de perfil"
            width={100}
            height={100}
            className="size-20 rounded-full"
          />
        </div>
      {user?.role === "admin" &&
        <div className="font-semibold text-primary-light dark:text-primary-dark bg-blue-light dark:bg-blue-dark px-3 py-0.5 rounded mt-1 text-[10px]">
          Admin
        </div>
      }
        <h5 className="font-medium text-primary-dark dark:text-primary-light leading-6 mt-3">{user?.name}</h5>
        <p className="font-medium text-[12px] text-quaternary">{user?.email}</p>
      </div>
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
      <button type="button" onClick={handleLogout} className={`flex items-center gap-4 w-full text-[15px] px-5 h-12 cursor-pointer text-red-600 dark:text-red-500 bg-linear-to-r from-transparent hover:to-red-200 dark:hover:to-red-950 hover:border-r-2 duration-300`}>
        <LuLogOut className="text-xl"/>
        Salir
      </button>
    </nav>
  );
};
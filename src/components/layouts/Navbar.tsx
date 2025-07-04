"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuLogOut, LuMenu, LuX } from "react-icons/lu";
import { PiDesktopDuotone } from "react-icons/pi";
import { useAuth } from "@context/AuthContext";
import { getAvatars } from "@utils/avatars";
import SideMenu from "@components/layouts/SideMenu";

export default function Navbar({ activeMenu }:{ activeMenu:string }) {
  const { user, logout, desk } = useAuth();

  const [openSideMenu, setOpenSideMenu] = useState(false);

  return(
    <header className="flex items-center justify-between gap-5 w-full max-w-[1750px] bg-tertiary-light dark:bg-tertiary-dark border-b border-tertiary-light dark:border-tertiary-dark backdrop-blur-[2px] h-[56px] pl-4 pr-8 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <button onClick={()=>setOpenSideMenu(!openSideMenu)} className="text-basic hover:text-quaternary cursor-pointer duration-300"> {/* xl:hidden */}
        {openSideMenu ?
          <LuX className="text-2xl"/>
        :
          <LuMenu className="text-2xl"/>
        }
        </button>
        <Link href="/auth/profile" className="hidden sm:flex items-center gap-2 px-4 w-full rounded-xl font-medium text-sm py-2 hover:bg-primary-light dark:hover:bg-primary-dark cursor-pointer duration-300">
          <PiDesktopDuotone className="text-2xl text-basic"/>
          <h2 className="font-medium text-xl text-basic">{desk?.title}</h2>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/auth/profile" className="flex items-center gap-2 group">
          <Image src={user?.profileImageUrl || getAvatars()[0]} alt="Avatar" width={1000} height={1000} className="size-8 rounded-full"/>
          <span className="absolute top-full right-5 hidden group-hover:inline px-4 py-2 mt-1 rounded-md bg-tertiary-light dark:bg-tertiary-dark">
            <p className="font-semibold text-sm text-basic">{user?.name}</p>
            <p className="font-semibold text-xs text-quaternary">{user?.email}</p>
          </span>
        </Link>
        <button type="button" onClick={logout} className={`cursor-pointer text-primary-dark dark:text-primary-light hover:text-red-light dark:hover:text-red-dark duration-300 group`}>
          <LuLogOut className="text-2xl"/>
          <span className="absolute top-full right-5 hidden group-hover:inline px-4 py-2 mt-1 rounded-md text-nowrap font-medium text-sm text-basic bg-tertiary-light dark:bg-tertiary-dark">Cerrar sesión</span>
        </button>
      </div>
    {openSideMenu &&
      <div className="fixed top-[56px] max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)] left-0 bg-primary-light">
        <SideMenu activeMenu={activeMenu}/>
      </div>
    }
    </header>
  );
};
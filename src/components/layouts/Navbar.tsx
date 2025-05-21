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
    <header className="flex items-center justify-between gap-5 w-full max-w-[1750px] bg-secondary-light dark:bg-secondary-dark border-b border-tertiary-light dark:border-tertiary-dark backdrop-blur-[2px] h-[56px] pl-4 pr-8 sticky top-0 z-30">
      <div className="flex items-center gap-5">
        <button onClick={()=>setOpenSideMenu(!openSideMenu)} className="text-basic hover:text-quaternary cursor-pointer duration-300"> {/* xl:hidden */}
        {openSideMenu ?
          <LuX className="text-2xl"/>
        :
          <LuMenu className="text-2xl"/>
        }
        </button>
        <Link href="/auth/profile" className="hidden sm:flex items-center gap-1 text-basic hover:text-blue-light dark:hover:text-blue-dark duration-300">
          <PiDesktopDuotone className="text-2xl"/>
          <h2 className="font-medium text-xl">{desk?.title}</h2>
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
        <button type="button" onClick={logout} className={`cursor-pointer text-basic hover:text-red-light dark:hover:text-red-dark duration-300 group`}>
          <LuLogOut className="text-2xl"/>
          <span className="absolute top-full right-5 hidden group-hover:inline px-4 py-2 mt-1 rounded-md text-nowrap font-medium text-sm text-basic bg-tertiary-light dark:bg-tertiary-dark">Cerrar sesión</span>
        </button>
      </div>
      {openSideMenu &&
        <div className="fixed top-[56px] left-0 bg-primary-light">
          <SideMenu activeMenu={activeMenu}/>
        </div>
      }
    </header>
  );
};
"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuLogOut, LuMenu, LuX } from "react-icons/lu";
import { PiDesktopDuotone } from "react-icons/pi";
import { useAuth } from "@shared/context/AuthContext";
import { getAvatars } from "@shared/utils/avatars";
import { PROFILE_PICTURE } from "@shared/utils/data";
import SideMenu from "@shared/layouts/SideMenu";

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
        <button type="button" onClick={logout} className={`card-btn-red h-8 sm:h-10`}>
          <LuLogOut className="text-xl"/>
          <span className="hidden sm:inline text-nowrap font-medium text-sm">Terminar sesión</span>
          {/* <span className="absolute top-full right-5 hidden group-hover:inline px-4 py-2 mt-1 rounded-md text-nowrap font-medium text-sm text-basic bg-tertiary-light dark:bg-tertiary-dark">Terminar turno</span> */}
        </button>
        <Link href="/auth/profile" className="flex items-center gap-2 group">
          <Image src={user?.profileImageUrl || getAvatars()[0]} alt="Avatar" width={1000} height={1000} className="size-8 rounded-full"/>
          <span className="absolute top-full right-5 hidden group-hover:flex gap-2 px-4 py-2 mt-1 rounded-md bg-tertiary-light dark:bg-tertiary-dark">
            <Image src={user?.profileImageUrl ? user.profileImageUrl : PROFILE_PICTURE} alt="Imagen de perfil" width={500} height={500} className="size-10 rounded-full"/>
            <div className="flex flex-col">
              <p className="font-semibold text-sm text-basic">{user?.name}</p>
              <p className="font-semibold text-xs text-quaternary">{user?.email}</p>
            </div>
          </span>
        </Link>
      </div>
    {openSideMenu &&
      <div className="fixed top-[56px] max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)] left-0 bg-primary-light">
        <SideMenu activeMenu={activeMenu}/>
      </div>
    }
    </header>
  );
};
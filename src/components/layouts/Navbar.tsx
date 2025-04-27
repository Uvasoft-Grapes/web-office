"use client"

import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "@components/layouts/SideMenu";
import { useContext, useState } from "react";
import { LuLogOut } from "react-icons/lu";
import { userContext } from "@context/UserContext";

export default function Navbar({ activeMenu }:{ activeMenu:string }) {
  const { user, clearUser } = useContext(userContext);

  const [openSideMenu, setOpenSideMenu] = useState(false);

  return(
    <header className="flex items-center justify-between gap-5 bg-secondary-light dark:bg-secondary-dark border-b border-secondary-light dark:border-secondary-dark backdrop-blur-[2px] h-[56px] px-7 sticky top-0 z-30">
      <div className="flex items-center gap-5">
        <button onClick={()=>setOpenSideMenu(!openSideMenu)} className="text-primary-dark dark:text-primary-light hover:text-quaternary cursor-pointer duration-300"> {/* xl:hidden */}
        {openSideMenu ?
          <HiOutlineX className="text-2xl"/>
        :
          <HiOutlineMenu className="text-2xl"/>
        }
        </button>
        <h2 className="hidden sm:inline font-medium text-lg text-primary-dark dark:text-primary-light">Web Office</h2>
      </div>
      <button type="button" onClick={clearUser} className={`relative cursor-pointer text-primary-dark dark:text-primary-light hover:text-red-light dark:hover:text-red-dark duration-300 group`}>
        <LuLogOut className="text-2xl"/>
        <span className="absolute right-full hidden group-hover:inline px-2 py-1 mt-1 rounded-full rounded-tr-none text-nowrap font-semibold text-xs text-primary-dark dark:text-primary-dark bg-secondary-light dark:bg-primary-light opacity-75">Cerrar sesión</span>
      </button>
      {openSideMenu &&
        <div className="fixed top-[56px] left-0 bg-primary-light">
          <SideMenu user={user} activeMenu={activeMenu}/>
        </div>
      }
    </header>
  );
};
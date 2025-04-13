"use client"

import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import { useState } from "react";

export default function Navbar({ activeMenu }:{ activeMenu:string }) {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return(
    <header className="flex items-center gap-5 bg-primary-light dark:bg-primary-dark border-b border-secondary-light dark:border-secondary-dark backdrop-blur-[2px] h-[56px] px-7 sticky top-0 z-30">
      <button onClick={()=>setOpenSideMenu(!openSideMenu)} className="text-primary-dark dark:text-primary-light cursor-pointer"> {/* xl:hidden */}
      {openSideMenu ?
        <HiOutlineX className="text-2xl"/>
      :
        <HiOutlineMenu className="text-2xl"/>
      }
      </button>
      <h2 className="font-medium text-lg text-primary-dark dark:text-primary-light">Web Office</h2>
      {openSideMenu &&
        <div className="fixed top-[56px] left-0 bg-primary-light">
          <SideMenu activeMenu={activeMenu}/>
        </div>
      }
    </header>
  );
};
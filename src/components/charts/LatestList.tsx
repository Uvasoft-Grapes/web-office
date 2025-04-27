import Link from "next/link";
import { ReactNode } from "react";
import { LuArrowRight } from "react-icons/lu";

export default function LatestList({ title, link, children }:{ title:string, link:string, children:ReactNode }) {
  return(
    <div className="md:col-span-2">
      <div className="card">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-lg md:text-xl text-primary-dark dark:text-primary-light">{title}</h5>
          <Link href={link} className="card-btn-fill">
            Ver todas
            <LuArrowRight className="text-base"/>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
};
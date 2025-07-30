import Link from "next/link";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { IoLink } from "react-icons/io5";

export default function Attachment({ link }:{ link:string }) {
  return(
    <Link href={link} target="_blank" className="flex justify-between items-center gap-2 px-4 py-2 rounded-md text-xs bg-primary-light dark:bg-primary-dark hover:bg-tertiary-light dark:hover:bg-tertiary-dark duration-300 overflow-hidden">
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="min-w-5">
          <IoLink className="text-lg text-blue-light dark:text-blue-dark"/>
        </span>
        <span className="line-clamp-1 text-basic">
          {link}
        </span>
      </div>
      <span className="min-w-5">
        <LuSquareArrowOutUpRight className="text-xl text-blue-light dark:text-blue-dark"/>
      </span>
    </Link>
  );
};
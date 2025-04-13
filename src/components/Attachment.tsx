import Link from "next/link";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { IoLink } from "react-icons/io5";

export default function Attachment({ link }:{ link:string }) {
  return(
    <Link href={link} target="_blank" className="flex justify-between items-center px-4 py-2 rounded-md text-xs bg-primary-light dark:bg-primary-dark hover:bg-tertiary-light dark:hover:bg-tertiary-dark duration-300">
      <span className="flex items-center gap-2 text-primary-dark dark:text-primary-light">
        <IoLink className="text-lg text-blue-light dark:text-blue-dark"/>
        {link}
      </span>
      <LuSquareArrowOutUpRight className="text-xl text-blue-light dark:text-blue-dark"/>
    </Link>
  );
};
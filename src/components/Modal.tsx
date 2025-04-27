import { ReactNode } from "react";
import { FaRegCircleXmark } from "react-icons/fa6";

export default function Modal({ children, isOpen, onClose, title }:{ children:ReactNode, isOpen:boolean, onClose:()=>void, title:string }) {
  return(
    <div className={`${isOpen ? "fixed" : "hidden"} top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-screen max-h-full overflow-y-auto overflow-x-hidden bg-primary-dark/50 dark:bg-primary-light/50`}>
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-primary-light dark:bg-primary-dark rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 md:p-5 rounded-t border-b-2 border-secondary-light dark:border-secondary-dark">
            <h3 className="font-medium text-lg text-primary-dark dark:text-primary-light">{title}</h3>
            <button type="button" onClick={onClose} className="rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center text-primary-dark dark:text-primary-light hover:text-red-light dark:hover:text-red-dark cursor-pointer duration-300">
              <FaRegCircleXmark className="text-2xl"/>
            </button>
          </div>
          <div className="p-4 md:p-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
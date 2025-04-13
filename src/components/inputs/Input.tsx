import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export default function Input({ type, label, placeholder, value, onChange }:{ type:string, label:string, placeholder:string, value:string, onChange:(value:string)=>void }) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return(
    <div>
      <label htmlFor="" className="font-medium text-[13px] text-tertiary-dark dark:text-tertiary-light">{label}</label>
      <div className="w-full flex justify-between gap-3 px-4 py-3 mb-4 mt-3 rounded bg-secondary-light focus-within:bg-primary-light dark:bg-secondary-dark dark:focus-within:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark outline-none duration-300">
        <input type={type === "password" ? showPassword ? "text" : "password" : type} placeholder={placeholder} defaultValue={value} onChange={(e)=>onChange(e.target.value)} className="w-full bg-transparent outline-none font-medium text-primary-dark dark:text-primary-light"/>
      {type === "password" && 
        <button className="cursor-pointer duration-300">
        {showPassword ?
          <FaRegEye size={22} onClick={toggleShowPassword} className="text-blue-light dark:text-blue-dark"/>
        :
          <FaRegEyeSlash size={22} onClick={toggleShowPassword} className="text-quaternary"/>
        }
        </button>
      }
      </div>
    </div>
  );
};
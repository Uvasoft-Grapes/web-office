import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export default function PasswordInput({ autoComplete, name, label, placeholder }:{ autoComplete:string, name:string, label:string, placeholder:string }) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return(
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-sm text-tertiary-dark dark:text-tertiary-light">{label}</label>
      <div className="w-full flex justify-between gap-3 px-4 py-3 rounded bg-secondary-light focus-within:bg-primary-light dark:bg-secondary-dark dark:focus-within:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark outline-none duration-300">
        <input name={name} type={showPassword ? "text" : "password"} autoComplete={autoComplete} placeholder={placeholder} className="w-full bg-transparent outline-none font-medium text-basic"/>
        <button type="button" className="cursor-pointer duration-300">
        {showPassword ?
          <FaRegEye size={22} onClick={toggleShowPassword} className="text-blue-light dark:text-blue-dark"/>
        :
          <FaRegEyeSlash size={22} onClick={toggleShowPassword} className="text-quaternary"/>
        }
        </button>
      </div>
    </div>
  );
};
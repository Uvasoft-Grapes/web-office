import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

export default function SelectDropdown({ options, value, placeholder, onChange }:{ options:{ label:string, value:string }[], value:string, placeholder:string, onChange:(value:string)=>void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option:string) => {
    onChange(option);
    setIsOpen(false);
  };


  return(
    <div className="relative w-full">
      <button type="button" onClick={()=>setIsOpen(!isOpen)} className="flex justify-between items-center w-full px-2.5 py-3 mt-2 rounded-md font-medium text-sm text-primary-dark dark:text-primary-light bg-secondary-light dark:bg-secondary-dark focus-within:bg-primary-light dark:focus-within:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark">
        {value ? options.find((opt) => opt.value === value)?.label : placeholder}
        <span className="ml-2 text-lg">
          <LuChevronDown className={`${isOpen && "rotate-180"} duration-300`}/>
        </span>
      </button>
    {isOpen && 
      <ul className="absolute w-full mt-1 rounded-md text-primary-dark dark:text-primary-light bg-primary-light dark:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark shadow-md z-10" onMouseLeave={()=>setIsOpen(false)}>
      {options.map((opt, index) => (
        <li key={`select_${index}`} onClick={()=>handleSelect(opt.value)} className={`px-3 py-2 font-medium text-sm hover:bg-tertiary-light dark:hover:bg-tertiary-dark cursor-pointer ${opt.value === value && "hidden"}`}>
          {opt.label}
        </li>
      ))}
      </ul>
    }
    </div>
  );
};
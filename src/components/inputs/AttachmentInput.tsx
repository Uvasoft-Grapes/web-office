import { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { IoLink } from "react-icons/io5";

export default function AttachmentInput({ attachments, setAttachments }:{ attachments:string[], setAttachments:(attachments:string[])=>void }) {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if(option.trim()) setAttachments([ ...attachments, option.trim() ]);
    setOption("");
  };

  const handleDeleteOption = (index:number) => {
    const updatedList = attachments.filter((attachment, attachmentIndex) => attachmentIndex !== index);
    setAttachments(updatedList);
  };

  return(
    <div>
      <ul className="flex flex-col gap-1">
      {attachments.map((attachment, index) => (
        <li key={index} className="flex justify-between px-3 py-2 rounded-md bg-primary-light dark:bg-primary-dark hover:bg-tertiary-light dark:hover:bg-tertiary-dark border border-tertiary-light dark:border-tertiary-dark duration-300">
          <div className="flex-1 flex items-center gap-2">
            <IoLink className="text-xl text-blue-light dark:text-blue-dark"/>
            <p className="text-sm text-primary-dark dark:text-primary-light">{attachment}</p>
          </div>
          <button type="button" onClick={() => handleDeleteOption(index)} className="cursor-pointer">
            <HiOutlineTrash className="text-lg text-primary-dark dark:text-primary-light hover:text-red-light dark:hover:text-red-dark duration-300"/>
          </button>
        </li>
      ))}
      </ul>
      <div className="flex items-center gap-5 mt-4">
        <div className="flex items-center gap-2 w-full px-3 py-3 rounded-md font-medium text-sm text-primary-dark dark:text-primary-light bg-secondary-light dark:bg-secondary-dark focus-within:bg-primary-light dark:focus-within:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark duration-300 group">
          <IoLink className="text-xl text-quaternary/50"/>
          <input
            type="text"
            placeholder="Introducir enlace"
            defaultValue={option}
            onChange={(e)=>setOption(e.target.value)}
            className="flex-1 outline-none placeholder:text-quaternary/50"
          />
        </div>
        <button type="button" onClick={handleAddOption} className="card-btn-fill text-nowrap">
          <HiMiniPlus className="text-lg"/> Agregar
        </button>
      </div>
    </div>
  );
};
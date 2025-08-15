import { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { IoLink } from "react-icons/io5";

export default function AttachmentInput({ label, attachments, setAttachments }:{ label?:string, attachments:string[], setAttachments:(attachments:string[])=>void }) {
  const [link, setLink] = useState("");

  const handleAddOption = () => {
    if(link.trim()) setAttachments([ ...attachments, link.trim() ]);
    setLink("");
    const input = document.getElementById("attachment-input") as HTMLInputElement;
    if(input) input.value = "";
  };

  const handleDeleteOption = (index:number) => {
    const updatedList = attachments.filter((attachment, attachmentIndex) => attachmentIndex !== index);
    setAttachments(updatedList);
  };

  return(
    <div className="flex flex-col gap-1">
      <label className="flex gap-1 font-medium text-sm text-tertiary-dark dark:text-tertiary-light">
        {label}
        {/* <IoLink className="text-xl"/> */}
      </label>
      <ul className="flex flex-col">
      {attachments.map((attachment, index) => (
        <li key={index} className="flex justify-between px-3 py-2 my-0.5 rounded-md bg-primary-light dark:bg-primary-dark hover:bg-tertiary-light dark:hover:bg-tertiary-dark border border-tertiary-light dark:border-tertiary-dark duration-300">
          <div className="flex-1 flex items-center gap-2">
            <IoLink className="text-xl text-blue-light dark:text-blue-dark"/>
            <p className="text-sm text-basic">{attachment}</p>
          </div>
          <button type="button" onClick={() => handleDeleteOption(index)} className="cursor-pointer">
            <HiOutlineTrash className="text-lg text-basic hover:text-red-light dark:hover:text-red-dark duration-300"/>
          </button>
        </li>
      ))}
      </ul>
      <div className="flex items-center gap-2">
        <input
          id="attachment-input"
          type="text"
          placeholder="Introducir enlace"
          onChange={(e)=>setLink(e.target.value)}
          className="w-full px-3 py-3 outline-none rounded-md font-medium text-sm text-basic bg-secondary-light dark:bg-secondary-dark focus-within:bg-primary-light dark:focus-within:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark placeholder:text-quaternary/50 duration-300"
        />
        <button type="button" onClick={handleAddOption} className="card-btn text-nowrap max-w-1/4">
          <HiMiniPlus className="text-xl"/>
          <span className="hidden sm:inline font-semibold text-sm">Agregar</span>
        </button>
      </div>
    </div>
  );
};
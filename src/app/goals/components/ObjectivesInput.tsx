import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { HiOutlineTrash, HiMiniPlus } from "react-icons/hi2";
import { TypeObjective } from "@shared/utils/types";

export default function ObjectivesInput({ list, setList }:{ list:TypeObjective[], setList:(list:TypeObjective[])=>void }) {
  const handleAddObjective = () => {
    const objectiveInput = document.getElementById("objective-input") as HTMLInputElement;
    const dateInput = document.getElementById("date-input") as HTMLInputElement;
    if(!objectiveInput || !dateInput) return;
    const dueDate = dateInput.value ? parseISO(dateInput.value) : undefined;
    if(objectiveInput.value.trim() && dueDate) {
      setList([ ...list, { text:objectiveInput.value.trim(), dueDate, completed:false } ]);
      objectiveInput.value = "";
      dateInput.value = "";
    }
  };

  const handleDeleteObjective = (index:number) => {
    const updatedList = list.filter((objective, i) => i !== index);
    setList(updatedList);
  };

  return(
    <div className="flex flex-col gap-1">
      <label className="font-medium text-sm text-tertiary-dark dark:text-tertiary-light">Objetivos</label>
      <ul className="flex flex-col">
      {list.map((objective, i) => (
        <li key={i} className="flex items-center justify-between gap-3 px-3 py-2 my-0.5 rounded-md bg-secondary-light dark:bg-secondary-dark hover:bg-primary-light dark:hover:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark duration-300">
          <div className="flex-1 flex items-center gap-2">
            <span className="self-start font-bold text-sm text-quaternary">{i < 9 ? `0${i + 1}` : i + 1}</span>
            <div className="flex flex-col gap-0.5">
              <p className="font-medium text-sm text-basic">{objective.text}</p>
              <p className="font-medium text-xs text-quaternary">{format(objective.dueDate, "dd/MM/yyyy", { locale:es })}</p>
            </div>
          </div>
          <button type="button" onClick={() => handleDeleteObjective(i)} className="h-fit cursor-pointer">
            <HiOutlineTrash className="text-lg text-primary-dark dark:text-primary-light hover:text-red-dark duration-300"/>
          </button>
        </li>
      ))}
      </ul>
      <div className="flex items-center gap-2">
        <input
          id="objective-input"
          type="text"
          placeholder="Introducir objetivo"
          className="w-full px-3 py-3 outline-none rounded-md font-medium text-sm text-basic focus-within:bg-primary-light dark:focus-within:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark placeholder:text-quaternary/50 duration-300"
        />
        <input
          id="date-input"
          type="date"
          className="w-full px-3 py-3 outline-none rounded-md font-medium text-sm text-basic focus-within:bg-primary-light dark:focus-within:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark placeholder:text-quaternary/50 duration-300"
        />
        <button type="button" onClick={handleAddObjective} className="card-btn text-nowrap">
          <HiMiniPlus className="text-lg"/>
          <span className="hidden sm:inline">Agregar</span>
        </button>
      </div>
    </div>
  );
};
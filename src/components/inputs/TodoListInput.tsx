import { TypeTodo } from "@/src/utils/types";
import { useState } from "react";
import { HiOutlineTrash, HiMiniPlus } from "react-icons/hi2";

export default function TodoListInput({ todoList, setTodoList }:{ todoList:TypeTodo[], setTodoList:(todoList:TypeTodo[])=>void }) {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if(option.trim()) setTodoList([ ...todoList, { text:option.trim(), completed:false } ]);
    setOption("");
  };

  const handleDeleteOption = (index:number) => {
    const updatedList = todoList.filter((todo, todoIndex) => todoIndex !== index);
    setTodoList(updatedList);
  };

  return(
    <div>
      <ul className="flex flex-col gap-1">
      {todoList.map((todo, index) => (
        <li key={index} className="flex justify-between px-3 py-2 rounded-md bg-primary-light dark:bg-primary-dark hover:bg-tertiary-light dark:hover:bg-tertiary-dark border border-tertiary-light dark:border-tertiary-dark duration-300">
          <div className="flex-1 flex items-center gap-2">
            <span className="font-bold text-sm text-quaternary">{index < 9 ? `0${index + 1}` : index + 1}</span>
            <p className="text-sm text-primary-dark dark:text-primary-light">
              {todo.text}
            </p>
          </div>
          <button type="button" onClick={() => handleDeleteOption(index)} className="cursor-pointer">
            <HiOutlineTrash className="text-lg text-primary-dark dark:text-primary-light hover:text-red-light dark:hover:text-red-dark duration-300"/>
          </button>
        </li>
      ))}
      </ul>
      <div className="flex items-center gap-5 mt-4">
        <input
          type="text"
          placeholder="Introducir pendiente"
          defaultValue={option}
          onChange={(e)=>setOption(e.target.value)}
          className="w-full px-3 py-3 outline-none rounded-md font-medium text-sm text-primary-dark dark:text-primary-light bg-secondary-light dark:bg-secondary-dark focus-within:bg-primary-light dark:focus-within:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark placeholder:text-quaternary/50 duration-300"
        />
        <button type="button" onClick={handleAddOption} className="card-btn-fill text-nowrap">
          <HiMiniPlus className="text-lg"/> Agregar
        </button>
      </div>
    </div>
  );
};
import { TypeTodo } from "@utils/types";
import { useState } from "react";
import { HiOutlineTrash, HiMiniPlus } from "react-icons/hi2";

export default function TodoListInput({ label, todoList, setTodoList }:{ label:string, todoList:TypeTodo[], setTodoList:(todoList:TypeTodo[])=>void }) {
  const [todo, setTodo] = useState("");

  const handleAddTodo = () => {
    if(todo.trim()) setTodoList([ ...todoList, { text:todo.trim(), completed:false } ]);
    setTodo("");
    const input = document.getElementById("todo-input") as HTMLInputElement;
    if(input) input.value = "";
  };

  const handleDeleteTodo = (index:number) => {
    const updatedList = todoList.filter((todo, todoIndex) => todoIndex !== index);
    setTodoList(updatedList);
  };

  return(
    <div className="flex flex-col gap-1">
      <label className="font-medium text-sm text-tertiary-dark dark:text-tertiary-light">{label}</label>
      <ul className="flex flex-col">
      {todoList.map((todo, index) => (
        <li key={index} className="flex justify-between gap-3 px-3 py-2 my-0.5 rounded-md bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark border border-tertiary-light dark:border-tertiary-dark duration-300">
          <div className="flex-1 flex items-center gap-2">
            <span className="self-start font-bold text-sm text-quaternary">{index < 9 ? `0${index + 1}` : index + 1}</span>
            <p className="text-sm text-basic">
              {todo.text}
            </p>
          </div>
          <button type="button" onClick={() => handleDeleteTodo(index)} className="h-fit cursor-pointer">
            <HiOutlineTrash className="text-lg text-primary-dark dark:text-primary-light hover:text-red-light dark:hover:text-red-dark duration-300"/>
          </button>
        </li>
      ))}
      </ul>
      <div className="flex items-center gap-2">
        <input
          id="todo-input"
          type="text"
          placeholder="Pendiente"
          onChange={(e)=>setTodo(e.target.value)}
          className="w-full px-3 py-3 outline-none rounded-md font-medium text-sm text-basic bg-secondary-light dark:bg-secondary-dark focus-within:bg-primary-light dark:focus-within:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark placeholder:text-quaternary/50 duration-300"
        />
        <button type="button" onClick={handleAddTodo} className="card-btn max-w-1/4 text-nowrap">
          <HiMiniPlus className="text-xl"/>
          <span className="hidden sm:inline font-semibold text-sm">Agregar</span>
        </button>
      </div>
    </div>
  );
};
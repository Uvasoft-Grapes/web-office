import { useState } from "react";
import { TypeTodo } from "@shared/utils/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuGrip, LuPlus, LuTrash2 } from "react-icons/lu";

type Props = {
  label: string;
  todoList: TypeTodo[];
  setTodoList: (todoList: TypeTodo[]) => void;
};

type TodoItemId = `item-${number}`;

function SortableItem({
  id,
  todo,
  onDelete,
  onEdit,
}: {
  id: TodoItemId;
  index: number;
  todo: TypeTodo;
  onDelete: () => void;
  onEdit: (newText: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    animateLayoutChanges: (args) =>
      defaultAnimateLayoutChanges({
        ...args,
        wasDragging: true,
      }),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(editText.trim());
      setIsEditing(false);
    }
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center justify-between gap-3 h-14 px-3 py-2 my-0.5 rounded-md bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark border border-tertiary-light dark:border-tertiary-dark transition-all duration-300 ${
        isDragging
          ? "opacity-80 scale-[1.03] shadow-lg dark:shadow-black/50 z-50"
          : ""
      }`}
    >
      <div className="flex-1 flex items-center gap-2">
        {/* Handle de arrastre solo en el icono */}
        <span
          {...listeners}
          className="h-full cursor-grab active:cursor-grabbing select-none"
        >
          <LuGrip className="text-xl text-quaternary" />
        </span>

        {isEditing ? (
          <div className="input-container">
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
              autoFocus
              className="input"
            />
          </div>
        ) : (
          <p
            className="text-sm text-basic w-full"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.text}
          </p>
        )}
      </div>
      {/* Botón de eliminar sin interferir con drag */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onDelete();
        }}
        className="h-fit"
      >
        <LuTrash2 className="text-lg text-primary-dark dark:text-primary-light hover:text-red-light dark:hover:text-red-dark duration-300" />
      </button>
    </li>
  );
}

export default function TodoListInput({
  label,
  todoList,
  setTodoList,
}: Props) {
  const [todo, setTodo] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddTodo = () => {
    if (todo.trim())
      setTodoList([...todoList, { text: todo.trim(), completed: false }]);
    setTodo("");
  };

  const handleDeleteTodo = (index: number) => {
    setTodoList(todoList.filter((_, i) => i !== index));
  };

  const handleEditTodo = (index: number, newText: string) => {
    const updated = [...todoList];
    updated[index].text = newText;
    setTodoList(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return; // se soltó fuera de una lista

    const activeId = active.id as TodoItemId;
    const overId = over.id as TodoItemId;

    if (activeId !== overId) {
      const oldIndex = todoList.findIndex((_, i) => `item-${i}` === activeId);
      const newIndex = todoList.findIndex((_, i) => `item-${i}` === overId);
      setTodoList(arrayMove(todoList, oldIndex, newIndex));
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium text-sm text-tertiary-dark dark:text-tertiary-light">
        {label}
      </label>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={todoList.map((_, i) => `item-${i}` as TodoItemId)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col">
            {todoList.map((todo, index) => (
              <SortableItem
                key={`item-${index}`}
                id={`item-${index}`}
                index={index}
                todo={todo}
                onDelete={() => handleDeleteTodo(index)}
                onEdit={(newText) => handleEditTodo(index, newText)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={todo}
          placeholder="Pendiente"
          onChange={(e) => setTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
          className="w-full px-3 py-3 outline-none rounded-md font-medium text-sm text-basic bg-secondary-light dark:bg-secondary-dark focus-within:bg-primary-light dark:focus-within:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark placeholder:text-quaternary/50 duration-300"
        />
        <button
          type="button"
          onClick={handleAddTodo}
          className="card-btn max-w-1/4 text-nowrap"
        >
          <LuPlus className="text-xl" />
          <span className="hidden sm:inline font-semibold text-sm">
            Agregar
          </span>
        </button>
      </div>
    </div>
  );
}
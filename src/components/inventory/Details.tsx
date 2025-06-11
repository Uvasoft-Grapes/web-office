import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LuPencil } from "react-icons/lu";
import { useAuth } from "@context/AuthContext";
import { ICONS } from "@utils/data";
import { TypeMovement } from "@utils/types";
import AvatarGroup from "@components/users/AvatarGroup";
import Modal from "@components/Modal";
import MovementForm from "@components/inventory/MovementForm";

export default function MovementDetails({ movement, refresh }:{ movement:TypeMovement, refresh:()=>void }) {
  const { user } = useAuth();
  const { inventory, product, createdBy, type, category, description, quantity, date, status } = movement;

  const [openForm, setOpenForm] = useState(false);

  const getStatusTagColor = (value:string) => {
    switch (value) {
      case "Cancelado":
        return "text-red-light dark:text-red-dark bg-red-light/10 dark:bg-red-dark/10";
      case "Pendiente":
        return "text-yellow-light dark:text-yellow-dark bg-yellow-light/10 dark:bg-yellow-dark/10";
      case "Finalizado":
        return "text-green-light dark:text-green-dark bg-green-light/10 dark:bg-green-dark/10";
      default:
        return "text-quaternary bg-quaternary/10";
    }
  };

  const getIcon = (index:number) => {
    const Icon = ICONS[index];
    return <Icon className="text-xl text-primary-dark dark:text-primary-light"/>
  };

  const handleEdit = () => {
    refresh();
    setOpenForm(false);
  };

  return(
    <div className="flex-1 flex flex-col gap-2 max-h-full">
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
        <div>
          <label className="font-medium text-sm text-tertiary-dark dark:text-tertiary-light">Descripción</label>
          <textarea readOnly rows={3} value={description} placeholder="Sin descripción" className="flex-1 p-4 w-full rounded font-medium text-lg bg-secondary-light dark:bg-secondary-dark border border-tertiary-light dark:border-tertiary-dark overflow-y-auto"/>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="">
            <AvatarGroup avatars={[{ name:createdBy.name||"", img:createdBy.profileImageUrl||"" }]} maxVisible={1}/>
          </div>
          <p className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-y-0.5 gap-x-1 h-10 px-2 sm:px-2 rounded text-nowrap font-semibold text-xs sm:text-sm bg-secondary-light dark:bg-secondary-dark`}>
            {category.label}
          </p>
          <p className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-y-0.5 gap-x-1 h-10 px-2 sm:px-2 rounded text-nowrap font-semibold text-xs sm:text-sm bg-secondary-light dark:bg-secondary-dark`}>
            {format(date, "dd/MM/yyyy", { locale:es })}
          </p>
          <p className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-y-0.5 gap-x-1 h-10 px-2 sm:px-2 rounded text-nowrap font-semibold text-xs sm:text-sm ${getStatusTagColor(status)}`}>
            {status}
          </p>
          <p className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-y-0.5 gap-x-1 h-10 px-2 sm:px-2 rounded text-nowrap font-semibold text-xs sm:text-sm ${type === "inflow" ? "text-green-light dark:text-green-dark bg-green-light/25 dark:bg-green-dark/25" : "text-red-light dark:text-red-dark bg-red-light/25 dark:bg-red-dark/25"}`}>
            {type === "inflow" ? "+" : "-"} {quantity}
          </p>
        </div>
        <div className="card flex flex-wrap gap-2 min-h-fit bg-secondary-light dark:bg-secondary-dark hover:bg-primary-light dark:hover:bg-primary-dark duration-300 cursor-pointer">
          <div className="flex gap-2">
            <div className="flex flex-col items-center">
              <span className="flex items-center justify-center size-16 md:size-20 rounded-xl text-primary-dark dark:text-primary-light bg-tertiary-light dark:bg-tertiary-dark">
                {getIcon(category.icon || 0)}
              </span>
              <p className="font-medium text-xs text-quaternary line-clamp-1">{product.category.label || "Sin categoría"}</p>
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <p className="font-semibold text-base sm:text-lg text-basic line-clamp-2">{product.title}</p>
              <p className="font-medium text-xs sm:text-sm text-quaternary line-clamp-1">{product.description}</p>
              <p className="font-medium text-xs sm:text-sm text-quaternary line-clamp-1">${product.price}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
      {user?.role === "admin" || user?.role === "owner" &&
        <button type="button" onClick={()=>setOpenForm(true)} className="flex-1 sm:flex-auto card-btn-fill w-fit sm:max-w-52">
          <LuPencil className="text-xl"/>
          Editar
        </button>
      }
      </div>
      <Modal title="Editar Movimiento" isOpen={openForm} onClose={()=>setOpenForm(false)}>
        {openForm && <MovementForm inventory={inventory} values={movement} type={movement.type} refresh={handleEdit}/>}
      </Modal>
    </div>
  );
};

{/* <div className="flex flex-wrap gap-2 min-w-full">
  <span className="flex-1 flex items-center justify-center text-center font-semibold text-xs sm:text-sm px-4 py-1 rounded-full text-primary-dark dark:text-primary-light bg-tertiary-light dark:bg-tertiary-dark">{product.stock}</span>
  <span className="flex-1 flex items-center justify-center text-center font-semibold text-xs sm:text-sm px-4 py-1 rounded-full text-primary-dark dark:text-primary-light bg-tertiary-light dark:bg-tertiary-dark">${product.price}</span>
  <span className="flex-1 flex items-center justify-center text-center font-semibold text-xs sm:text-sm px-4 py-1 rounded-full text-primary-dark dark:text-primary-light bg-tertiary-light dark:bg-tertiary-dark">{category}</span>
</div> */}
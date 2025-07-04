import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LuPencil } from "react-icons/lu";
import { useAuth } from "@context/AuthContext";
import { TypeReport } from "@utils/types";
import { getAvatars } from "@utils/avatars";
import AvatarGroup from "@components/users/AvatarGroup";
import Modal from "@components/Modal";
import ReportForm from "@components/reports/Form";

export default function Report({ report, refresh }:{ report:TypeReport, refresh:()=>void }) {
  const { user } = useAuth();

  const [openReport, setOpenReport] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  return(
    <>
      <li key={report._id} onClick={()=>setOpenReport(true)} className="card flex flex-col gap-2 min-h-44 max-h-48 bg-secondary-light dark:bg-secondary-dark hover:bg-transparent cursor-pointer duration-300">
        <div className="flex flex-wrap-reverse justify-between gap-2">
          <span className="px-2 sm:px-4 py-0.5 rounded text-nowrap font-semibold text-xs text-blue-light dark:text-blue-dark bg-blue-light/20 dark:bg-blue-dark/20">{report.folder.title}</span>
          <span className="font-semibold text-xs text-quaternary">{format(report.date, "dd/MM/yyyy", { locale:es })}</span>
        </div>
        <p className="flex-1 line-clamp-4 font-medium text-sm text-basic">{report.title}</p>
        <div className="flex justify-end">
          <AvatarGroup avatars={[ { name:report.createdBy.name || "", img:report.createdBy.profileImageUrl || getAvatars()[0].src } ]} maxVisible={1}/>
        </div>
      </li>
      <Modal title={report.title} onClose={()=>setOpenReport(false)} isOpen={openReport}>
        <div className="flex-1 flex flex-col gap-4 max-h-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="px-2 sm:px-4 py-0.5 rounded text-nowrap font-semibold text-xs text-blue-light dark:text-blue-dark bg-blue-light/20 dark:bg-blue-dark/20">{report.folder.title}</span>
            <span className="font-semibold text-quaternary">{format(report.date, "dd/MM/yyyy", { locale:es })}</span>
          </div>
          <div>
            <AvatarGroup avatars={[ { name:report.createdBy.name || "", img:report.createdBy.profileImageUrl || getAvatars()[0].src } ]} maxVisible={1}/>
          </div>
          <textarea readOnly value={report.description} placeholder="Sin descripción" className="flex-1 p-4 rounded font-medium text-lg text-primary-dark dark:text-primary-light bg-secondary-light dark:bg-secondary-dark border border-tertiary-light dark:border-tertiary-dark overflow-y-auto"/>
        {user && (user.role === "owner" || user.role === "admin") &&
          <div className="flex flex-row sm:flex-col items-end">
            <button type="button" onClick={()=>setOpenForm(true)} className="flex-1 sm:flex-auto card-btn-fill w-fit sm:min-w-52">
              <LuPencil className="text-xl"/>
              Editar
            </button>
          </div>
        }
        <Modal title={"Editar Evento"} isOpen={openForm} onClose={()=>setOpenForm(false)}>
          {openForm && <ReportForm values={report} onClose={()=>setOpenForm(false)} refresh={refresh}/>}
        </Modal>
        </div>
      </Modal>
    </>
  );
};
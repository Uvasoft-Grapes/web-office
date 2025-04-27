export default function DeleteAlert({ content, onDelete }:{ content:string, onDelete:()=>void }) {
  return(
    <div className="flex justify-between mt-6">
      <p className="font-medium text-primary-dark dark:text-primary-light">{content}</p>
      <button type="button" onClick={onDelete} className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-md whitespace-nowrap font-semibold text-xs md:text-sm text-primary-light dark:text-primary-dark hover:text-red-light dark:hover:text-red-dark bg-red-light dark:bg-red-dark hover:bg-transparent border border-red-light dark:border-red-dark cursor-pointer duration-300">Eliminar</button>
    </div>
  );
};
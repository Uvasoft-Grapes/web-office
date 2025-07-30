import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export default function DateTimeInput({ name, defaultValue, label, disabled }: { name:string, defaultValue?:string, label:string, disabled?:boolean }) {
  return(
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-sm text-tertiary-dark dark:text-tertiary-light">{label}</label>
      <div className="flex justify-between items-center w-full px-2.5 py-3 rounded-md font-medium text-basic bg-secondary-light dark:bg-secondary-dark focus-within:bg-primary-light dark:focus-within:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark">
        <input type="datetime-local"
          name={name}
          lang="es-MX"
          defaultValue={defaultValue && format(parseISO(defaultValue), "yyyy-MM-dd'T'HH:mm", { locale:es })}
          disabled={disabled}
          className="w-full bg-transparent outline-none font-medium text-basic disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  );
};
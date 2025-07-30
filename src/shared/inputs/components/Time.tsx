export default function TimeInput({ name, defaultValue, label }: { name:string, defaultValue?:string, label:string }) {
  return(
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-sm text-tertiary-dark dark:text-tertiary-light">{label}</label>
      <div className="flex justify-between items-center w-full px-2.5 py-3 rounded-md font-medium text-sm text-basic bg-secondary-light dark:bg-secondary-dark focus-within:bg-primary-light dark:focus-within:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark">
        <input type="time"
          name={name}
          defaultValue={defaultValue}
          className="w-full bg-transparent outline-none font-medium text-basic"
          lang="es-MX"
        />
      </div>
    </div>
  );
};
export default function TextInput({ autoComplete, name, label, placeholder, defaultValue }:{ autoComplete?:string, name:string, label:string, placeholder:string, defaultValue?:string }) {
  return(
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-sm text-tertiary-dark dark:text-tertiary-light">{label}</label>
      <div className="w-full flex justify-between gap-3 rounded bg-secondary-light focus-within:bg-primary-light dark:bg-secondary-dark dark:focus-within:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark outline-none duration-300">
        <input id={name} type="text" autoComplete={autoComplete} name={name} placeholder={placeholder} defaultValue={defaultValue} className="w-full bg-transparent outline-none px-4 py-3 font-medium text-basic"/>
      </div>
    </div>
  );
};
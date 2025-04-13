export default function InputText({ autoComplete, label, placeholder, value, onChange }:{ autoComplete?:string, label:string, placeholder:string, value:string, onChange:(value:string)=>void }) {
  return(
    <div>
      <label htmlFor={autoComplete} className="font-medium text-[13px] text-tertiary-dark dark:text-tertiary-light">{label}</label>
      <div className="w-full flex justify-between gap-3 px-4 py-3 mb-4 mt-3 rounded bg-secondary-light focus-within:bg-primary-light dark:bg-secondary-dark dark:focus-within:bg-primary-dark border border-tertiary-light dark:border-tertiary-dark outline-none duration-300">
        <input type="text" autoComplete={autoComplete} name={autoComplete} placeholder={placeholder} defaultValue={value} onChange={(e)=>onChange(e.target.value)} className="w-full bg-transparent outline-none font-medium text-primary-dark dark:text-primary-light"/>
      </div>
    </div>
  );
};
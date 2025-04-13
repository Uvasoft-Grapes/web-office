export default function Todo({ text, check, onChange }:{ text:string, check?:boolean, onChange:()=>void }) {
  return(
    <div className="flex items-center gap-1 w-full">
      <input type="checkbox" checked={check} onChange={onChange} className="size-5 rounded-sm outline-none text-blue-light bg-quaternary border-quaternary cursor-pointer"/>
      <p className="text-sm text-primary-dark dark:text-primary-light">{text}</p>
    </div>
  );
}
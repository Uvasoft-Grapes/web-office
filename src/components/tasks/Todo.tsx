export default function Todo({ loading, text, check, onChange }:{ loading:boolean, text:string, check?:boolean, onChange:()=>void }) {
  return(
    <div className="flex items-start gap-1 w-full">
      <input type="checkbox" checked={check} disabled={loading} onChange={onChange} className="min-w-5 min-h-5 rounded-sm outline-none text-blue-light bg-quaternary border-quaternary cursor-pointer"/>
      <p className="text-sm text-basic">{text}</p>
    </div>
  );
}
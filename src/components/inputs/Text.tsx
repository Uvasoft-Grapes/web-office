export default function TextInput({ autoComplete, name, label, placeholder, defaultValue }:{ autoComplete?:string, name:string, label:string, placeholder:string, defaultValue?:string }) {
  return(
    <div className="input-label-container">
      <label htmlFor={name} className="input-label">{label}</label>
      <div className="input-container">
        <input id={name} type="text" autoComplete={autoComplete} name={name} placeholder={placeholder} defaultValue={defaultValue} className="input"/>
      </div>
    </div>
  );
};
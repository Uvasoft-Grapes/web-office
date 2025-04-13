export default function InfoBox({ label, value }:{ label:string, value?:string }) {
  return(
    <>
      <label className="font-semibold text-xs text-quaternary">{label}</label>
      <p className="font-medium text-sm text-tertiary-dark dark:text-tertiary-light">{value}</p>
    </>
  );
};
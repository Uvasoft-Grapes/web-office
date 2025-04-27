export default function CustomTooltipPie({ active, payload }:{ active?:boolean, payload?:{ name:string, value:number }[] }) {
  if(active && payload && payload.length) {
    return(
      <div className="bg-primary-light dark:bg-primary-dark shadow-md rounded-lg p-2 border border-quaternary">
        <p className={`mb-1 text-xs font-semibold ${payload[0].name === "Pendiente" && "text-red-light dark:text-red-dark"} ${payload[0].name === "En curso" && "text-yellow-light dark:text-yellow-dark"} ${payload[0].name === "Finalizada" && "text-green-light dark:text-green-dark"}`}>{payload[0].name}</p>
        <p className="font-medium text-sm text-quaternary">
          {`Cantidad: `}
          <span className="font-medium text-tertiary-dark dark:text-tertiary-light">{payload[0].value}</span>
        </p>
      </div>
    );
  };
  return null;
};
export default function CustomTooltipBar({ active, payload }:{ active?:boolean, payload?:{ payload:{ priority:string, count:number } }[] }) {
  if(active && payload && payload.length) {
    return(
      <div className="bg-primary-light dark:bg-primary-dark p-2 rounded-lg shadow-md border border-quaternary">
        <p className={`font-semibold text-xs ${payload[0].payload.priority === "Alta" && "text-red-light dark:text-red-dark"} ${payload[0].payload.priority === "Media" && "text-yellow-light dark:text-yellow-dark"} ${payload[0].payload.priority === "Baja" && "text-green-light dark:text-green-dark"}`}>{payload[0].payload.priority}</p>
        <p className="font-medium text-sm text-quaternary">
          {`Cantidad: `}
          <span className="text-tertiary-dark dark:text-tertiary-light">{payload[0].payload.count}</span>
        </p>
      </div>
    );
  };
  return null;
};
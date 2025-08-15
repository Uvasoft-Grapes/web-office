export default function CustomLegendBar({ payload }:{ payload?:{ payload:{ value:string, color:string } }[] }) {
  return(
    <div className="flex flex-wrap justify-center gap-2 mt-4 space-x-6">
    {payload?.map((payload, index) => (
      <div key={`legend-${index}`} className="flex items-center space-x-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload.payload.color }}></div>
        <span className="text-xs font-medium text-quaternary">{payload.payload.value}</span>
      </div>
    ))}
    </div>
  );
};
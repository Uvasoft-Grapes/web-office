export default function InfoCard({ label, value, color }:{ label:string, value:string, color:string }) {
  return(
    <div className="flex items-center gap-3 overflow-hidden">
      <div className={`flex items-center gap-2`}>
        <span className={`min-w-2 min-h-2 rounded-full ${color}`}/>
        <p className="text-ellipsis font-medium text-xs sm:text-sm md:text-[16px] text-quaternary">
          <span className="font-bold text-xs sm:text-sm md:text-[16px] text-primary-dark dark:text-primary-light">{`${value} `}</span>
          {label}
        </p>
      </div>
    </div>
  );
};
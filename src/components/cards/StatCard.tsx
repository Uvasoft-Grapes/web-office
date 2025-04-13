export default function StatCard({ label, count }:{ label:string, count:number }) {
  const getStatusTagColor = () => {
    switch (label) {
      case "Pendientes":
        return "text-red-light dark:text-red-dark bg-red-light/10 dark:bg-red-dark/10";
      case "En curso":
        return "text-yellow-light dark:text-yellow-dark bg-yellow-light/10 dark:bg-yellow-dark/10";
      case "Finalizadas":
        return "text-green-light dark:text-green-dark bg-green-light/10 dark:bg-green-dark/10";
      default:
        return "text-quaternary bg-quaternary/10";
    }
  };
  return(
    <p className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-y-0.5 gap-x-1 px-4 py-2 rounded font-semibold text-[8px] sm:text-[10px] ${getStatusTagColor()}`}>
      {`${count} `} <span className="text-nowrap">{label}</span>
    </p>
  );
};
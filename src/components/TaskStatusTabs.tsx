export default function TaskStatusTabs({ tabs, activeTab, setActiveTab }:{ tabs:{ label:string, count:number }[], activeTab:string, setActiveTab:(x:string)=>void }) {
  return(
    <div className="flex-1 min-w-full lg:min-w-fit mt-5 lg:mt-0 pb-2 sm:pb-0 overflow-x-auto">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button key={tab.label} type="button" onClick={()=>setActiveTab(tab.label)} className={`relative flex-1 flex justify-center px-3 md:px-4 py-2 font-medium text-sm border-b-2 ${activeTab === tab.label ? "text-primary-dark dark:text-primary-light border-primary-dark dark:border-primary-light" : "text-quaternary border-transparent hover:border-quaternary"} cursor-pointer duration-300`}>
            <div className="flex items-center gap-2">
              <span className="text-nowrap text-sm">{tab.label}</span>
              <span className={`flex items-center justify-center size-5 rounded-full font-semibold text-xs text-primary-light dark:text-primary-dark ${activeTab === tab.label ? "bg-primary-dark dark:bg-primary-light" : "bg-quaternary"}`}>{tab.count}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
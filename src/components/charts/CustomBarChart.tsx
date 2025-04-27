import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import CustomTooltipBar from "@components/charts/CustomTooltipBar";

export default function CustomBarChart({ title, data }: { title:string, data:{ priority:string, count:number }[]|undefined }) {
  const getBarColor = (entry:{ priority:string }) => {
    switch (entry.priority) {
      case "Alta":
        return "#fb2c36";
      case "Media":
        return "#efb100";
      case "Baja":
        return "#00c951";
      default:
        return "#79716b";
    };
  };

  return(
    <div className="">
      <div className={`card ${data === undefined && "opacity-25 animate-pulse"}`}>
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-lg md:text-xl text-primary-dark dark:text-primary-light">{title}</h5>
        </div>
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid stroke="none"/>
              <XAxis dataKey="priority" tick={{ fontSize:14, fontWeight:600 }} />
              <YAxis tick={{ fontSize:14, fontWeight:"bold" }}/>
              <Tooltip content={<CustomTooltipBar/>} cursor={{ fill:"transparent" }}/>
              <Bar
                dataKey="count"
                name="priority"
                fill="#000"
                radius={[10, 10, 0, 0]}
              >
                {data && data.map((entry, index) => (
                  <Cell key={index} fill={getBarColor(entry)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
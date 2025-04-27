import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import CustomTooltipPie from "@components/charts/CustomTooltipPie";
import CustomLegendPie from "@components/charts/CustomLegendPie";

export default function CustomPieChart({ title, data, colors }:{ title:string, data:{ status:string, count:number }[]|undefined, colors:string[] }) {
  return(
    <div>
      <div className={`card ${data === undefined && "opacity-25 animate-pulse"}`}>
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-lg md:text-xl text-primary-dark dark:text-primary-light">{title}</h5>
        </div>
        <ResponsiveContainer width="100%" height={325}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={130}
              innerRadius={100}
              labelLine={false}
            >
              {data && data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltipPie/>}/>
            <Legend content={<CustomLegendPie/>}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
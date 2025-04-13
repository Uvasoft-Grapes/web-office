import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import CustomTooltipPie from "./CustomTooltipPie";
import CustomLegendPie from "./CustomLegendPie";

export default function CustomPieChart({ data, colors }:{ data:{ status:string, count:number }[], colors:string[] }) {
  return(
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
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltipPie/>}/>
        <Legend content={<CustomLegendPie/>}/>
      </PieChart>
    </ResponsiveContainer>
  );
};
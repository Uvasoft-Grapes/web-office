import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import CustomTooltipBar from "./CustomTooltipBar";

export default function CustomBarChart({ data }: { data:{ priority:string, count:number }[] }) {
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
    <div className="mt-6 bg-secondary-light dark:bg-secondary-dark">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none"/>
          <XAxis dataKey="priority" tick={{ fontSize:12, fill:"#555" }} stroke="none"/>
          <YAxis tick={{ fontSize:12, fill:"#555" }} stroke="none"/>
          <Tooltip content={<CustomTooltipBar/>} cursor={{ fill:"transparent" }}/>
          <Bar
            dataKey="count"
            name="priority"
            fill="#FF8042"
            radius={[10, 10, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
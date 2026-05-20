import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", growth: 12 },
  { month: "Fev", growth: 18 },
  { month: "Mar", growth: 24 },
  { month: "Abr", growth: 32 },
  { month: "Mai", growth: 41 },
];

export function GrowthChart() {
  return (
    <div className="rounded-2xl border p-5">
      <h2 className="mb-4 text-lg font-semibold">
        Crescimento
      </h2>

      <div className="h-[280px] min-w-0 overflow-hidden">
        <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={240}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="growth" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/use-theme";

const classicChartColors = {
  members: "var(--brand-blue)",
  membersGlow: "var(--brand-blue-glow)",
  visitors: "var(--brand-green)",
  visitorsGlow: "var(--brand-green-glow)",
};

const blackChartColors = {
  members: "#d6a85f",
  membersGlow: "#f0d28a",
  visitors: "#8a8f98",
  visitorsGlow: "#b9bec7",
};

function usePresenceChartColors() {
  const { theme } = useTheme();

  return theme === "black" ? blackChartColors : classicChartColors;
}

function useChartReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));

    return () => window.cancelAnimationFrame(id);
  }, []);

  return ready;
}

function StableChartContainer({
  children,
  className = "h-full w-full",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) return;

    const observer = new ResizeObserver(() => {
      const rect = node.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) {
        setMounted(true);
      }
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {mounted ? children : null}
    </div>
  );
}

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--foreground)",
  boxShadow: "var(--shadow-card)",
};

interface BarProps {
  data: { grupo: string; membros: number; visitantes: number }[];
}

export function GroupsBarChart({ data }: BarProps) {
  const ready = useChartReady();
  const colors = usePresenceChartColors();

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            Relatório dos Grupos
          </h3>
          <p className="text-xs text-muted-foreground">Membros e visitantes por grupo familiar</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.members }} />
            Membros
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.visitors }} />
            Visitantes
          </span>
        </div>
      </div>
      <div className="mt-4 h-72 w-full min-w-0 overflow-hidden">
        {!ready || data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem dados cadastrados
          </div>
        ) : (
          <StableChartContainer>
            <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={240}>
              <BarChart data={data} barGap={6}>
                <defs>
                  <linearGradient id="gMembros" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.membersGlow} stopOpacity={1} />
                    <stop offset="100%" stopColor={colors.members} stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="gVisitantes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.visitorsGlow} stopOpacity={1} />
                    <stop offset="100%" stopColor={colors.visitors} stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="grupo"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => String(value).slice(0, 6)}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--accent)", opacity: 0.3 }}
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="membros" radius={[8, 8, 0, 0]} name="Membros" fill="url(#gMembros)" />
                <Bar
                  dataKey="visitantes"
                  radius={[8, 8, 0, 0]}
                  name="Visitantes"
                  fill="url(#gVisitantes)"
                />
              </BarChart>
            </ResponsiveContainer>
          </StableChartContainer>
        )}
      </div>
    </div>
  );
}

interface PieProps {
  membros: number;
  visitantes: number;
}

export function PresencePieChart({ membros, visitantes }: PieProps) {
  const ready = useChartReady();
  const colors = usePresenceChartColors();
  const total = membros + visitantes;
  const data = [
    { name: "Membros", value: membros, color: colors.members },
    { name: "Visitantes", value: visitantes, color: colors.visitors },
  ];
  return (
    <div
      data-chart="presence-pie"
      className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-[var(--shadow-card)] h-full"
    >
      <h3 className="text-base sm:text-lg font-semibold text-foreground">Membros vs Visitantes</h3>
      <p className="text-xs text-muted-foreground">Distribuição da presença</p>
      <div className="mt-4 h-72 w-full relative">
        {!ready || total === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem dados cadastrados
          </div>
        ) : (
          <>
            <StableChartContainer>
              <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={240}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="85%"
                    stroke="var(--card)"
                    strokeWidth={4}
                    paddingAngle={2}
                  >
                    {data.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ ...tooltipStyle, color: "#FFFFFF" }}
                    itemStyle={{ color: "#FFFFFF" }}
                    labelStyle={{ color: "#FFFFFF" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ color: "#FFFFFF", fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            </StableChartContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-6">
              <span className="text-3xl font-bold text-foreground">{total}</span>
              <span className="text-xs text-muted-foreground">Pessoas</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface AreaProps {
  data: { grupo: string; ofertas: number }[];
}

export function OffersAreaChart({ data }: AreaProps) {
  const ready = useChartReady();

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Ofertas por Grupo</h3>
          <p className="text-xs text-muted-foreground">Distribuição financeira</p>
        </div>
      </div>
      <div className="mt-4 h-64 w-full">
        {!ready || data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem ofertas registradas
          </div>
        ) : (
          <StableChartContainer>
            <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={240}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="gOfertas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-amber-glow)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--brand-amber)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="grupo"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => String(value).slice(0, 6)}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="ofertas"
                  stroke="var(--brand-amber-glow)"
                  strokeWidth={2.5}
                  fill="url(#gOfertas)"
                  name="Ofertas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </StableChartContainer>
        )}
      </div>
    </div>
  );
}

interface MonthlyProps {
  data: { mes: string; membros: number; visitantes: number; ofertas: number }[];
}

export function MonthlyEvolutionChart({ data }: MonthlyProps) {
  const ready = useChartReady();
  const colors = usePresenceChartColors();
  const empty = data.every((d) => d.membros === 0 && d.visitantes === 0 && d.ofertas === 0);
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Evolução Mensal</h3>
          <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.members }} />
            Membros
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.visitors }} />
            Visitantes
          </span>
        </div>
      </div>
      <div className="mt-4 h-72 w-full min-w-0 overflow-hidden">
        {!ready || empty ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sem histórico ainda
          </div>
        ) : (
          <StableChartContainer>
            <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={240}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="mes"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--foreground)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="membros"
                  stroke={colors.membersGlow}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: colors.membersGlow, stroke: colors.membersGlow }}
                  activeDot={{ r: 5, fill: colors.membersGlow, stroke: colors.membersGlow }}
                />
                <Line
                  type="monotone"
                  dataKey="visitantes"
                  stroke={colors.visitorsGlow}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: colors.visitorsGlow, stroke: colors.visitorsGlow }}
                  activeDot={{ r: 5, fill: colors.visitorsGlow, stroke: colors.visitorsGlow }}
                />
              </LineChart>
            </ResponsiveContainer>
          </StableChartContainer>
        )}
      </div>
    </div>
  );
}

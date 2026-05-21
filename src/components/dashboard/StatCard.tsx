import { ReactNode } from "react";
import { CountUp } from "@/components/ui/count-up";
import { useTheme } from "@/hooks/use-theme";

type Variant = "blue" | "green" | "amber" | "red";

const gradients: Record<Variant, string> = {
  blue: "var(--gradient-blue)",
  green: "var(--gradient-green)",
  amber: "var(--gradient-amber)",
  red: "var(--gradient-red)",
};

const glows: Record<Variant, string> = {
  blue: "var(--shadow-glow-blue)",
  green: "var(--shadow-glow-green)",
  amber: "var(--shadow-glow-amber)",
  red: "var(--shadow-glow-red)",
};

interface StatCardProps {
  title: string;
  /** Aceita string (formatado) ou number (anima com CountUp). */
  value: string | number;
  /** Formatador opcional usado quando `value` é number. */
  format?: (n: number) => string;
  delta?: string;
  icon: ReactNode;
  variant: Variant;
  /** Bloco secundário opcional renderizado à direita (ex.: "Ativos", "Crescimento"). */
  rightTitle?: string;
  rightValue?: string | number;
  rightFormat?: (n: number) => string;
}

export function StatCard(props: StatCardProps) {
  const { theme } = useTheme();
  const isPremiumDark = theme === "black";

  if (isPremiumDark) {
    return <PremiumDarkStatCard {...props} />;
  }

  return <BlueStatCard {...props} />;
}

/* ============================================================
   BLUE — original composition, untouched.
   ============================================================ */
function BlueStatCard({ title, value, delta, icon, variant, format, rightTitle, rightValue, rightFormat }: StatCardProps) {
  return (
    <div
      className="kpi-card group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-white backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1"
      style={{
        backgroundImage: gradients[variant],
        boxShadow: glows[variant],
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent opacity-70" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-opacity duration-300 group-hover:bg-white/20" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent" />
      <div className="relative flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] backdrop-blur-md transition-all duration-300">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          {rightTitle !== undefined ? (
            <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-5">
              <div className="min-w-1 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">{title}</p>
                <div className="mt-1 flex flex-wrap items-baseline gap-2">
                  <span
                    className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl"
                    style={{
                      textShadow:
                        "0 0 24px color-mix(in oklab, white 35%, transparent), 0 2px 18px rgba(0,0,0,0.35)",
                    }}
                  >
                    {typeof value === "number" ? <CountUp value={value} format={format} /> : value}
                  </span>
                </div>
              </div>
              <div
                aria-hidden
                className="hidden w-px self-stretch md:block"
                style={{
                  background:
                    "linear-gradient(180deg, transparent, rgba(255,255,255,0.35), transparent)",
                  boxShadow: "0 0 12px rgba(255,255,255,0.18)",
                }}
              />
              <div className="min-w-1 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">{rightTitle}</p>
                <div className="mt-1 flex flex-wrap items-baseline gap-2">
                  <span
                    className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl"
                    style={{
                      textShadow:
                        "0 0 22px color-mix(in oklab, white 30%, transparent), 0 2px 14px rgba(0,0,0,0.35)",
                    }}
                  >
                    {typeof rightValue === "number" ? <CountUp value={rightValue} format={rightFormat} /> : rightValue}
                  </span>
                  {delta && (
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium text-white/95">
                      {delta}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">{title}</p>
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                  {typeof value === "number" ? <CountUp value={value} format={format} /> : value}
                </span>
                {delta && (
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium text-white/95">
                    {delta}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PREMIUM DARK — executive intelligence cell.
   Completely different composition from Blue:
   - no gradients, no glows, no blurs, no hover-lift
   - mono ledger eyebrow, large thin numeric, mono delta tag
   - icon dissolves into a corner glyph mark
   - hairline gold baseline rule, dense vertical rhythm
   - designed to compose seamlessly inside the unified
     KPI strip styled in premium-dark.css (`.grid:has(>.kpi-card)`)
   ============================================================ */
function PremiumDarkStatCard({ title, value, delta, icon, format, rightTitle, rightValue, rightFormat }: StatCardProps) {
  const isPositive = !!delta && !/^[-−]/.test(delta.trim());
  const deltaColor = isPositive
    ? "text-[rgba(214,168,95,0.92)] border-[rgba(214,168,95,0.28)]"
    : "text-[rgba(220,170,120,0.65)] border-[rgba(220,170,120,0.18)]";

  return (
    <div
      className="kpi-card group relative isolate flex flex-col justify-between overflow-hidden px-6 pt-5 pb-6"
      style={{
        minHeight: "138px",
        fontFeatureSettings: '"tnum" 1, "lnum" 1, "ss01" 1',
      }}
    >
      {/* Corner ledger coordinate — institutional grid mark */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[6px] w-[6px] border-l border-t border-[rgba(214,168,95,0.32)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[6px] w-[6px] border-r border-t border-[rgba(214,168,95,0.32)]"
      />

      {/* Glyph icon, dissolved into the surface */}
      <div
        aria-hidden
        className="absolute right-5 top-5 flex h-6 w-6 items-center justify-center text-[rgba(214,168,95,0.55)]"
        style={{
          // collapse the inner SVG color to gold ash
        }}
      >
        <span className="inline-flex h-6 w-6 items-center justify-center [&_svg]:!h-[13px] [&_svg]:!w-[13px] [&_svg]:!stroke-[rgba(214,168,95,0.6)] [&_svg]:![color:rgba(214,168,95,0.6)]">
          {icon}
        </span>
      </div>

      {/* Header row: mono eyebrow + ID strip */}
      <div className="flex items-center gap-2 pr-10">
        <span
          className="text-[9px] font-semibold uppercase text-[rgba(245,240,225,0.42)]"
          style={{ letterSpacing: "0.34em", fontFamily: "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace" }}
        >
          {title}
        </span>
        <span
          aria-hidden
          className="ml-auto h-px flex-1 max-w-[64px] bg-gradient-to-r from-[rgba(214,168,95,0.32)] to-transparent"
        />
      </div>

      {/* Metric block: financial typography, generous downward weight */}
      <div className="mt-auto flex flex-col items-start gap-3 pt-6 md:flex-row md:items-end md:justify-between">
        <span
          className="leading-none text-[rgba(245,240,225,0.97)]"
          style={{
            fontSize: "2.3rem",
            fontWeight: 300,
            letterSpacing: "-0.045em",
            fontVariantNumeric: "tabular-nums lining-nums",
          }}
        >
          {typeof value === "number" ? <CountUp value={value} format={format} /> : value}
        </span>

        {rightTitle !== undefined && (
          <div className="flex flex-col items-start gap-1 md:items-end md:pr-1">
            <span
              className="text-[9px] font-semibold uppercase text-[rgba(245,240,225,0.42)]"
              style={{ letterSpacing: "0.34em", fontFamily: "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace" }}
            >
              {rightTitle}
            </span>
            <span
              className="leading-none text-[rgba(245,240,225,0.97)]"
              style={{
                fontSize: "1.6rem",
                fontWeight: 300,
                letterSpacing: "-0.035em",
                fontVariantNumeric: "tabular-nums lining-nums",
              }}
            >
              {typeof rightValue === "number" ? <CountUp value={rightValue} format={rightFormat} /> : rightValue}
            </span>
          </div>
        )}

        {delta && (
          <span
            className={`shrink-0 translate-y-1 rounded-[2px] border bg-transparent px-[7px] py-[2px] uppercase md:translate-y-[-3px] ${deltaColor}`}
            style={{
              fontFamily: "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace",
              fontSize: "9.5px",
              letterSpacing: "0.10em",
              fontWeight: 500,
            }}
          >
            {delta}
          </span>
        )}
      </div>

      {/* Hairline gold baseline — institutional rhythm */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(214,168,95,0.35), transparent)",
        }}
      />
    </div>
  );
}

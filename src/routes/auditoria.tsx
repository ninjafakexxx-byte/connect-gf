import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  Search,
  Trash2,
  Pencil,
  Plus,
  LogIn,
  Ban,
  Check,
  AlertTriangle,
  Cog,
  Activity,
} from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { PageHeader } from "@/components/layout/PageHeader";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAudit } from "@/hooks/use-audit";
import {
  humanizeAudit,
  groupByDay,
  initials,
  relativeTime,
  VARIANT_STYLES,
  type AuditVariant,
} from "@/lib/audit-format";

export const Route = createFileRoute("/auditoria")({
  component: AuditoriaPage,
});

function AuditoriaPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <AuditoriaInner />
    </RoleGuard>
  );
}

const VARIANT_ICON: Record<AuditVariant, typeof Plus> = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  block: Ban,
  login: LogIn,
  warning: AlertTriangle,
  approve: Check,
  system: Cog,
};

function AuditoriaInner() {
  const { rows, loading } = useAudit();
  const [query, setQuery] = useState("");

  const humanized = useMemo(
    () =>
      rows.map((r) => ({
        raw: r,
        h: humanizeAudit(r as any),
      })),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return humanized;
    return humanized.filter(({ raw, h }) => {
      const hay = [h.actor, h.predicate, h.entity, raw.action, raw.entity ?? ""]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [humanized, query]);

  const grouped = useMemo(
    () =>
      groupByDay(
        filtered.map((f) => ({
          ...f.raw,
          __h: f.h,
        })) as any,
      ),
    [filtered],
  );

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        icon={<ShieldCheck className="h-5 w-5 text-white" />}
        title="Auditoria"
        subtitle="Centro operacional — toda atividade do sistema em tempo real"
      />

      {/* Premium search */}
      <div className="group relative">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/5 via-transparent to-violet-500/5 opacity-0 transition-opacity duration-500 group-focus-within:opacity-100" />
        <div className="relative flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 backdrop-blur-sm transition-all duration-300 focus-within:border-white/[0.12] focus-within:bg-white/[0.04] focus-within:shadow-[0_0_0_4px_rgba(56,189,248,0.06)]">
          <Search className="h-4 w-4 text-muted-foreground/70" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por usuário, ação ou entidade..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
          />
          <kbd className="hidden rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-muted-foreground/70 sm:inline-block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Activity feed */}
      <div className="space-y-10">
        {loading && (
          <div className="flex items-center justify-center gap-3 py-20 text-sm text-muted-foreground">
            <span className="h-2 w-2 animate-ping rounded-full bg-sky-400" />
            Carregando atividades…
          </div>
        )}

        {!loading && grouped.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/[0.06] bg-white/[0.02] px-6 py-24 text-center backdrop-blur-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.06]">
              <Activity className="h-6 w-6 text-muted-foreground/60" />
            </div>
            <p className="text-base font-medium text-foreground">Nenhuma atividade encontrada</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Quando algo acontecer no sistema, o registro aparecerá aqui em tempo real.
            </p>
          </div>
        )}

        {!loading &&
          grouped.map((bucket, bi) => (
            <section key={bucket.key} className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                  {bucket.label}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
                <span className="text-[11px] tabular-nums text-muted-foreground/60">
                  {bucket.rows.length}{" "}
                  {bucket.rows.length === 1 ? "registro" : "registros"}
                </span>
              </div>

              <ol className="relative space-y-1.5">
                {bucket.rows.map((row: any, idx) => {
                  const h = row.__h;
                  const styles = VARIANT_STYLES[h.variant as AuditVariant];
                  const Icon = VARIANT_ICON[h.variant as AuditVariant];
                  return (
                    <motion.li
                      key={row.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.28,
                        delay: Math.min(bi * 0.04 + idx * 0.015, 0.25),
                        ease: [0.2, 0.8, 0.2, 1],
                      }}
                      className="group relative flex items-center gap-4 rounded-2xl border border-transparent px-3 py-3 transition-all duration-300 hover:border-white/[0.06] hover:bg-white/[0.025] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]"
                    >
                      {/* Left: avatar */}
                      <div className="relative shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-[11px] font-semibold tracking-wider text-foreground/90 ring-1 ring-white/[0.06]">
                          {initials(h.actor)}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-background ${styles.iconBg}`}
                        >
                          <Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
                        </span>
                      </div>

                      {/* Center: content */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm leading-relaxed text-foreground">
                          <span className="font-semibold">{h.actor}</span>{" "}
                          <span className="text-muted-foreground">{h.predicate}</span>
                          {row.entity_id && (
                            <span className="ml-2 rounded-md bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/70">
                              {String(row.entity_id).slice(0, 6)}
                            </span>
                          )}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground/70">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${styles.badge}`}
                          >
                            <span className={`h-1 w-1 rounded-full ${styles.dot}`} />
                            {h.badgeLabel}
                          </span>
                          {row.details?.module && (
                            <>
                              <span className="text-muted-foreground/30">·</span>
                              <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-foreground/70">
                                {row.details.module}
                              </span>
                            </>
                          )}
                          {(row.profiles?.email || row.details?.user_email) && (
                            <>
                              <span className="text-muted-foreground/30">·</span>
                              <span className="truncate">
                                {row.profiles?.email ?? row.details?.user_email}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right: timestamp */}
                      <div className="hidden shrink-0 flex-col items-end text-right sm:flex">
                        <span className="text-[12px] font-medium text-foreground/85 tabular-nums">
                          {relativeTime(row.created_at)}
                        </span>
                        <span className="text-[10px] text-muted-foreground/55 tabular-nums">
                          {new Date(row.created_at).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </motion.li>
                  );
                })}
              </ol>
            </section>
          ))}
      </div>
    </div>
  );
}

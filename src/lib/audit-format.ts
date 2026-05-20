// Humanize audit logs into elegant Portuguese sentences.
// Used by the auditoria activity feed.

export type AuditVariant =
  | "create"
  | "update"
  | "delete"
  | "block"
  | "login"
  | "warning"
  | "approve"
  | "system";

const ENTITY_LABEL: Record<string, { singular: string; article: "o" | "a" | "um" | "uma" }> = {
  events: { singular: "evento", article: "um" },
  evento: { singular: "evento", article: "um" },
  members: { singular: "membro", article: "um" },
  membro: { singular: "membro", article: "um" },
  visitors: { singular: "visitante", article: "um" },
  visitante: { singular: "visitante", article: "um" },
  offers: { singular: "oferta", article: "uma" },
  oferta: { singular: "oferta", article: "uma" },
  goals: { singular: "meta", article: "uma" },
  meta: { singular: "meta", article: "uma" },
  users: { singular: "usuário", article: "um" },
  user: { singular: "usuário", article: "um" },
  profiles: { singular: "perfil", article: "um" },
  roles: { singular: "função", article: "uma" },
  reports: { singular: "relatório", article: "um" },
  notification: { singular: "notificação", article: "uma" },
  session: { singular: "sessão", article: "uma" },
  system: { singular: "sistema", article: "o" },
};

const ACTION_VERB: Record<string, { verb: string; variant: AuditVariant }> = {
  create: { verb: "criou", variant: "create" },
  created: { verb: "criou", variant: "create" },
  insert: { verb: "criou", variant: "create" },
  add: { verb: "adicionou", variant: "create" },

  update: { verb: "atualizou", variant: "update" },
  updated: { verb: "atualizou", variant: "update" },
  edit: { verb: "editou", variant: "update" },
  change: { verb: "alterou", variant: "update" },

  delete: { verb: "removeu", variant: "delete" },
  deleted: { verb: "removeu", variant: "delete" },
  remove: { verb: "removeu", variant: "delete" },
  destroy: { verb: "excluiu", variant: "delete" },

  block: { verb: "bloqueou", variant: "block" },
  ban: { verb: "baniu", variant: "block" },
  suspend: { verb: "suspendeu", variant: "block" },

  login: { verb: "entrou no sistema", variant: "login" },
  signin: { verb: "entrou no sistema", variant: "login" },
  logout: { verb: "saiu do sistema", variant: "login" },
  signout: { verb: "saiu do sistema", variant: "login" },

  approve: { verb: "aprovou", variant: "approve" },
  approved: { verb: "aprovou", variant: "approve" },
  publish: { verb: "publicou", variant: "approve" },

  warn: { verb: "emitiu um alerta sobre", variant: "warning" },
  warning: { verb: "emitiu um alerta sobre", variant: "warning" },
  reject: { verb: "rejeitou", variant: "warning" },
};

function splitAction(raw: string): { entityKey: string | null; verbKey: string } {
  // accept "events.create", "events:create", "create_event", "create"
  const norm = raw.trim().toLowerCase();
  if (norm.includes(".")) {
    const [e, v] = norm.split(".");
    return { entityKey: e, verbKey: v };
  }
  if (norm.includes(":")) {
    const [e, v] = norm.split(":");
    return { entityKey: e, verbKey: v };
  }
  return { entityKey: null, verbKey: norm };
}

export interface HumanizedAudit {
  /** "Willy" — display name extracted from log row */
  actor: string;
  /** "criou um evento" */
  predicate: string;
  /** Translated verb only ("criou") */
  verb: string;
  /** "evento" */
  entity: string;
  /** Semantic variant for badges / icons */
  variant: AuditVariant;
  /** Short label for badge ("Criação", "Login", …) */
  badgeLabel: string;
}

const VARIANT_LABEL: Record<AuditVariant, string> = {
  create: "Criação",
  update: "Atualização",
  delete: "Remoção",
  block: "Bloqueio",
  login: "Acesso",
  warning: "Alerta",
  approve: "Aprovação",
  system: "Sistema",
};

export function humanizeAudit(log: {
  action: string;
  entity?: string | null;
  entity_id?: string | null;
  user_id?: string | null;
  details?: Record<string, any> | null;
  profiles?: { full_name?: string | null; email?: string | null } | null;
}): HumanizedAudit {
  const d = log.details ?? {};

  // Prefer enriched fields written at log time.
  const actor =
    (d.user_name as string | undefined)?.trim() ||
    log.profiles?.full_name?.trim() ||
    log.profiles?.email?.split("@")[0] ||
    (d.user_email as string | undefined)?.split("@")[0] ||
    (log.user_id ? `Usuário ${log.user_id.slice(0, 4)}` : "Sistema");

  const { entityKey, verbKey } = splitAction(log.action || "");
  const entityRaw = (log.entity || entityKey || "registro").toLowerCase();
  const entityMeta = ENTITY_LABEL[entityRaw] ?? {
    singular: entityRaw,
    article: "um" as const,
  };

  const actionMeta = ACTION_VERB[verbKey] ?? {
    verb: verbKey || "executou ação em",
    variant: "system" as AuditVariant,
  };

  // Friendly entity reference: prefer the real name ("Culto Domingo") when
  // available, falling back to the article+singular noun.
  const friendlyName = (d.entity_name as string | undefined)?.trim();
  const entityRef = friendlyName
    ? `${entityMeta.singular} “${friendlyName}”`
    : `${entityMeta.article} ${entityMeta.singular}`;

  const predicate =
    actionMeta.variant === "login"
      ? actionMeta.verb
      : `${actionMeta.verb} ${entityRef}`;

  return {
    actor,
    predicate,
    verb: actionMeta.verb,
    entity: entityMeta.singular,
    variant: actionMeta.variant,
    badgeLabel: VARIANT_LABEL[actionMeta.variant],
  };
}

/** Group rows by relative day buckets — preserves original order within bucket. */
export function groupByDay<T extends { created_at: string }>(rows: T[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 7);

  const buckets: { key: string; label: string; rows: T[] }[] = [
    { key: "today", label: "Hoje", rows: [] },
    { key: "yesterday", label: "Ontem", rows: [] },
    { key: "week", label: "Esta semana", rows: [] },
    { key: "earlier", label: "Anterior", rows: [] },
  ];

  for (const r of rows) {
    const d = new Date(r.created_at);
    if (d >= today) buckets[0].rows.push(r);
    else if (d >= yesterday) buckets[1].rows.push(r);
    else if (d >= weekStart) buckets[2].rows.push(r);
    else buckets[3].rows.push(r);
  }

  return buckets.filter((b) => b.rows.length > 0);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

export function relativeTime(iso: string) {
  const d = new Date(iso);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);
  if (diff < 60) return "agora mesmo";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
  if (diff < 86400 * 7) return `há ${Math.floor(diff / 86400)} d`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export const VARIANT_STYLES: Record<
  AuditVariant,
  { badge: string; ring: string; iconBg: string; dot: string }
> = {
  create: {
    badge: "bg-sky-500/10 text-sky-300 border-sky-400/20",
    ring: "ring-sky-400/15",
    iconBg: "bg-sky-500/12 text-sky-300",
    dot: "bg-sky-400",
  },
  update: {
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20",
    ring: "ring-emerald-400/15",
    iconBg: "bg-emerald-500/12 text-emerald-300",
    dot: "bg-emerald-400",
  },
  delete: {
    badge: "bg-rose-500/10 text-rose-300 border-rose-400/20",
    ring: "ring-rose-400/15",
    iconBg: "bg-rose-500/12 text-rose-300",
    dot: "bg-rose-400",
  },
  block: {
    badge: "bg-red-600/15 text-red-300 border-red-500/30",
    ring: "ring-red-500/20",
    iconBg: "bg-red-600/15 text-red-300",
    dot: "bg-red-500",
  },
  login: {
    badge: "bg-violet-500/10 text-violet-300 border-violet-400/20",
    ring: "ring-violet-400/15",
    iconBg: "bg-violet-500/12 text-violet-300",
    dot: "bg-violet-400",
  },
  warning: {
    badge: "bg-orange-500/10 text-orange-300 border-orange-400/20",
    ring: "ring-orange-400/15",
    iconBg: "bg-orange-500/12 text-orange-300",
    dot: "bg-orange-400",
  },
  approve: {
    badge: "bg-amber-500/10 text-amber-300 border-amber-400/20",
    ring: "ring-amber-400/15",
    iconBg: "bg-amber-500/12 text-amber-300",
    dot: "bg-amber-400",
  },
  system: {
    badge: "bg-cyan-500/10 text-cyan-300 border-cyan-400/20",
    ring: "ring-cyan-400/15",
    iconBg: "bg-slate-500/15 text-cyan-200",
    dot: "bg-cyan-400",
  },
};

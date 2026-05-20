import { externalSupabase as supabase } from "@/integrations/external-supabase/client";

/**
 * Enrichment payload merged into `details` so we never need a schema change.
 * Frontend reads these to render humanized, enterprise-grade activity logs.
 */
export interface AuditEnrichment {
  /** Friendly entity name — e.g. "Culto Domingo" */
  entityName?: string;
  /** Module label — e.g. "Eventos", "Membros", "Sistema" */
  module?: string;
  /** Optional friendly action verb override — e.g. "publicou" */
  actionLabel?: string;
  /** Anything else relevant, will be merged into details */
  [key: string]: unknown;
}

const ENTITY_MODULE: Record<string, string> = {
  events: "Eventos",
  evento: "Eventos",
  members: "Membros",
  member: "Membros",
  visitors: "Visitantes",
  visitor: "Visitantes",
  offers: "Ofertas",
  offer: "Ofertas",
  goals: "Metas",
  goal: "Metas",
  user_roles: "Administração",
  profiles: "Usuários",
  user: "Usuários",
  users: "Usuários",
  system_settings: "Sistema",
  system: "Sistema",
};

function inferModule(entity?: string): string | undefined {
  if (!entity) return undefined;
  const key = entity.toLowerCase().split(".")[0];
  return ENTITY_MODULE[key];
}

/** Cached current-user identity to avoid an auth round-trip per log call. */
let cachedActor: { id: string; name: string; email: string | null } | null = null;
let cachedActorAt = 0;
const ACTOR_TTL = 60_000;

async function resolveActor(): Promise<typeof cachedActor> {
  if (cachedActor && Date.now() - cachedActorAt < ACTOR_TTL) return cachedActor;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  let fullName: string | null =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    null;

  // Best-effort profile lookup for a friendlier display name.
  if (!fullName) {
    try {
      const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      fullName = profile?.full_name ?? null;
    } catch {
      /* profile table optional — ignore */
    }
  }

  cachedActor = {
    id: user.id,
    name: fullName ?? user.email?.split("@")[0] ?? "Usuário",
    email: user.email ?? null,
  };
  cachedActorAt = Date.now();
  return cachedActor;
}

/** Reset the actor cache — call after sign-out / sign-in. */
export function resetAuditActorCache() {
  cachedActor = null;
  cachedActorAt = 0;
}

/**
 * Persist an audit entry, enriched with friendly user/entity/module metadata.
 *
 * Backward compatible signature: existing call sites that pass a plain
 * `details` object keep working — those details are merged with the
 * auto-enrichment.
 */
export async function logAudit(
  action: string,
  entity?: string,
  entityId?: string,
  details?: Record<string, unknown> & AuditEnrichment,
) {
  try {
    const actor = await resolveActor();
    if (!actor) return null;

    // Try to derive a friendly entity name from common payload fields if the
    // caller didn't supply one explicitly.
    const inferredName =
      (details?.entityName as string | undefined) ??
      (details?.entity_name as string | undefined) ??
      (details?.full_name as string | undefined) ??
      (details?.name as string | undefined) ??
      (details?.title as string | undefined) ??
      undefined;

    const moduleLabel =
      (details?.module as string | undefined) ?? inferModule(entity);

    const enrichedDetails: Record<string, unknown> = {
      // friendly fields the UI consumes directly
      user_name: actor.name,
      user_email: actor.email,
      entity_name: inferredName,
      module: moduleLabel,
      action_type: (details?.actionLabel as string | undefined) ?? action,
      // original caller payload (stripped of helper keys)
      ...stripHelpers(details),
    };

    const result = await (supabase as any)
      .from("audit_logs")
      .insert({
        user_id: actor.id,
        action,
        entity,
        entity_id: entityId,
        details: enrichedDetails,
      })
      .select();

    if (result.error) {
      console.error("[audit] insert error:", result.error);
    }
    return result;
  } catch (err) {
    console.error("[audit] fatal:", err);
    return null;
  }
}

function stripHelpers(d?: Record<string, unknown>): Record<string, unknown> {
  if (!d) return {};
  const { entityName, module: _m, actionLabel, ...rest } = d as any;
  void entityName;
  void _m;
  void actionLabel;
  return rest;
}
